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

@Component({
  selector: 'app-plc-meter-tou-config-import',
  templateUrl: './plc-meter-tou-config-import.component.html'
})
export class PlcMeterTouConfigImportComponent implements OnInit {
  @ViewChild(TouConfigSelectComponent, { static: true }) touConfigSelect;

  form: FormGroup;
  noConfig = false;
  configRequiredText = this.i18n('Required field');
  messageServerError = this.i18n(`Server error!`);
  deviceIdsParam = [];
  public files: Array<any>;
  allowedExt = ['xml'];

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
      [this.touConfigProperty]: [null, Validators.required],
      [this.imageProperty]: [this.files, Validators.required]
    });
  }

  ngOnInit() {}

  selected(event: any) {
    console.log(event);
  }

  fillData(): number {
    return parseInt(this.form.get(this.touConfigProperty).value, 10);
  }

  resetAll() {
    this.form.reset();
    this.touConfigSelect.deselectAllRows();
  }

  save() {
    //  if (this.authService.isTokenAvailable()) {
    const selectedTouConfig = this.touConfigSelect.getSelectedRowId();
    this.noConfig = selectedTouConfig === null;
    if (!this.noConfig) {
      this.form.get(this.touConfigProperty).setValue(selectedTouConfig);
      let response: Observable<any> = new Observable();
      const paramsConf: RequestTOUData = { deviceIds: this.deviceIdsParam, timeOfUseId: selectedTouConfig };
      console.log(`paramsConf = ${JSON.stringify(paramsConf)}`);
      response = this.gridLinkService.postMyGridTOUDevice(paramsConf);
      response.subscribe(
        value => {
          this.meterUnitsTypeGridService.saveMyGridLinkRequestId(value.requestId);
          this.cancel('save');
        },
        e => {
          this.toast.errorToast(this.messageServerError);
        }
      );
    }
    /*  } else {
      this.gridLinkService.getMyGridIdentityToken().subscribe(
        value => {
          this.authService.setAuthTokenMyGridLink(value);
          this.save();
        },
        e => {
          this.toast.errorToast(this.messageServerError);
        }
      );
    }*/
  }

  cancel(reason: string = 'cancel') {
    this.modal.close(reason);
  }

  touConfigSelectionChanged(value: number) {
    this.noConfig = value === null;
  }

  get imageProperty() {
    return 'files';
  }

  // properties - START
  get touConfigProperty() {
    return 'touConfig';
  }
  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }
}
