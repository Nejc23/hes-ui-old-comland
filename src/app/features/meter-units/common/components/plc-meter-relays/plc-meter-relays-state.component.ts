import { ToastNotificationService } from './../../../../../core/toast-notification/services/toast-notification.service';
import { IActionRequestParams, IActionRequestRelays } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { GridFilterParams, GridSearchParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { PlcMeterSetLimiterService } from '../../services/plc-meter-set-limiter.service';
import { StatusJobComponent } from '../../../../jobs/components/status-job/status-job.component';
import { ModalService } from '../../../../../core/modals/services/modal.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-plc-meter-relays-state',
  templateUrl: './plc-meter-relays-state.component.html'
})
export class PlcMeterRelaysStateComponent implements OnInit {
  form: FormGroup;
  actionRequest: IActionRequestParams;

  filterParam?: GridFilterParams;
  searchParam?: GridSearchParams[];
  actionName = '';

  public selectedRowsCount: number;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private myGridService: MyGridLinkService,
    private setLimiterService: PlcMeterSetLimiterService,
    private toastService: ToastNotificationService,
    private modalService: ModalService,
    private translate: TranslateService
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
    const successMessage = this.translate.instant('COMMON.ACTION-IN-PROGRESS');
    const errorMessage = this.translate.instant('COMMON.ACTION-FAILED') + '!';

    request.subscribe(
      (result) => {
        this.toastService.successToast(successMessage);
        this.modal.close();

        const options: NgbModalOptions = {
          size: 'md'
        };
        const modalRef = this.modalService.open(StatusJobComponent, options);
        modalRef.componentInstance.requestId = result.requestId;
        modalRef.componentInstance.jobName = this.actionName;
        modalRef.componentInstance.deviceCount = result.deviceIds.length;
      },
      (error) => {
        this.toastService.errorToast(errorMessage);
      }
    );
  }
}
