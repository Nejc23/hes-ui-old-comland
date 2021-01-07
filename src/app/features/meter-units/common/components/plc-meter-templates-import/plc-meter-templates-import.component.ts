import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { RemoveEvent, SelectEvent } from '@progress/kendo-angular-upload';

@Component({
  selector: 'app-plc-meter-templates-import',
  templateUrl: './plc-meter-templates-import.component.html'
})
export class PlcMeterTemplatesImportComponent implements OnInit {
  form: FormGroup;
  noConfig = false;
  configRequiredText = $localize`Required field`;
  messageServerError = $localize`Server error!`;
  successMessage = $localize`Import successful!`;
  deviceIdsParam = [];
  public files: Array<any>;
  allowedExt = ['json'];
  acceptExtensions = '.json';
  jsonString = '';

  constructor(
    private formBuilder: FormBuilder,
    private gridLinkService: MyGridLinkService,
    private toast: ToastNotificationService,
    private breadcrumbService: BreadcrumbService
  ) {
    this.resetForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.fileProperty]: [this.files, Validators.required]
    });
  }

  ngOnInit() {
    this.breadcrumbService.setPageName($localize`Import templates`);
  }

  public selected(e: SelectEvent): void {
    const that = this;
    e.files.forEach((file) => {
      if (!file.validationErrors) {
        const reader = new FileReader();

        // tslint:disable-next-line: only-arrow-functions
        reader.onload = function (ev) {
          const jsonFile = {
            // tslint:disable-next-line: no-string-literal
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

  resetAll() {
    this.form.reset();
  }

  save() {
    let response: Observable<any> = new Observable();
    response = this.gridLinkService.postMyGridTemplatesImport(this.jsonString);
    response.subscribe(
      (value) => {
        // TODO: return is ?
        // console.log(`postMyGridTemplatesImport, value = `, value);
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
}
