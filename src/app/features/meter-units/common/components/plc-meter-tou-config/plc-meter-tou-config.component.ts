import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { IActionRequestParams, IActionRequestTOUData } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { TouConfigSelectComponent } from 'src/app/features/tou-config-select/component/tou-config-select.component';
import { MeterUnitsTypeGridService } from '../../../types/services/meter-units-type-grid.service';

@Component({
  selector: 'app-plc-meter-tou-config',
  templateUrl: './plc-meter-tou-config.component.html'
})
export class PlcMeterTouConfigComponent {
  @ViewChild(TouConfigSelectComponent, { static: true }) touConfigSelect;

  form: FormGroup;
  noConfig = false;
  configRequiredText = this.translate.instant('COMMON.REQUIRED-FIELD');
  messageServerError = this.translate.instant('COMMON.SERVER-ERROR');
  actionRequest: IActionRequestParams;
  loading = false;

  public selectedRowsCount: number;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbActiveModal,
    private gridLinkService: MyGridLinkService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private toast: ToastNotificationService,
    private translate: TranslateService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.touConfigProperty]: [null, Validators.required]
    });
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
      const paramsConf: IActionRequestTOUData = {
        timeOfUseId: selectedTouConfig,
        pageSize: this.actionRequest.pageSize,
        pageNumber: this.actionRequest.pageNumber,
        sort: this.actionRequest.sort,
        textSearch: this.actionRequest.textSearch,
        filter: this.actionRequest.filter,
        deviceIds: this.actionRequest.deviceIds,
        excludeIds: this.actionRequest.excludeIds
      };
      response = this.gridLinkService.postMyGridTOUDevice(paramsConf);
      this.loading = true;
      response.subscribe(
        (value) => {
          this.meterUnitsTypeGridService.saveMyGridLinkRequestId(value.requestId);
          this.cancel(value.requestId);
          this.loading = false;
        },
        (e) => {
          this.loading = false;
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

  // properties - START
  get touConfigProperty() {
    return 'touConfig';
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }
}
