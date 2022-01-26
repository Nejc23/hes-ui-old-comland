import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../../environments/environment';
import { AppConfigService } from '../../../../../core/configuration/services/app-config.service';
import { uploadDevices } from '../../../../../core/repository/consts/meter-units.const';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { ErrorMessageModalComponent } from './error-messages-modal/error-message-modal.component';
import { ModalService } from '../../../../../core/modals/services/modal.service';

export interface ActiveImport {
  fileName: string;
  nrOfDevices: number;
}

@Component({
  selector: 'app-import-devices',
  templateUrl: './import-devices.component.html'
})
export class ImportDevicesComponent implements OnInit {
  form: FormGroup;
  noConfig = false;
  configRequiredText = this.translate.instant('COMMON.REQUIRED');
  messageServerError = this.translate.instant('COMMON.SERVER-ERROR');
  successMessage = this.translate.instant('COMMON.IMPORT-SUCCESSFUL');

  deviceIdsParam = [];
  public files: Array<any>;
  allowedExt = ['.xlsx'];
  acceptExtensions = ['.xlsx'];
  fileValid = false;
  uploadDropSubtitle = this.translate.instant('DCU.FILE-BIN-FORMAT', { supportedType: this.acceptExtensions });

  apiUrl = environment.apiUrl;
  uploadSaveUrl = this.apiUrl + uploadDevices;
  activeImports: Array<ActiveImport> = [];

  uploadStatus = 'failure' || 'success';
  messages: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private gridLinkService: MyGridLinkService,
    private toast: ToastNotificationService,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService,
    private authService: AuthService,
    private elRef: ElementRef,
    private modalService: ModalService
  ) {
    this.resetForm();
  }

  get fileProperty() {
    return 'files';
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.fileProperty]: [this.files, Validators.required]
    });
  }

  ngOnInit() {
    if (AppConfigService.settings?.apiServer?.url !== '') {
      this.uploadSaveUrl = AppConfigService.settings?.apiServer?.url + uploadDevices;
    }
    this.breadcrumbService.setPageName(this.translate.instant('MENU.IMPORT-DEVICES'));
    this.gridLinkService.getActiveImports().subscribe((res) => {
      this.activeImports = res;
    });
  }

  resetForm() {
    this.files = [];
    this.form = this.createForm();
  }

  downloadTemplate() {
    window.location.assign('assets/files/meter-import.xlsx');
  }

  isFileValid(event: boolean) {
    this.fileValid = event;
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }

  successUploaded(event) {
    this.uploadStatus = JSON.parse(event.response.body).status;
    if (this.uploadStatus === 'success') {
      this.toast.successToast(this.translate.instant('COMMON.UPLOAD-SUCCESSFUL'));
    } else {
      this.messages = JSON.parse(event.response.body).messages;

      const modalRef = this.modalService.open(ErrorMessageModalComponent, { size: 'md' });
      modalRef.componentInstance.messages = this.messages;
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
}
