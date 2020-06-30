import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { TouConfigSelectComponent } from 'src/app/features/tou-config-select/component/tou-config-select.component';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { RequestTOUData } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { MeterUnitsTypeGridService } from '../../types/services/meter-units-type-grid.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { SelectEvent } from '@progress/kendo-angular-upload';

@Component({
  selector: 'app-plc-meter-templates-import',
  templateUrl: './plc-meter-templates-import.component.html'
})
export class PlcMeterTemplatesImportComponent implements OnInit {
  form: FormGroup;
  noConfig = false;
  configRequiredText = this.i18n('Required field');
  messageServerError = this.i18n(`Server error!`);
  successMessage = this.i18n(`Import successful!`);
  deviceIdsParam = [];
  public files: Array<any>;
  allowedExt = ['json'];
  jsonString = '{}';

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    public i18n: I18n,
    private modal: NgbActiveModal,
    private gridLinkService: MyGridLinkService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private authService: AuthService,
    private toast: ToastNotificationService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.fileProperty]: [this.files, Validators.required]
    });
  }

  ngOnInit() {}

  public selected(e: SelectEvent): void {
    const that = this;
    e.files.forEach(file => {
      console.log(`File selected: ${file.name}`);

      if (!file.validationErrors) {
        const reader = new FileReader();

        // tslint:disable-next-line: only-arrow-functions
        reader.onload = function(ev) {
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

  resetAll() {
    this.form.reset();
  }

  save() {
    let response: Observable<any> = new Observable();
    response = this.gridLinkService.postMyGridTemplatesImport(this.jsonString);
    response.subscribe(
      value => {
        // TODO: return is ?
        console.log(`postMyGridTemplatesImport, value = `, value);
        this.toast.successToast(this.successMessage);
        this.cancel('save');
      },
      e => {
        this.toast.errorToast(this.messageServerError);
      }
    );
  }

  cancel(reason: string = 'cancel') {
    this.modal.close(reason);
  }

  get fileProperty() {
    return 'files';
  }

  onDismiss() {
    this.modal.dismiss();
  }
}
