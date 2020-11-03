import { Injectable } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { RequestFilterParams } from 'src/app/core/repository/interfaces/data-concentrator-units/dc-operation-simple.interface';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { DataConcentratorUnitsOperationsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units-operations.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { SchedulerJobComponent } from 'src/app/features/jobs/components/scheduler-job/scheduler-job.component';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { DcOperationTypeEnum } from '../enums/operation-type.enum';
import { DataConcentratorUnitsGridService } from './data-concentrator-units-grid.service';

@Injectable({
  providedIn: 'root'
})
export class DcOperationsService {
  messageActionInProgress = $localize`Action in progress!`;
  messageServerError = $localize`Server error!`;

  constructor(
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private service: DataConcentratorUnitsOperationsService,
    private dcGridService: DataConcentratorUnitsGridService
  ) {}

  onScheduleReadJobs(params: RequestFilterParams) {
    const options: NgbModalOptions = {
      size: 'xl'
    };
    const modalRef = this.modalService.open(SchedulerJobComponent, options);
    const component: SchedulerJobComponent = modalRef.componentInstance;
    component.deviceFiltersAndSearch = {
      id: params.concentratorIds,
      search: params.search,
      filter: params.filter,
      excludeIds: params.excludeIds
    };
    modalRef.result.then().catch(() => {});
  }
  /*
  onTou(params: RequestFilterParams) {
    const modalRef = this.modalService.open(PlcMeterTouConfigComponent);
    modalRef.componentInstance.deviceIdsParam = params.deviceIds;
    modalRef.componentInstance.filterParam = params.filter;
    modalRef.componentInstance.searchParam = params.search;
    modalRef.componentInstance.excludeIdsParam = params.excludeIds;

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        if (data === 'save') {
          this.toast.successToast(this.messageActionInProgress);
        }
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }

  onUpgrade(params: RequestFilterParams) {
    const modalRef = this.modalService.open(PlcMeterFwUpgradeComponent);

    modalRef.componentInstance.deviceIdsParam = params.deviceIds;
    modalRef.componentInstance.filterParam = params.filter;
    modalRef.componentInstance.searchParam = params.search;
    modalRef.componentInstance.excludeIdsParam = params.excludeIds;

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        if (data === 'save') {
          this.toast.successToast(this.messageActionInProgress);
        }
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }

  onSetMonitor(params: RequestFilterParams) {
    const modalRef = this.modalService.open(PlcMeterMonitorComponent);

    modalRef.componentInstance.deviceIdsParam = params.deviceIds;
    modalRef.componentInstance.filterParam = params.filter;
    modalRef.componentInstance.searchParam = params.search;
    modalRef.componentInstance.excludeIdsParam = params.excludeIds;

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        if (data === 'save') {
          this.toast.successToast(this.messageActionInProgress);
        }
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }

  onSetLimiter(params: RequestFilterParams) {
    const modalRef = this.modalService.open(PlcMeterLimiterComponent);
    modalRef.componentInstance.deviceIdsParam = params.deviceIds;
    modalRef.componentInstance.filterParam = params.filter;
    modalRef.componentInstance.searchParam = params.search;
    modalRef.componentInstance.excludeIdsParam = params.excludeIds;

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        if (data === 'save') {
          this.toast.successToast(this.messageActionInProgress);
        }
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }

  onBreakerMode(params: RequestFilterParams) {
    const modalRef = this.modalService.open(PlcMeterBreakerModeComponent);
    modalRef.componentInstance.deviceIdsParam = params.deviceIds;
    modalRef.componentInstance.filterParam = params.filter;
    modalRef.componentInstance.searchParam = params.search;
    modalRef.componentInstance.excludeIdsParam = params.excludeIds;

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        if (data === 'save') {
          this.toast.successToast(this.messageActionInProgress);
        }
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }
*/
  // delete button click ali se rabi ?????????
  onDelete() {
    /*  let selectedText = 'all';
    const object: GridBulkActionRequestParams = {
      id: [],
      filter: {
        statuses: [],
        types: [],
        vendor: { id: 0, value: '' },
        tags: []
      }
    };
    if (!this.meterUnitsTypeGridService.getSessionSettingsSelectedAll()) {
      const selectedRows = this.gridApi.getSelectedRows();
      selectedRows.forEach(element => {
        object.id.push(element.id);
      });
      object.filter = null;
      selectedText = selectedRows ? selectedRows.length : 0;
    } else {
      object.filter = this.requestModel.filterModel;
      object.id = null;
    }

    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.confirmDelete = true;
    component.modalBody = this.i18n(`Delete ${selectedText} selected Data Concentrator Units?`);

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        const request = this.meterUnitsTypeService.deleteDcu(object);
        this.formUtils.deleteForm(request, this.i18n('Selected items deleted')).subscribe(
          (response: any) => {
            this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
            this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(false);
            this.eventService.selectDeselectAll(-1);
            this.gridApi.forEachNode(node => {
              node.setSelected(false);
            });

            this.gridApi.onFilterChanged();
          },
          () => {}
        );
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );*/
  }

  // actions without popup
  bulkOperation(operation: DcOperationTypeEnum, params: any, selectedCount: number) {
    let selectedText = ''; // `${selectedCount} rows `;
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.btnConfirmText = $localize`Confirm`;
    let response: Observable<any> = new Observable();

    let operationName = '';
    switch (operation) {
      case DcOperationTypeEnum.syncTime:
        response = this.service.postDcSynchronizeTime(params);
        operationName = $localize`Sync time`;
        selectedText = `${$localize`for`} ${selectedText}`;
        break;
    }
    component.btnConfirmText = operationName;
    component.modalTitle = $localize`Confirm bulk operation`;
    component.modalBody = `${operationName} ${selectedText} ` + $localize`selected DC(s)?`;

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        this.toast.successToast(this.messageActionInProgress);
        response.subscribe(
          value => {
            /*this.meterUnitsTypeGridService.saveMyGridLinkRequestId(value.requestId);
            if (operation === MeterUnitsTypeEnum.breakerStatus) {
              this.meterUnitsTypeGridService.saveMyGridLink_BreakerState_RequestId(value.requestId);
            } else if (operation === MeterUnitsTypeEnum.ciiState) {
              this.meterUnitsTypeGridService.saveMyGridLink_CiiState_RequestId(value.requestId);
            }*/
          },
          e => {
            this.toast.errorToast(this.messageServerError);
          }
        );
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }

  getRequestFilterParam(guid: string, requestModel: GridRequestParams): RequestFilterParams {
    const requestParam: RequestFilterParams = {
      concentratorIds: [],
      filter: null,
      search: null,
      excludeIds: null
    };

    // select from row
    if (guid && guid.length > 0) {
      requestParam.concentratorIds.push(guid);
    } else {
      if (this.dcGridService.getSessionSettingsSelectedAll()) {
        const excludedRows = this.dcGridService.getSessionSettingsExcludedRows();

        requestParam.filter = requestModel.filterModel;
        requestParam.search = requestModel.searchModel;
        requestParam.excludeIds = [];

        excludedRows.map(row => requestParam.excludeIds.push(row.concentratorId));
      } else {
        const selectedRows = this.dcGridService.getSessionSettingsSelectedRows();

        if (selectedRows && selectedRows.length > 0) {
          selectedRows.map(row => requestParam.concentratorIds.push(row.concentratorId));
        }
      }
    }
    return requestParam;
  }
}