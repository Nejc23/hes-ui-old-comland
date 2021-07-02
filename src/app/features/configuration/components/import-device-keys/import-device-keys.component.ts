import { FileUploadComponent } from '../../../../shared/forms/components/file-upload/file-upload.component';
import { Codelist } from '../../../../shared/repository/interfaces/codelists/codelist.interface';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { ImportDeviceKeysStaticTextService } from '../../services/import-device-keys-static-text.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { gridRefreshInterval } from 'src/environments/config';
import { MeterUnitsTypeGridService } from 'src/app/features/meter-units/types/services/meter-units-type-grid.service';
import { importDeviceKeys } from 'src/app/core/repository/consts/crypto-lite.const';
import { CryptoImportResponse } from 'src/app/core/repository/interfaces/crypto-lite/crypto-import-response.interface';
import { CryptoImportCheckResponse } from 'src/app/core/repository/interfaces/crypto-lite/crypto-import-check-response.interface';
import { CryptoLiteService } from 'src/app/core/repository/services/crypto-lite/crypto-lite.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { AppConfigService } from 'src/app/core/configuration/services/app-config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-plc-meter-import-device-keys',
  templateUrl: './import-device-keys.component.html'
})
export class ImportDeviceKeysComponent implements OnInit, OnDestroy {
  @ViewChild('fileUpload') fileUpload: FileUploadComponent;

  uploadDropSubtitle = this.translate.instant('TOOLS.IMPORT-DEVICE-KEYS.UPLOAD-TEXT');
  headerTitle = this.staticextService.headerTitleImportDeviceKeys;

  subtitle = this.translate.instant('TOOLS.IMPORT-DEVICE-KEYS.SUBTITLE');

  form: FormGroup;

  fileTypes: Codelist<string>[] = [
    { id: '1' as string, value: `CSV` },
    { id: '2' as string, value: `GULF_V1_1` },
    { id: '3' as string, value: `GULF_V2_0` },
    { id: '4' as string, value: `GULF_V2_3` },
    { id: '5' as string, value: `GULF_V2_4` },
    { id: '6' as string, value: `SMX_V1_3` }
  ];

  defaultFileType = this.fileTypes[4];
  fileTypeValue = this.defaultFileType.value;

  uploadSaveUrl: string;
  allowedExt = [];
  acceptExtensions = ['.xml', '.csv'];

  allowedExtExplainText: string;
  public files: Array<any>;
  importResult: CryptoImportResponse;
  refreshInterval = gridRefreshInterval;
  allResultTexts = [];
  allErrorTexts = [];

  constructor(
    private formBuilder: FormBuilder,
    private staticextService: ImportDeviceKeysStaticTextService,
    public gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private authService: AuthService,
    private toast: ToastNotificationService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private cryptoLiteService: CryptoLiteService,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService
  ) {
    this.allowedExtExplainText = this.translate.instant('TOOLS.IMPORT-DEVICE-KEYS.UPLOAD-ONE-FILE');
    this.form = this.createForm();
  }

  setFileTypeId() {
    let urlPath = '';
    if (AppConfigService.settings) {
      urlPath = AppConfigService.settings.apiServer.url;
    }
    this.uploadSaveUrl = `${urlPath}${importDeviceKeys}/${this.fileTypeValue}`;
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.fileTypeProperty]: [this.defaultFileType, Validators.required],
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

  fileTypeChanged(value: Codelist<string>) {
    this.fileTypeValue = value.value;
    this.setFileTypeId();
    this.fileUpload.resetUploadFlags();
  }

  checkImportResults() {
    const ids = this.meterUnitsTypeGridService.getAllCryptoImportIds();
    const results: CryptoImportCheckResponse[] = [];
    if (ids && ids.length > 0) {
      ids.forEach((x) => {
        this.cryptoLiteService.checkCryptoImport(x).subscribe((o) => {
          results.push(o);
          if (o.status === 'SUCCESS') {
            this.allResultTexts.push(
              this.translate.instant('TOOLS.IMPORT-DEVICE-KEYS.IMPORT-SUCCESSFUL', {
                value1: o.fileName,
                value2: o.meterCount,
                value3: o.keyCount
              })
            );
            this.meterUnitsTypeGridService.removeCryptoImportId(o.uuid);
          }
          if (o.errorMsg) {
            this.allErrorTexts.push(
              this.allErrorTexts.push(
                this.translate.instant('TOOLS.IMPORT-DEVICE-KEYS.IMPORT-FAILED', {
                  value1: o.fileName,
                  value2: o.errorMsg
                })
              )
            );
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

  closeAlert(type: string, index: number) {
    let id = type + index;
    setInterval(function () {
      $('.' + id)
        .fadeTo(500, 0)
        .slideUp(500, function () {
          $(this).remove();
        });
    }, 5000);
    return id;
  }
}
