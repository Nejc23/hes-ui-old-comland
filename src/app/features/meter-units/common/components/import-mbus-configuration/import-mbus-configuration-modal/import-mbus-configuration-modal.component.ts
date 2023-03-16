import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyGridLinkService } from '../../../../../../core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from '../../../../../../core/toast-notification/services/toast-notification.service';
import { BreadcrumbService } from '../../../../../../shared/breadcrumbs/services/breadcrumb.service';
import { TranslateService } from '@ngx-translate/core';
import { RemoveEvent, SelectEvent } from '@progress/kendo-angular-upload';
import { Observable } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export interface File {
  name: string;
  base64: string;
}
@Component({
  selector: 'app-import-mbus-configuration-modal',
  templateUrl: './import-mbus-configuration-modal.component.html',
  styleUrls: ['./import-mbus-configuration-modal.component.scss']
})
export class ImportMbusConfigurationModalComponent {
  form: FormGroup;
  noConfig = false;
  configRequiredText = this.translate.instant('COMMON.REQUIRED');
  messageServerError = this.translate.instant('COMMON.CHECK-CONFIGURATION');
  successMessage = this.translate.instant('COMMON.IMPORT-SUCCESSFUL');
  uploadDropSubtitle = this.translate.instant('COMMON.IMPORT-SUBTITLE');

  errors = [];
  clearData = false;
  deviceIdsParam = [];
  public files: Array<any>;
  allowedExt = ['json'];
  acceptExtensions = ['.json'];
  uploadedFiles: Array<File> = [];
  fileValid = false;
  loading = false;
  constructor(
    private formBuilder: FormBuilder,
    private gridLinkService: MyGridLinkService,
    private toast: ToastNotificationService,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService,
    private modal: NgbActiveModal
  ) {
    this.resetForm();
  }

  resetForm() {
    this.files = [];
    this.form = this.createForm();
    this.uploadedFiles = [];
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.fileProperty]: [this.files, Validators.required]
    });
  }

  public selected(e: SelectEvent): void {
    this.clearData = false;
    const that = this;
    console.log(e.files);
    this.uploadedFiles = [];
    this.errors = [];
    e.files.forEach((file, index) => {
      if (!file.validationErrors) {
        const reader = new FileReader();

        reader.onload = function (ev) {
          reader.readAsBinaryString(e.files[index].rawFile);
          reader.onload = function (event) {
            that.uploadedFiles.push({
              name: e.files[index].name,
              base64: btoa(event.target.result.toString())
            });
          };
        };
        reader.readAsDataURL(file.rawFile);
      }
    });
  }

  public removed(e: RemoveEvent): void {
    this.errors = [];
    this.uploadedFiles = [];
  }

  clear() {
    this.uploadedFiles = [];
    this.errors = [];
    this.clearData = true;
    this.resetForm();
  }

  save() {
    let response: Observable<any> = new Observable();
    const body = {
      fileContents: this.uploadedFiles.map((file) => file.base64)
    };
    response = this.gridLinkService.postImportModuleConfigurationChannelSpecific(body);
    this.loading = true;
    response.subscribe(
      (value) => {
        this.loading = false;
        this.toast.successToast(this.successMessage);
        this.modal.close(true);
        this.resetForm();
      },
      (e) => {
        this.loading = false;
        if (e.status === 400 && e.error) {
          this.toast.infoToast(this.messageServerError);
          this.errors = e.error;
        }
      }
    );
  }

  get fileProperty() {
    return 'files';
  }

  isFileValid(event: boolean) {
    this.fileValid = event;
  }

  onDismiss() {
    this.modal.dismiss();
  }

  itemsChangedNames($event) {
    this.uploadedFiles = this.uploadedFiles.filter((item) => $event.indexOf(item.name) !== -1);
  }
}
