import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { TouConfigSelectComponent } from 'src/app/features/tou-config-select/component/tou-config-select.component';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { MeterUnitsTypeGridService } from '../../../types/services/meter-units-type-grid.service';
import { IActionRequestParams, IActionRequestTOUData } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';

@Component({
  selector: 'app-plc-meter-tou-config',
  templateUrl: './plc-meter-tou-config.component.html'
})
export class PlcMeterTouConfigComponent implements OnInit {
  @ViewChild(TouConfigSelectComponent, { static: true }) touConfigSelect;

  form: FormGroup;
  noConfig = false;
  configRequiredText = $localize`Required field`;
  messageServerError = $localize`Server error!`;
  actionRequest: IActionRequestParams;

  public selectedRowsCount: number;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NgbActiveModal,
    private gridLinkService: MyGridLinkService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private toast: ToastNotificationService
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.touConfigProperty]: [null, Validators.required]
    });
  }

  ngOnInit() {}

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
      console.log(`paramsConf = ${JSON.stringify(paramsConf)}`);
      response = this.gridLinkService.postMyGridTOUDevice(paramsConf);
      response.subscribe(
        (value) => {
          this.meterUnitsTypeGridService.saveMyGridLinkRequestId(value.requestId);
          this.cancel(value.requestId);
        },
        (e) => {
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
