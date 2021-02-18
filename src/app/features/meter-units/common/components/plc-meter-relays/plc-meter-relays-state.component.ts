import { ToastNotificationService } from './../../../../../core/toast-notification/services/toast-notification.service';
import { ToastComponent } from './../../../../../shared/toast-notification/components/toast.component';
import { IActionRequestParams, IActionRequestRelays } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import {
  RequestSetLimiter,
  LimiterDefinitions,
  ResponseCommonRegisterGroup
} from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { GridFilterParams, GridSearchParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { PlcMeterSetLimiterService } from '../../services/plc-meter-set-limiter.service';

@Component({
  selector: 'app-plc-meter-relays-state',
  templateUrl: './plc-meter-relays-state.component.html'
})
export class PlcMeterRelaysStateComponent implements OnInit {
  form: FormGroup;
  actionRequest: IActionRequestParams;

  filterParam?: GridFilterParams;
  searchParam?: GridSearchParams[];

  public selectedRowsCount: number;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private setLimiterService: PlcMeterSetLimiterService,
    private toastService: ToastNotificationService
  ) {}

  ngOnInit() {}

  fillData(): IActionRequestRelays {
    const formData: IActionRequestRelays = {
      relayIds: null,
      pageSize: this.actionRequest.pageSize,
      pageNumber: this.actionRequest.pageNumber,
      sort: this.actionRequest.sort,
      textSearch: this.actionRequest.textSearch,
      filter: this.actionRequest.filter,
      deviceIds: this.actionRequest.deviceIds,
      excludeIds: this.actionRequest.excludeIds
    };

    return formData;
  }

  onDismiss() {
    this.modal.dismiss();
  }

  onSet() {
    const values = this.fillData();
    const request = this.myGridService.getRelaysState(values);
    const successMessage = $localize`Action in progress!`;
    const errorMessage = $localize`Action failed!`;

    request.subscribe(
      (result) => {
        this.toastService.successToast(successMessage);
        this.modal.close();
      },
      (error) => {
        this.toastService.errorToast(errorMessage);
      }
    );
  }
}
