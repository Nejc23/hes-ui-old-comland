import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { TouConfigSelectComponent } from 'src/app/features/tou-config-select/component/tou-config-select.component';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { FileGuid } from 'src/app/core/repository/interfaces/meter-units/meter-units-fw-upgrade.interface';
import { fwUploadFile } from 'src/app/core/repository/consts/meter-units.const';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { GridFilterParams, GridSearchParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { MeterUnitsTypeGridService } from '../../meter-units/types/services/meter-units-type-grid.service';
import { DataConcentratorUnitsOperationsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units-operations.service';
import { DataConcentratorUnitsGridService } from '../services/data-concentrator-units-grid.service';
import { FileInfo } from '@progress/kendo-angular-upload';

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
  allowedExtExplainText = $localize`can only upload one file.`;
  acceptExtensions = '.bin';
  public file: File;
  activate = false;

  public selectedRowsCount: number;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private dcuOperatrionService: DataConcentratorUnitsOperationsService,
    private toast: ToastNotificationService,
    private dcuGridService: DataConcentratorUnitsGridService,
    private authService: AuthService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.imageProperty]: [this.file, Validators.required],
      [this.imageGuidProperty]: ['']
    });
  }

  ngOnInit() {}

  // fillData(): IActionRequestDcuFwUpgradeData {
  //   const formData: IActionRequestDcuFwUpgradeData = {
  //     image: this.file,
  //     pageSize: this.actionRequest.pageSize,
  //     pageNumber: this.actionRequest.pageNumber,
  //     sort: this.actionRequest.sort,
  //     textSearch: this.actionRequest.textSearch,
  //     filter: this.actionRequest.filter,
  //     concentratorIds: this.actionRequest.deviceIds,
  //     excludeIds: this.actionRequest.excludeIds
  //   };
  //   return formData;
  // }

  resetAll() {
    this.form.reset();
    this.touConfigSelect.deselectAllRows();
  }

  upgrade() {
    const formData = new FormData();
    if (this.file) {
      formData.append('image', this.file, this.file?.name);
    }

    if (this.actionRequest && this.actionRequest.deviceIds && this.actionRequest.deviceIds.length > 0) {
      for (const deviceId of this.actionRequest.deviceIds) {
        formData.append('concentratorIds', deviceId);
      }
    }

    const request = this.dcuOperatrionService.postDcFwUpgrade(formData);
    const successMessage = $localize`FW Upgrade in progress`;
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
        if (result && result.length > 0) {
          this.dcuGridService.saveDcOperationRequestId(result);
        }
        this.modal.close();
        /*this.toast.infoToast(result.status);
          if (result.status.includes('waiting for activiation')) {
            this.activate = true;
          }
        }*/
      },
      error => {
        console.log('upgrade error', error);
      } // error
    );
  }

  activateMU() {
    this.toast.infoToast(' ');
  }

  cancel(reason: string = 'cancel') {
    this.modal.close(reason);
  }

  // successUploaded(event) {
  //   this.imgGuid = event.response.body;
  // }

  // uploadEvent(event) {
  //   const bearer = `bearer ${this.authService.user.id_token}`;
  //   event.headers = new HttpHeaders({ Authorization: bearer });
  //   if (this.authService.isRefreshNeeded2()) {
  //     this.authService
  //       .renewToken()
  //       .then(value => {
  //         this.authService.user = value;
  //         this.authService.saveTokenAndSetUserRights2(value, '');
  //       })
  //       .catch(err => {
  //         if (err.message === 'login_required') {
  //           this.authService.login().catch(err2 => console.log(err2));
  //         }
  //       });
  //   }
  // }

  // properties - START
  get imageGuidProperty() {
    return 'imageGuid';
  }
  get imageProperty() {
    return 'file';
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  public selected(event: any): void {
    console.log('selected ');
    event.files.forEach((file: FileInfo) => {
      if (file.rawFile) {
        this.file = file.rawFile;

        // const reader = new FileReader();

        // reader.onloadend = () => {
        //   this.file. = reader.result as Blob;
        // };

        // reader.readAsArrayBuffer(file.rawFile);
        // return reader
      }
    });
  }
}
