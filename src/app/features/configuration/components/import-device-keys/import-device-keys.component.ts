import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import * as _ from 'lodash';
import { ImportDeviceKeysStaticTextService } from '../../services/import-device-keys-static-text.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { gridRefreshInterval } from 'src/environments/config';
import { MeterUnitsTypeGridService } from 'src/app/features/meter-units/types/services/meter-units-type-grid.service';
import { importDeviceKeys } from 'src/app/core/repository/consts/crypto-lite.const';
import { CryptoImportResponse } from 'src/app/core/repository/interfaces/crypto-lite/crypto-import-response.interface';
import { CryptoImportCheckResponse } from 'src/app/core/repository/interfaces/crypto-lite/crypto-import-check-response.interface';
import { CryptoLiteService } from 'src/app/core/repository/services/crypto-lite/crypto-lite.service';
import { environment } from 'src/environments/environment';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';

@Component({
  selector: 'app-plc-meter-import-device-keys',
  templateUrl: './import-device-keys.component.html'
})
export class ImportDeviceKeysComponent implements OnInit, OnDestroy {
  headerTitle = this.staticextService.headerTitleImportDeviceKeys;

  form: FormGroup;
  fileTypeOptions: RadioOption[] = [
    { value: '1' as string, label: this.i18n('GULF1') },
    { value: '2' as string, label: this.i18n('GULF2') }
  ];
  fileTypeId = '1';
  uploadSaveUrl: string;
  allowedExt = [];
  allowedExtExplainText: string;
  public files: Array<any>;
  importResult: CryptoImportResponse;
  refreshInterval = gridRefreshInterval;
  allResultTexts = [];
  allErrorTexts = [];

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    public i18n: I18n,
    private staticextService: ImportDeviceKeysStaticTextService,
    public gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private authService: AuthService,
    private toast: ToastNotificationService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private cryptoLiteService: CryptoLiteService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.allowedExtExplainText = this.i18n('can only upload one file.');
    this.form = this.createForm();
  }

  setFileTypeId() {
    this.uploadSaveUrl = `${environment.apiUrl}${importDeviceKeys}/GULF${this.fileTypeId}`;
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.fileTypeProperty]: ['1', Validators.required],
      [this.gulfProperty]: [this.files, Validators.required]
    });
  }

  ngOnInit() {
    this.setFileTypeId();
    this.createForm();
    this.breadcrumbService.setPageName(this.headerTitle);
  }

  ngOnDestroy(): void {}

  successUploaded(event) {
    this.importResult = JSON.parse(event.response.body);
    if (this.importResult.errorCode > 0) {
      this.toast.errorToast(this.importResult.errorMsg);
    }
    if (this.importResult.errorCode === 0) {
      this.meterUnitsTypeGridService.saveCryptoimportId(this.importResult.uuid);
      this.toast.successToast(this.staticextService.uploadSuccessful);
    }
  }

  uploadEvent(event) {
    const bearer = `bearer ${this.authService.user.id_token}`;
    event.headers = new HttpHeaders({ Authorization: bearer });
    if (this.authService.isRefreshNeeded2()) {
      this.authService
        .renewToken()
        .then(value => {
          this.authService.user = value;
          this.authService.saveTokenAndSetUserRights2(value, '');
        })
        .catch(err => {
          if (err.message === 'login_required') {
            this.authService.login().catch(err2 => console.log(err2));
          }
        });
    }
  }

  changeReadOptionId() {
    this.fileTypeId = this.form.get(this.fileTypeProperty).value;
    this.setFileTypeId();
  }

  checkImportResults() {
    const ids = this.meterUnitsTypeGridService.getAllCryptoImportIds();
    const results: CryptoImportCheckResponse[] = [];
    if (ids && ids.length > 0) {
      ids.forEach(x => {
        this.cryptoLiteService.checkCryptoImport(x).subscribe(o => {
          results.push(o);
          if (o.status === 'SUCCESS') {
            this.allResultTexts.push(
              `File ${o.fileName} imported successfully, number of imported meters ${o.meterCount}, number of imported keys ${o.keyCount}.`
            );
            this.meterUnitsTypeGridService.removeCryptoImportId(o.uuid);
          }
          if (o.errorMsg) {
            this.allErrorTexts.push(this.i18n(`File ${o.fileName} import failed, error message: ${o.errorMsg}`));
            this.meterUnitsTypeGridService.removeCryptoImportId(o.uuid);
          }
        });
      });
    }
  }

  get gulfProperty() {
    return 'gulf';
  }

  get fileTypeProperty() {
    return 'fileType';
  }
}
