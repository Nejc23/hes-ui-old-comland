import { Injectable } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { RequestFilterParams, RequestTOUData } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { SchedulerJobComponent } from 'src/app/features/jobs/components/scheduler-job/scheduler-job.component';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { PlcMeterBreakerModeComponent } from '../../common/components/plc-meter-breaker-state/plc-meter-breaker-mode.component';
import { PlcMeterFwUpgradeComponent } from '../../common/components/plc-meter-fw-upgrade/plc-meter-fw-upgrade.component';
import { PlcMeterLimiterComponent } from '../../common/components/plc-meter-limiter/plc-meter-limiter.component';
import { PlcMeterMonitorComponent } from '../../common/components/plc-meter-monitor/plc-meter-monitor.component';
import { PlcMeterTouConfigComponent } from '../../common/components/plc-meter-tou-config/plc-meter-tou-config.component';
import { MeterUnitsTypeEnum } from '../enums/meter-units-type.enum';
import { MeterUnitsTypeGridService } from './meter-units-type-grid.service';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsPlcActionsService {
  messageActionInProgress = $localize`Action in progress!`;
  messageServerError = $localize`Server error!`;

  constructor(
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private service: MyGridLinkService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService
  ) {}

  onScheduleReadJobs(params: RequestFilterParams) {
    const options: NgbModalOptions = {
      size: 'xl'
    };
    const modalRef = this.modalService.open(SchedulerJobComponent, options);
    const component: SchedulerJobComponent = modalRef.componentInstance;
    component.deviceFiltersAndSearch = {
      id: params.deviceIds,
      search: params.search,
      filter: params.filter,
      excludeIds: params.excludeIds
    };
    modalRef.result.then().catch(() => {});
  }

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
  // TODO: ONLY FOR TESTING !!!
  // deviceIdsParam = [];
  // deviceIdsParam.push('221A39C5-6C84-4F6E-889C-96326862D771');
  // deviceIdsParam.push('23a8c3e2-b493-475f-a234-aa7491eed2de');
  bulkOperation(operation: MeterUnitsTypeEnum, params: any, selectedCount: number) {
    let selectedText = `${selectedCount} rows `;
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.btnConfirmText = $localize`Confirm`;
    let response: Observable<any> = new Observable();

    let operationName = '';
    switch (operation) {
      case MeterUnitsTypeEnum.breakerStatus:
        response = this.service.getDisconnectorState(params);
        operationName = $localize`Get disconnector status`;
        selectedText = `${$localize`for`} ${selectedText}`;
        break;
      case MeterUnitsTypeEnum.connect:
        response = this.service.postMyGridConnectDevice(params);
        operationName = $localize`Connect`;
        break;
      case MeterUnitsTypeEnum.disconnect:
        response = this.service.postMyGridDisconnectDevice(params);
        operationName = $localize`Disconnect`;
        break;
      case MeterUnitsTypeEnum.ciiState:
        response = this.service.getCiiState(params);
        operationName = $localize`Get CII state`;
        selectedText = `${$localize`for`} ${selectedText}`;
        break;
      case MeterUnitsTypeEnum.ciiActivate:
        response = this.service.postMyGridCiiActivateDevice(params);
        operationName = $localize`CII Activate`;
        break;
      case MeterUnitsTypeEnum.ciiDeactivate:
        response = this.service.postMyGridCiiDeactivateDevice(params);
        operationName = $localize`CII Deactivate`;
        break;
      case MeterUnitsTypeEnum.touConfig:
        const paramsConf: RequestTOUData = {
          deviceIds: params.deviceIds,
          filter: params.filter,
          search: params.search,
          excludeIds: params.excludeIds,
          timeOfUseId: '1'
        }; // TODO: timeOfUseId read form store?

        response = this.service.postMyGridTOUDevice(paramsConf);
        operationName = $localize`Configure TOU`;
        selectedText = `${$localize`for`} ${selectedText}`;
        break;
      case MeterUnitsTypeEnum.activateUpgrade:
        response = this.service.activateDeviceUpgrade(params);
        operationName = $localize`Activate FW upgrade`;
        selectedText = `${$localize`for`} ${selectedText}`;
        break;
      case MeterUnitsTypeEnum.clearFF:
        response = this.service.clearFF(params);
        operationName = $localize`Activate Clear FF`;
        selectedText = `${$localize`for`} ${selectedText}`;
    }
    component.btnConfirmText = operationName;
    component.modalTitle = $localize`Confirm bulk operation`;
    component.modalBody = `${operationName} ${selectedText} ` + $localize`selected meter unit(s)?`;

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        this.toast.successToast(this.messageActionInProgress);
        response.subscribe(
          value => {
            this.meterUnitsTypeGridService.saveMyGridLinkRequestId(value.requestId);
            if (operation === MeterUnitsTypeEnum.breakerStatus) {
              this.meterUnitsTypeGridService.saveMyGridLink_BreakerState_RequestId(value.requestId);
            } else if (operation === MeterUnitsTypeEnum.ciiState) {
              this.meterUnitsTypeGridService.saveMyGridLink_CiiState_RequestId(value.requestId);
            }
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
      deviceIds: [],
      filter: null,
      search: null,
      excludeIds: null
    };

    // select from row
    if (guid && guid.length > 0) {
      requestParam.deviceIds.push(guid);
    } else {
      if (this.meterUnitsTypeGridService.getSessionSettingsSelectedAll()) {
        const excludedRows = this.meterUnitsTypeGridService.getSessionSettingsExcludedRows();

        requestParam.filter = requestModel.filterModel;
        requestParam.search = requestModel.searchModel;
        requestParam.excludeIds = [];

        excludedRows.map(row => requestParam.excludeIds.push(row.deviceId));
      } else {
        const selectedRows = this.meterUnitsTypeGridService.getSessionSettingsSelectedRows();

        if (selectedRows && selectedRows.length > 0) {
          selectedRows.map(row => requestParam.deviceIds.push(row.deviceId));
        }
      }
    }
    return requestParam;
  }
}
