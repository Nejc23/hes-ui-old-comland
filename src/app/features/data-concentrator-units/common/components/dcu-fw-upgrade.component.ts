import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FileInfo } from '@progress/kendo-angular-upload';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { IActionRequestFwUpgradeData, IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { DataConcentratorUnitsOperationsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units-operations.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { TouConfigSelectComponent } from 'src/app/features/tou-config-select/component/tou-config-select.component';
import { DataConcentratorUnitsGridService } from '../../services/data-concentrator-units-grid.service';
import { ModalService } from '../../../../core/modals/services/modal.service';
import { fwUploadFile } from '../../../../core/repository/consts/meter-units.const';
import { environment } from '../../../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { FileGuid } from '../../../../core/repository/interfaces/meter-units/meter-units-fw-upgrade.interface';
import { AppConfigService } from '../../../../core/configuration/services/app-config.service';
import { MyGridLinkService } from '../../../../core/repository/services/myGridLink/myGridLink.service';

@Component({
  selector: 'app-dcu-fw-upgrade',
  templateUrl: './dcu-fw-upgrade.component.html'
})
export class DcuFwUpgradeComponent implements OnInit {
  @ViewChild(TouConfigSelectComponent, { static: true }) touConfigSelect;

  form: FormGroup;
  noConfig = false;
  actionRequest: IActionRequestParams;
  allowedExt = [];
  acceptExtensions = [];
  public file: File;
  activate = false;
  differentTypes = false;

  public selectedRowsCount: number;
  public alertText: string;
  uploadDropSubtitle = '';

  apiUrl = environment.apiUrl;
  uploadSaveUrl = this.apiUrl + '/' + fwUploadFile;
  imgGuid: FileGuid = null;
  allowedExtExplainText = this.translate.instant('TOOLS.IMPORT-DEVICE-KEYS.UPLOAD-ONE-FILE');

  ac750 = false;
  // AC750  = .bin
  // DC450G3 and AmeraDC .zip

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private dcuOperatrionService: DataConcentratorUnitsOperationsService,
    private toast: ToastNotificationService,
    private dcuGridService: DataConcentratorUnitsGridService,
    private translate: TranslateService,
    private authService: AuthService,
    private modalService: ModalService,
    private myGridService: MyGridLinkService
  ) {
    this.form = this.createForm();
  }

  // properties - START
  get imageGuidProperty() {
    return 'imageGuid';
  }

  get imageProperty() {
    return 'file';
  }

  ngOnInit() {
    if (AppConfigService.settings?.apiServer?.url !== '') {
      this.uploadSaveUrl = AppConfigService.settings?.apiServer?.url + '/' + fwUploadFile;
    }
    if (this.actionRequest.types[0].toUpperCase() === 'AC750') {
      this.ac750 = true;
    }
    if (this.actionRequest.types.length > 1) {
      // Disable upload if multiple types
      this.differentTypes = true;
      // Clear alertText in case of multiple types
      this.alertText = '';
    } else {
      if (this.ac750) {
        this.allowedExt = ['bin'];
        this.acceptExtensions = ['.bin'];
      } else {
        this.allowedExt = ['zip'];
        this.acceptExtensions = ['.zip'];
      }
      this.uploadDropSubtitle = this.translate.instant('DCU.FILE-BIN-FORMAT', { supportedType: this.acceptExtensions });
    }
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.imageProperty]: [this.file, Validators.required],
      [this.imageGuidProperty]: ['']
    });
  }

  activateMU() {
    this.toast.infoToast(' ');
  }

  cancel(reason: string = 'cancel') {
    this.modal.close(reason);
  }

  // properties - END
  onDismiss() {
    this.modal.dismiss();
  }

  public selected(event: any): void {
    event.files.forEach((file: FileInfo) => {
      if (file.rawFile) {
        this.file = file.rawFile;
      }
    });
  }

  successUploaded(event) {
    this.imgGuid = JSON.parse(event.response.body);
  }

  uploadEvent(event) {
    const bearer = `bearer ${this.authService.user.id_token}`;
    event.headers = new HttpHeaders({ Authorization: bearer });
    if (this.authService.isRefreshNeeded2()) {
      this.authService
        .renewToken()
        .then((value) => {
          this.authService.user = value;
          this.authService.saveTokenAndSetUserRights2(value, '');
        })
        .catch((err) => {
          if (err.message === 'login_required') {
            this.authService.login().catch((err2) => console.log(err2));
          }
        });
    }
  }

  upgrade() {
    const values = this.fillData(this.actionRequest.concentratorIds);
    const request = this.myGridService.createConcFwUpgrade(values);

    const successMessage = this.translate.instant('PLC-METER.UPLOAD-METER-IMAGE');

    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        if (result && result.requestId.length > 0) {
        }
        this.modal.close(result.requestId);
        /*this.toast.infoToast(result.status);
          if (result.status.includes('waiting for activiation')) {
            this.activate = true;
          }
        }*/
      },
      () => {} // error
    );
  }

  fillData(concentratorIds: string[]): IActionRequestFwUpgradeData {
    const formData: IActionRequestFwUpgradeData = {
      concentratorIds: concentratorIds,
      fileId: this.imgGuid.imageGuid,
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      deviceIds: this.actionRequest.deviceIds,
      excludeIds: this.actionRequest.excludeIds
    };
    return formData;
  }
}
