import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { RemoveEvent, SelectEvent } from '@progress/kendo-angular-upload';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-plc-meter-templates-import',
  templateUrl: './plc-meter-templates-import.component.html'
})
export class PlcMeterTemplatesImportComponent implements OnInit {
  form: FormGroup;
  noConfig = false;
  configRequiredText = this.translate.instant('COMMON.REQUIRED');
  messageServerError = this.translate.instant('COMMON.SERVER-ERROR');
  successMessage = this.translate.instant('COMMON.IMPORT-SUCCESSFUL');
  uploadDropSubtitle = this.translate.instant('COMMON.IMPORT-SUBTITLE');

  deviceIdsParam = [];
  public files: Array<any>;
  allowedExt = ['json'];
  acceptExtensions = ['.json'];
  jsonString = '';
  fileValid = false;

  constructor(
    private formBuilder: FormBuilder,
    private gridLinkService: MyGridLinkService,
    private toast: ToastNotificationService,
    private breadcrumbService: BreadcrumbService,
    private translate: TranslateService
  ) {
    this.resetForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.fileProperty]: [this.files, Validators.required]
    });
  }

  ngOnInit() {
    this.breadcrumbService.setPageName(this.translate.instant('MENU.IMPORT-TEMPLATES'));
  }

  public selected(e: SelectEvent): void {
    const that = this;
    e.files.forEach((file) => {
      if (!file.validationErrors) {
        const reader = new FileReader();

        // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
        reader.onload = function (ev) {
          const jsonFile = {
            // eslint-disable-next-line @typescript-eslint/dot-notation
            src: ev.target['result'],
            uid: file.uid
          };
          that.jsonString = atob(jsonFile.src.toString().replace('data:application/json;base64,', ''));
        };

        reader.readAsDataURL(file.rawFile);
      }
    });
  }

  public removed(e: RemoveEvent): void {
    this.jsonString = '';
  }

  save() {
    let response: Observable<any> = new Observable();
    response = this.gridLinkService.postMyGridTemplatesImport(this.jsonString);
    response.subscribe(
      (value) => {
        this.toast.successToast(this.successMessage);
        this.resetForm();
      },
      (e) => {
        this.toast.errorToast(this.messageServerError);
      }
    );
  }

  resetForm() {
    this.files = [];
    this.form = this.createForm();
    this.jsonString = '';
  }

  get fileProperty() {
    return 'files';
  }

  isFileValid(event: boolean) {
    this.fileValid = event;
  }
}
