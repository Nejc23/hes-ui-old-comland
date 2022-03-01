import { HttpHeaders } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { fwUploadFile } from 'src/app/core/repository/consts/meter-units.const';
import { FileGuid } from 'src/app/core/repository/interfaces/meter-units/meter-units-fw-upgrade.interface';
import { IActionRequestFwUpgradeData, IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { TouConfigSelectComponent } from 'src/app/features/tou-config-select/component/tou-config-select.component';
import { environment } from 'src/environments/environment';
import { MeterUnitsTypeGridService } from './../../../types/services/meter-units-type-grid.service';
import { AppConfigService } from '../../../../../core/configuration/services/app-config.service';

@Component({
  selector: 'app-plc-meter-fw-upgrade',
  templateUrl: './plc-meter-fw-upgrade.component.html'
})
export class PlcMeterFwUpgradeComponent {
  @ViewChild(TouConfigSelectComponent, { static: true }) touConfigSelect;

  uploadDropSubtitle = this.translate.instant('COMMON.SELECTED-FILE-FORMAT');

  form: FormGroup;
  noConfig = false;
  apiUrl = environment.apiUrl;
  configRequiredText = this.translate.instant('COMMON.REQUIRED-FIELD');
  messageServerError = this.translate.instant('COMMON.SERVER-ERROR');
  actionRequest: IActionRequestParams;
  uploadSaveUrl = this.apiUrl + fwUploadFile;
  imgGuid: FileGuid = null;
  allowedExt = [];
  allowedExtExplainText = this.translate.instant('IMPORT-DEVICE-KEYS.UPLOAD-ONE-FILE');
  acceptExtensions = ['.img', '.bin', '.dat'];
  public files: Array<any>;
  activate = false;

  public selectedRowsCount: number;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private toast: ToastNotificationService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private authService: AuthService,
    private translate: TranslateService
  ) {
    if (AppConfigService.settings?.apiServer?.url !== '') {
      this.uploadSaveUrl = AppConfigService.settings?.apiServer?.url + fwUploadFile;
    }
    if (AppConfigService.settings?.apiServer?.fileStorageUrl !== '') {
      this.uploadSaveUrl = AppConfigService.settings?.apiServer?.fileStorageUrl + fwUploadFile;
    }
    this.form = this.createForm();
  }

  // properties - START
  get imageGuidProperty() {
    return 'imageGuid';
  }

  get imageProperty() {
    return 'files';
  }

  get imageIdenifyerProperty() {
    return 'imageIdentifyer';
  }

  get imageSizeProperty() {
    return 'imageSize';
  }

  get imageSignatureProperty() {
    return 'imageSignature';
  }

  get imageFillLastBlockProperty() {
    return 'imageFillLastBlock';
  }

  get imageActivateProperty() {
    return 'imageActivateImmediately';
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.imageProperty]: [this.files, Validators.required],
      [this.imageIdenifyerProperty]: [null, Validators.required],
      [this.imageSizeProperty]: [null, [Validators.required, Validators.maxLength(6)]],
      [this.imageSignatureProperty]: [null, Validators.required],
      [this.imageFillLastBlockProperty]: [false, Validators.required],
      [this.imageGuidProperty]: [''],
      [this.imageActivateProperty]: [false]
    });
  }

  fillData(): IActionRequestFwUpgradeData {
    const formData: IActionRequestFwUpgradeData = {
      imageIdent: this.form.get(this.imageIdenifyerProperty).value,
      fileId: this.form.get(this.imageGuidProperty).value,
      imageSize: parseInt(this.form.get(this.imageSizeProperty).value, 10),
      signature: this.form.get(this.imageSignatureProperty).value,
      overrideFillLastBlock: this.form.get(this.imageFillLastBlockProperty).value,
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      deviceIds: this.actionRequest.deviceIds,
      excludeIds: this.actionRequest.excludeIds,
      activate: this.form.get(this.imageActivateProperty).value
    };
    return formData;
  }

  resetAll() {
    this.form.reset();
    this.touConfigSelect.deselectAllRows();
  }

  upgrade() {
    if (this.imgGuid != null && this.imgGuid.imageGuid && this.imgGuid.imageGuid.length > 0) {
      this.form.get(this.imageGuidProperty).setValue(this.imgGuid.imageGuid);
    } else if (this.imgGuid) {
      this.form.get(this.imageGuidProperty).setValue(this.imgGuid);
    }

    const values = this.fillData();
    const request = this.myGridService.createFwUpgrade(values);
    const successMessage = this.translate.instant('PLC-METER.UPLOAD-METER-IMAGE');
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        if (result && result.requestId.length > 0) {
          this.meterUnitsTypeGridService.saveMyGridLinkRequestId(result.requestId);
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

  activateMU() {
    this.toast.infoToast(' ');
  }

  cancel(reason: string = 'cancel') {
    this.modal.close(reason);
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

  isFormValid(): boolean {
    return this.form.valid;
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }
}
