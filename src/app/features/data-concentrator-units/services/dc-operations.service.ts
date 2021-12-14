import { Injectable } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { capitalize, toLower } from 'lodash';
import { Observable } from 'rxjs';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { RequestFilterParams } from 'src/app/core/repository/interfaces/data-concentrator-units/dc-operation-simple.interface';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { DataConcentratorUnitsOperationsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units-operations.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { SchedulerJobComponent } from 'src/app/features/jobs/components/scheduler-job/scheduler-job.component';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { gridSysNameColumnsEnum } from '../../global/enums/dcu-global.enum';
import { filterOperationEnum, filterSortOrderEnum } from '../../global/enums/filter-operation-global.enum';
import { DcuFwUpgradeComponent } from '../common/components/dcu-fw-upgrade.component';
import { DcOperationTypeEnum } from '../enums/operation-type.enum';
import { TemplatingService } from '../../../core/repository/services/templating/templating.service';
import { DataConcentratorUnitsGridService } from './data-concentrator-units-grid.service';
import { EventManagerService } from '../../../core/services/event-manager.service';

@Injectable({
  providedIn: 'root'
})
export class DcOperationsService {
  constructor(
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private service: DataConcentratorUnitsOperationsService,
    private dcGridService: DataConcentratorUnitsGridService,
    private templatingService: TemplatingService,
    private translate: TranslateService,
    private eventManager: EventManagerService
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

  // actions without popup
  bulkOperation(
    operation: DcOperationTypeEnum,
    params: any,
    selectedCount: number,
    alertText?: string,
    secondConfirmEnabled?: boolean,
    dangerMessage?: string
  ) {
    // let selectedText = ''; // `${selectedCount} rows `;
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.btnConfirmText = this.translate.instant('BUTTON.CONFIRM');
    let response: Observable<any> = new Observable();

    let operationName = '';
    switch (operation) {
      case DcOperationTypeEnum.syncTime:
        response = this.service.postDcSynchronizeTime(params);
        operationName = this.translate.instant('OPERATION.SYNC-TIME');
        // selectedText = `${`for`} ${selectedText}`;
        break;
      case DcOperationTypeEnum.deviceDiscovery:
        response = this.service.postDcDeviceDiscovery(params);
        operationName = this.translate.instant('OPERATION.DEVICE-DISCOVERY');
        // selectedText = `${`for`} ${selectedText}`;
        break;
      case DcOperationTypeEnum.reKeyHmac:
        response = this.service.postRekeyHmac(params);
        operationName = this.translate.instant('OPERATION.RE-KEY-HMAC');
        // selectedText = `${`for`} ${selectedText}`;
        break;
      case DcOperationTypeEnum.enable:
        params.enabled = true;
        response = this.service.postEnableDC(params);
        operationName = this.translate.instant('OPERATION.ENABLE-DC');
        // selectedText = `${`for`} ${selectedText}`;
        break;
      case DcOperationTypeEnum.disable:
        params.enabled = false;
        response = this.service.postEnableDC(params);
        operationName = this.translate.instant('OPERATION.DISABLE-DC');
        // selectedText = `${`for`} ${selectedText}`;
        break;
    }
    component.modalTitle = this.translate.instant('DCU.OPERATION-MODAL', { operationName: operationName, selectedCount: selectedCount });
    component.modalBody = this.translate.instant('DCU.CONFIRM-OPERATION', { operationName: toLower(operationName) }); // `${operationName} ${selectedText} ` +  `selected meter unit(s)? -> do we need it?`
    component.alertText = alertText;
    component.dangerText = dangerMessage;

    component.secondConfirmEnabled = secondConfirmEnabled;
    component.confirmMessage = this.translate.instant('DCU.CONFIRM-OPERATION', { operationName: toLower(operationName) });

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        this.toast.successToast(this.translate.instant('COMMON.ACTION-IN-PROGRESS'));
        response.subscribe(
          (value) => {
            if (operation === DcOperationTypeEnum.enable || DcOperationTypeEnum.disable) {
              this.eventManager.emitCustom('RefreshConcentratorEvent', true);
            }
            /*this.meterUnitsTypeGridService.saveMyGridLinkRequestId(value.requestId);
            if (operation === MeterUnitsTypeEnum.breakerStatus) {
              this.meterUnitsTypeGridService.saveMyGridLink_BreakerState_RequestId(value.requestId);
            } else if (operation === MeterUnitsTypeEnum.ciiState) {
              this.meterUnitsTypeGridService.saveMyGridLink_CiiState_RequestId(value.requestId);
            }*/
          },
          (e) => {
            this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
          }
        );
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  fwUpgrade(params: any, selectedRowsCount: number, alertText?: string) {
    const modalRef = this.modalService.open(DcuFwUpgradeComponent);
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;
    modalRef.componentInstance.alertText = alertText;

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        if (data === 'save') {
          this.toast.successToast(this.translate.instant('COMMON.ACTION-IN-PROGRESS'));
        }
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  getOperationRequestParam(
    guid: string,
    requestModel: GridRequestParams,
    allItems: number,
    allVisibleColumns: string[]
  ): IActionRequestParams {
    const requestParam: IActionRequestParams = {
      pageSize: 0,
      pageNumber: 0,
      textSearch: {
        value: '',
        propNames: [],
        useWildcards: false
      },
      sort: []
    };

    // select from row
    if (guid && guid.length > 0) {
      requestParam.concentratorIds = [];
      requestParam.concentratorIds.push(guid);
    } else {
      if (this.dcGridService.getSessionSettingsSelectedAll()) {
        const excludedRows = this.dcGridService.getSessionSettingsExcludedRows();

        requestParam.pageSize = allItems;
        requestParam.pageNumber = 1;

        if (requestModel.searchModel && requestModel.searchModel.length > 0 && requestModel.searchModel[0].value.length > 0) {
          requestParam.textSearch.value = requestModel.searchModel[0].value;
          requestParam.textSearch.propNames = allVisibleColumns;
          requestParam.textSearch.useWildcards = requestModel.searchModel[0].useWildcards;
        }

        // create filter object
        if (requestModel.filterModel) {
          requestParam.filter = [];
          if (requestModel.filterModel.states && requestModel.filterModel.states.length > 0) {
            requestModel.filterModel.states.map((row) =>
              requestParam.filter.push({
                propName: capitalize(gridSysNameColumnsEnum.state),
                propValue: row.id.toString(),
                filterOperation: filterOperationEnum.equal
              })
            );
          }
          if (requestModel.filterModel.types && requestModel.filterModel.types.length > 0) {
            requestModel.filterModel.types.map((row) =>
              requestParam.filter.push({
                propName: capitalize(gridSysNameColumnsEnum.type),
                propValue: row.toString(),
                filterOperation: filterOperationEnum.equal
              })
            );
          }
          if (requestModel.filterModel.tags && requestModel.filterModel.tags.length > 0) {
            requestModel.filterModel.tags.map((row) =>
              requestParam.filter.push({
                propName: capitalize(gridSysNameColumnsEnum.tags),
                propValue: row.id.toString(),
                filterOperation: filterOperationEnum.contains
              })
            );
          }
          if (requestModel.filterModel.vendors && requestModel.filterModel.vendors.length > 0) {
            requestModel.filterModel.vendors.map((row) =>
              requestParam.filter.push({
                propName: capitalize(gridSysNameColumnsEnum.vendor),
                propValue: row.id.toString(),
                filterOperation: filterOperationEnum.equal
              })
            );
          }

          if (requestModel.sortModel && requestModel.sortModel.length > 0) {
            requestModel.sortModel.map((row) =>
              requestParam.sort.push({
                propName: capitalize(row.colId),
                index: 0,
                sortOrder: row.sort === 'asc' ? filterSortOrderEnum.asc : filterSortOrderEnum.desc
              })
            );
          }
        }
        requestParam.excludeIds = [];
        excludedRows.map((row) => requestParam.excludeIds.push(row.concentratorId));
      } else {
        const selectedRows = this.dcGridService.getSessionSettingsSelectedRows();
        if (selectedRows && selectedRows.length > 0) {
          requestParam.concentratorIds = [];
          requestParam.types = [...new Set(selectedRows.map((row) => row.type))];
          requestParam.states = [...new Set(selectedRows.map((row) => row.state))];
          selectedRows.map((row) => requestParam.concentratorIds.push(row.concentratorId));
        }
      }
    }

    return requestParam;
  }
}
