import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { toLower } from 'lodash';
import { Observable } from 'rxjs';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { IActionRequestParams, IRegisterTypesEnum } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { filterOperationEnum, filterSortOrderEnum } from 'src/app/features/global/enums/filter-operation-global.enum';
import { gridSysNameColumnsEnum } from 'src/app/features/global/enums/meter-units-global.enum';
import { SchedulerJobComponent } from 'src/app/features/jobs/components/scheduler-job/scheduler-job.component';
import { JobsSelectGridService } from 'src/app/features/jobs/jobs-select/services/jobs-select-grid.service';
import { capitalize } from 'src/app/shared/forms/functions/string.functions';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { CodelistRepositoryService } from '../../../../core/repository/services/codelists/codelist-repository.service';
import { EventManagerService } from '../../../../core/services/event-manager.service';
import { StatusJobComponent } from '../../../jobs/components/status-job/status-job.component';
import { JobTypeEnumeration } from '../../../jobs/enums/job-type.enum';
import {
  DeleteMeterDataPayload,
  PlcDeleteMeterDataComponent
} from '../../common/components/plc-delete-meter-data/plc-delete-meter-data.component';
import { PlcMeterBreakerModeComponent } from '../../common/components/plc-meter-breaker-state/plc-meter-breaker-mode.component';
import { PlcMeterFwUpgradeComponent } from '../../common/components/plc-meter-fw-upgrade/plc-meter-fw-upgrade.component';
import { PlcMeterJobsAssignExistingComponent } from '../../common/components/plc-meter-jobs-assign-existing/plc-meter-jobs-assign-existing.component';
import { PlcMeterJobsRegistersComponent } from '../../common/components/plc-meter-jobs-registers/plc-meter-jobs-registers.component';
import { PlcMeterLimiterComponent } from '../../common/components/plc-meter-limiter/plc-meter-limiter.component';
import { PlcMeterMonitorComponent } from '../../common/components/plc-meter-monitor/plc-meter-monitor.component';
import { PlcMeterRelaysConnectComponent } from '../../common/components/plc-meter-relays/plc-meter-relays-connect.component';
import { PlcMeterRelaysDisconnectComponent } from '../../common/components/plc-meter-relays/plc-meter-relays-disconnect.component';
import { PlcMeterRelaysSetModeComponent } from '../../common/components/plc-meter-relays/plc-meter-relays-set-mode.component';
import { PlcMeterRelaysStateComponent } from '../../common/components/plc-meter-relays/plc-meter-relays-state.component';
import { PlcMeterSetDisplaySettingsComponent } from '../../common/components/plc-meter-set-display-settings/plc-meter-set-display-settings.component';
import { PlcMeterTouConfigComponent } from '../../common/components/plc-meter-tou-config/plc-meter-tou-config.component';
import { PlcReadRegistersComponent } from '../../common/components/plc-read-meter/plc-read-registers.component';
import { SecurityActivateHlsComponent } from '../../common/components/security/security-activate-hls.component';
import { SecurityChangePasswordComponent } from '../../common/components/security/security-change-password.component';
import { SecurityRekeyComponent } from '../../common/components/security/security-rekey.component';
import { MeterUnitsTypeEnum } from '../enums/meter-units-type.enum';
import { MeterUnitsTypeGridService } from './meter-units-type-grid.service';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsPlcActionsService {
  constructor(
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private service: MyGridLinkService,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private codelistService: CodelistRepositoryService,
    private router: Router,
    private eventService: EventManagerService,
    private jobsSelectGridService: JobsSelectGridService,
    private translate: TranslateService
  ) {}

  onScheduleReadJobs(params: IActionRequestParams, selectedRowsCount: number) {
    const options: NgbModalOptions = {
      size: 'xl'
    };

    this.codelistService.timeUnitCodeslist().subscribe((units) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      modalRef.componentInstance.selectedRowsCount = selectedRowsCount;
      component.setFormAddNew(JobTypeEnumeration.reading, units);
      component.prepareNewJobForDevicesRequest(params);
      modalRef.result.then().catch(() => {});
    });
  }

  onScheduleMeterTimeSyncJobs(params: IActionRequestParams, selectedRowsCount: number) {
    const options: NgbModalOptions = {
      size: 'xl'
    };

    this.codelistService.timeUnitCodeslist().subscribe((units) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      modalRef.componentInstance.selectedRowsCount = selectedRowsCount;
      component.setFormAddNew(JobTypeEnumeration.meterTimeSync, units);
      component.prepareNewJobForDevicesRequest(params);
      modalRef.result.then().catch(() => {});
    });
  }

  onJobsAssignExisting(params: IActionRequestParams, selectedRowsCount: number) {
    this.jobsSelectGridService.clearSessionSettingsSelectedRows();

    const options: NgbModalOptions = {
      size: 'xl'
    };

    const modalRef = this.modalService.open(PlcMeterJobsAssignExistingComponent, options);
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;

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

  onJobsTemplates(params: IActionRequestParams, selectedRowsCount: number) {
    const options: NgbModalOptions = {
      size: 'xl'
    };

    const modalRef = this.modalService.open(PlcMeterJobsRegistersComponent, options);
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;
    modalRef.componentInstance.actionRequest = params;

    modalRef.result.then().catch(() => {});
  }

  onTou(params: IActionRequestParams, selectedRowsCount: number, actionName: string) {
    const modalRef = this.modalService.open(PlcMeterTouConfigComponent);
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;
    /* modalRef.componentInstance.deviceIdsParam = params.deviceIds;
    modalRef.componentInstance.filterParam = params.filter;
    modalRef.componentInstance.searchParam = params.search;
    modalRef.componentInstance.excludeIdsParam = params.excludeIds;*/

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        if (data !== 'cancel') {
          this.toast.successToast(this.translate.instant('COMMON.ACTION-IN-PROGRESS'));
          const options: NgbModalOptions = {
            size: 'md'
          };
          const modalRef = this.modalService.open(StatusJobComponent, options);
          modalRef.componentInstance.requestId = data; // requestId
          modalRef.componentInstance.jobName = actionName;
          modalRef.componentInstance.deviceCount = selectedRowsCount;
        }
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  onUpgrade(params: IActionRequestParams, selectedRowsCount: number, actionName: string) {
    const modalRef = this.modalService.open(PlcMeterFwUpgradeComponent);
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;

    modalRef.result.then(
      (data) => {
        // on close (cancel or requestId as parameter)
        if (data !== 'cancel') {
          this.toast.successToast(this.translate.instant('COMMON.ACTION-IN-PROGRESS'));
          const options: NgbModalOptions = {
            size: 'md'
          };
          const modalRef = this.modalService.open(StatusJobComponent, options);
          modalRef.componentInstance.requestId = data; // requestId
          modalRef.componentInstance.jobName = actionName;
          modalRef.componentInstance.deviceCount = params.deviceIds.length;
        }
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  onSetMonitor(params: IActionRequestParams, selectedRowsCount: number, actionName: string) {
    const modalRef = this.modalService.open(PlcMeterMonitorComponent);

    modalRef.componentInstance.params = params;

    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;

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

  onReadMonitorThreshold(params: IActionRequestParams, selectedRowsCount: number, actionName: string) {
    this.bulkOperation(MeterUnitsTypeEnum.readThresholdsMonitor, params, selectedRowsCount);
  }

  onSetLimiter(params: IActionRequestParams, selectedRowsCount: number, actionName: string) {
    const modalRef = this.modalService.open(PlcMeterLimiterComponent);
    modalRef.componentInstance.params = params;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;
    modalRef.componentInstance.actionName = actionName;
    modalRef.componentInstance.actionRequst = modalRef.result.then(
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

  onReadLimiterThreshold(params: IActionRequestParams, selectedRowsCount: number, actionName: string) {
    this.bulkOperation(MeterUnitsTypeEnum.readThresholdsLimiter, params, selectedRowsCount);
  }

  onRelaysConnect(params: IActionRequestParams, selectedRowsCount: number, actionName) {
    const modalRef = this.modalService.open(PlcMeterRelaysConnectComponent);
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.actionName = actionName;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;

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

  onRelaysDisconnect(params: IActionRequestParams, selectedRowsCount: number, actionName: string) {
    const modalRef = this.modalService.open(PlcMeterRelaysDisconnectComponent);
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;
    modalRef.componentInstance.actionName = actionName;

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

  onRelaysState(params: IActionRequestParams, selectedRowsCount: number, actionName) {
    const modalRef = this.modalService.open(PlcMeterRelaysStateComponent);
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.actionName = actionName;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        if (data === 'save') {
          this.meterUnitsTypeGridService.saveMyGridLink_RelaysState_RequestId(data.requestId);
          this.toast.successToast(this.translate.instant('COMMON.ACTION-IN-PROGRESS'));
        }
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  onRelaysSetMode(params: IActionRequestParams, selectedRowsCount: number, actionName: string) {
    const modalRef = this.modalService.open(PlcMeterRelaysSetModeComponent);
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.actionName = actionName;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;

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

  onDisconnectorMode(params: IActionRequestParams, selectedRowsCount: number, actionName: string) {
    const modalRef = this.modalService.open(PlcMeterBreakerModeComponent);
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;
    modalRef.componentInstance.actionName = actionName;

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

  onDelete(params: IActionRequestParams, selectedRowsCount: number, navigateToGrid = false) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.btnConfirmText = this.translate.instant('COMMON.CONFIRM');
    let response: Observable<any> = new Observable();
    params.includedIds = params.deviceIds;

    response = this.service.deleteDevice(params);
    const operationName = this.translate.instant('COMMON.DELETE-DEVICES');

    // todo REFACTOR {{ VALUE }}
    component.modalTitle = `${operationName} (${selectedRowsCount} ` + this.translate.instant('COMMON.SELECTED') + ')';
    component.modalBody =
      this.translate.instant('MODAL.ARE-YOU-SURE-TEXT') + `${toLower(operationName)}` + this.translate.instant('MODAL.FOR-DEVICES') + '?'; // `${operationName} ${selectedText} ` +  `selected meter unit(s)?`;

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        component.loading = true;
        response.subscribe(
          (value) => {
            component.loading = false;
            this.toast.successToast(this.translate.instant('COMMON.DELETE-SUCCESS'));
            if (navigateToGrid) {
              this.router.navigate(['/meterUnits']);
              this.eventService.emitCustom('RefreshMeterUnitsListEvent', { refresh: true, deselectRows: true });
            } else {
              this.eventService.emitCustom('RefreshMeterUnitsListEvent', { refresh: true, deselectRows: true });
            }
          },
          (e) => {
            component.loading = false;
            this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
          }
        );
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  onDeleteMeterData(params: IActionRequestParams, selectedRowsCount: number, navigateToGrid = false) {
    const options: NgbModalOptions = { size: 'md' };
    const modalRef = this.modalService.open(PlcDeleteMeterDataComponent, options);

    params.includedIds = params.deviceIds;
    modalRef.componentInstance.params = params;

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        const payload = data as DeleteMeterDataPayload;
        params.from = payload.startDate;
        params.to = payload.endDate;

        // Confirmation dialog.
        const confirmOptions: NgbModalOptions = { size: 'lg' };
        const confirmModalRef = this.modalService.open(ModalConfirmComponent, confirmOptions);
        const component: ModalConfirmComponent = confirmModalRef.componentInstance;
        component.btnConfirmText = this.translate.instant('COMMON.CONFIRM');
        component.modalTitle = this.translate.instant('PLC-METER.DELETE.ARE-YOU-SURE-MESSAGE');
        component.modalBody = this.translate.instant('PLC-METER.DELETE.ARE-YOU-SURE-WARNING-MESSAGE');

        confirmModalRef.result.then(
          (confirmData) => {
            this.service.deleteDeviceData(params).subscribe(
              (value) => {
                this.toast.successToast(this.translate.instant('COMMON.DELETE-SUCCESS'));
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
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  onSetDisplaySettings(params: IActionRequestParams, selectedRowsCount: number, actionName: string) {
    const modalRef = this.modalService.open(PlcMeterSetDisplaySettingsComponent);

    modalRef.componentInstance.deviceIdsParam = params.deviceIds;
    modalRef.componentInstance.filterParam = params.filter;
    modalRef.componentInstance.searchParam = params.textSearch;
    modalRef.componentInstance.excludeIdsParam = params.excludeIds;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.actionName = actionName;

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        if (data !== '') {
          this.toast.successToast(this.translate.instant('COMMON.ACTION-IN-PROGRESS'));
        }
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  // actions without popup
  bulkOperation(operation: MeterUnitsTypeEnum, params: any, selectedCount: number, navigateToGrid = false) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.btnConfirmText = this.translate.instant('COMMON.CONFIRM');

    let response: Observable<any> = new Observable();

    let operationName = '';
    switch (operation) {
      case MeterUnitsTypeEnum.breakerStatus:
        response = this.service.getDisconnectorState(params);
        operationName = this.translate.instant('COMMON.GET-DISCONNECTOR-STATUS');
        break;
      case MeterUnitsTypeEnum.connect:
        response = this.service.postMyGridConnectDevice(params);
        operationName = this.translate.instant('COMMON.DISCONNECTOR-CONNECT');
        component.checkboxLabel = this.translate.instant('COMMON.READ-REGISTERS-BEFORE') + ' ' + operationName?.toLowerCase();
        component.checkboxField = 'initiateReading';
        component.checkboxValue = true; // TODO from BE
        break;
      case MeterUnitsTypeEnum.disconnect:
        response = this.service.postMyGridDisconnectDevice(params);
        operationName = this.translate.instant('COMMON.DISCONNECTOR-DISCONNECT');
        component.checkboxLabel = this.translate.instant('COMMON.READ-REGISTERS-AFTER') + ' ' + operationName?.toLowerCase();
        component.checkboxField = 'initiateReading';
        component.checkboxValue = true; // TODO from BE
        break;
      case MeterUnitsTypeEnum.ciiState:
        response = this.service.getCiiState(params);
        operationName = this.translate.instant('COMMON.GET-CII-STATE');
        break;
      case MeterUnitsTypeEnum.ciiActivate:
        response = this.service.postMyGridCiiActivateDevice(params);
        operationName = this.translate.instant('COMMON.CII-ACTIVATE');
        break;
      case MeterUnitsTypeEnum.ciiDeactivate:
        response = this.service.postMyGridCiiDeactivateDevice(params);
        operationName = this.translate.instant('COMMON.CII-DEACTIVATE');
        break;
      case MeterUnitsTypeEnum.activateUpgrade:
        response = this.service.activateDeviceUpgrade(params);
        operationName = this.translate.instant('COMMON.ACTIVATE-FW-UPGRADE');
        break;
      case MeterUnitsTypeEnum.clearFF:
        response = this.service.clearFF(params);
        operationName = this.translate.instant('COMMON.ACTIVATE-CLEAR-FF');
        break;
      case MeterUnitsTypeEnum.clearAlarms:
        response = this.service.clearAlarms(params);
        operationName = this.translate.instant('COMMON.CLEAR-ALARMS');
        break;
      case MeterUnitsTypeEnum.readThresholdsMonitor:
        params.registerTypes = [IRegisterTypesEnum.monitorPhase1, IRegisterTypesEnum.monitorPhase2, IRegisterTypesEnum.monitorPhase3];
        response = this.service.readThresholdValues(params);
        operationName = this.translate.instant('COMMON.READ-MONITOR-THRESHOLD-VALUES');
        break;
      case MeterUnitsTypeEnum.readThresholdsLimiter:
        params.registerTypes = [IRegisterTypesEnum.limiterNormal, IRegisterTypesEnum.limiterEmergency];
        response = this.service.readThresholdValues(params);
        operationName = this.translate.instant('COMMON.READ-LIMITER-THRESHOLD-VALUES');
        break;
      case MeterUnitsTypeEnum.readMeter:
        response = this.service.readMeterValues(params);
        operationName = $localize`Read meter`;
        break;
      case MeterUnitsTypeEnum.enableMeter:
        params.enabled = true;
        response = this.service.postUpdateMeterState(params);
        operationName = this.translate.instant('COMMON.ENABLE-METER');
        break;
      case MeterUnitsTypeEnum.disableMeter:
        params.enabled = false;
        response = this.service.postUpdateMeterState(params);
        operationName = this.translate.instant('COMMON.DISABLE-METER');
        break;
      case MeterUnitsTypeEnum.syncTime:
        response = this.service.synchronizeTime(params);
        operationName = this.translate.instant('COMMON.SYNCHRONIZE-TIME');
        component.checkboxLabel = this.translate.instant('MODAL.UNCONDITIONAL-TIME-SYNCHRONIZATION');
        component.checkboxField = 'unconditionalSync';
        component.checkboxValue = false;
        component.secondConfirmEnabled = true;
        component.confirmMessage =
          this.translate.instant('MODAL.ARE-YOU-SURE-TEXT') +
          ' ' +
          this.translate.instant('MODAL.UNCONDITIONAL-TIME-SYNCHRONIZATION').toLowerCase();
        break;
      //  MeterUnitsTypeEnum.updateShortNames
      case MeterUnitsTypeEnum.updateShortNames:
        response = this.service.updateShortNames(params);
        operationName = this.translate.instant('COMMON.UPDATE-SHORT-NAMES');
        break;
    }
    // component.btnConfirmText = operationName;

    // TODO refactor
    component.modalTitle = `${operationName} (${selectedCount}` + ' ' + this.translate.instant('MODAL.SELECTED') + ')';
    component.modalBody =
      this.translate.instant('MODAL.ARE-YOU-SURE-TEXT') + `${toLower(operationName)}` + this.translate.instant('MODAL.FOR-DEVICES') + '?';

    modalRef.result.then(
      (data) => {
        component.loading = true;
        // if checkbox value is true
        if (data) {
          params[component.checkboxField] = component.checkboxValue; // field must be defined inIActionRequestParams
        }
        // on close (CONFIRM)
        this.toast.successToast(this.translate.instant('COMMON.ACTION-IN-PROGRESS'));
        response.subscribe(
          (value) => {
            component.loading = false;

            if (operation === MeterUnitsTypeEnum.disableMeter || MeterUnitsTypeEnum.enableMeter) {
              // refresh data
              this.eventService.emitCustom('RefreshMeterUnitsListEvent', { refresh: true, deselectRows: false });
            }
            if (value) {
              this.meterUnitsTypeGridService.saveMyGridLinkRequestId(value.requestId);
            }
            if (operation === MeterUnitsTypeEnum.breakerStatus) {
              this.meterUnitsTypeGridService.saveMyGridLink_BreakerState_RequestId(value.requestId);
            } else if (operation === MeterUnitsTypeEnum.ciiState) {
              this.meterUnitsTypeGridService.saveMyGridLink_CiiState_RequestId(value.requestId);
            }
            const options: NgbModalOptions = {
              size: 'md'
            };
            if (value) {
              const modalRefStatusJob = this.modalService.open(StatusJobComponent, options);
              modalRefStatusJob.componentInstance.requestId = value.requestId;
              modalRefStatusJob.componentInstance.jobName = operationName;
              modalRefStatusJob.componentInstance.deviceCount = value.deviceIds.length;
            }
          },
          (e) => {
            component.loading = false;
            this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
          }
        );
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  onSecurityActivateHls(params: IActionRequestParams, selectedRowsCount: number) {
    const modalRef = this.modalService.open(SecurityActivateHlsComponent);
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;
    modalRef.componentInstance.actionRequest = params;

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

  onSecurityRekey(params: IActionRequestParams, selectedRowsCount: number) {
    const modalRef = this.modalService.open(SecurityRekeyComponent);
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;
    modalRef.componentInstance.actionRequest = params;

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

  onSecurityChangePassword(params: IActionRequestParams, selectedRowsCount: number) {
    const modalRef = this.modalService.open(SecurityChangePasswordComponent);
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;
    modalRef.componentInstance.actionRequest = params;

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

  // working payload version with search, filters and select all without ids
  getOperationRequestParam(
    guid: string,
    requestModel: GridRequestParams,
    allItems: number,
    visibleColumnsNames?: string[]
  ): IActionRequestParams {
    const requestParam: IActionRequestParams = {
      pageSize: 0,
      pageNumber: 0,
      textSearch: {
        value: '',
        propNames: null,
        useWildcards: false,
        valuesFromFile: null
      },
      sort: [],
      initiateReading: false, // TODO get data from BE when BE,
      unconditionalSync: false,
      selectAll: this.meterUnitsTypeGridService.getSessionSettingsSelectedAll()
    };
    // details page
    if (guid && guid.length > 0) {
      requestParam.deviceIds = [];
      requestParam.deviceIds.push(guid);
    } else {
      requestParam.deviceIds = requestModel.deviceIds;
      // select all enabled on grid, dont send ids
      if (this.meterUnitsTypeGridService.getSessionSettingsSelectedAll()) {
        console.log('Select ALL ENABLED on grid:');
        requestParam.excludeIds = requestModel.excludeIds;
        requestParam.deviceIds = [];
        requestParam.pageSize = allItems;
        requestParam.pageNumber = 1;

        requestParam.textSearch.value = '';

        if (requestModel.searchModel?.length > 0) {
          requestParam.textSearch.valuesFromFile = requestModel.searchModel[0].valuesFromFile;
          requestParam.textSearch.value = requestModel.searchModel[0].value;
          requestParam.textSearch.propNames = visibleColumnsNames ?? [requestModel.searchModel[0]?.colId];
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

          if (requestModel.filterModel.protocol && requestModel.filterModel.protocol.length > 0) {
            requestModel.filterModel.protocol.map((row) =>
              requestParam.filter.push({
                propName: capitalize(gridSysNameColumnsEnum.protocolType),
                propValue: row.id.toString(),
                filterOperation: filterOperationEnum.equal
              })
            );
          }

          if (requestModel.filterModel.vendors && requestModel.filterModel.vendors?.length > 0) {
            requestModel.filterModel.vendors.map((row) =>
              requestParam.filter.push({
                propName: capitalize(gridSysNameColumnsEnum.vendor),
                propValue: row.id.toString(),
                filterOperation: filterOperationEnum.equal
              })
            );
          }
          if (requestModel.filterModel.firmware && requestModel.filterModel.firmware?.length > 0) {
            requestModel.filterModel.firmware.map((row) =>
              requestParam.filter.push({
                propName: capitalize(gridSysNameColumnsEnum.firmware),
                propValue: row.value,
                filterOperation: filterOperationEnum.contains
              })
            );
          }
          if (requestModel.filterModel.disconnectorState && requestModel.filterModel.disconnectorState?.length > 0) {
            requestModel.filterModel.disconnectorState.map((row) =>
              requestParam.filter.push({
                propName: capitalize(gridSysNameColumnsEnum.disconnectorState),
                propValue: row.id.toString(),
                filterOperation: filterOperationEnum.equal
              })
            );
          }
          if (requestModel.filterModel.ciiState && requestModel.filterModel.ciiState?.length > 0) {
            requestModel.filterModel.ciiState.map((row) =>
              requestParam.filter.push({
                propName: capitalize(gridSysNameColumnsEnum.ciiState),
                propValue: row.id.toString(),
                filterOperation: filterOperationEnum.equal
              })
            );
          }
          if (requestModel.filterModel.tags && requestModel.filterModel.tags?.length > 0) {
            requestModel.filterModel.tags.map((row) =>
              requestParam.filter.push({
                propName: capitalize(gridSysNameColumnsEnum.tags),
                propValue: row.id.toString(),
                filterOperation: filterOperationEnum.contains
              })
            );
          }

          // show operations filter
          if (requestModel.filterModel.showOptionFilter && requestModel.filterModel.showOptionFilter?.length > 0) {
            requestModel.filterModel.showOptionFilter.map((row) => {
              if (row.id === 1) {
                requestParam.filter.push({
                  propName: capitalize(gridSysNameColumnsEnum.hasTemplate),
                  propValue: 'true',
                  filterOperation: filterOperationEnum.equal
                });
              }
              if (row.id === 2) {
                requestParam.filter.push({
                  propName: capitalize(gridSysNameColumnsEnum.hasTemplate),
                  propValue: 'false',
                  filterOperation: filterOperationEnum.equal
                });
              }
              if (row.id === 3) {
                requestParam.filter.push({
                  propName: capitalize(gridSysNameColumnsEnum.readyForActivation),
                  propValue: 'true',
                  filterOperation: filterOperationEnum.equal
                });
              }
              if (row.id === 4) {
                requestParam.filter.push({
                  propName: capitalize(gridSysNameColumnsEnum.isHls),
                  propValue: 'true',
                  filterOperation: filterOperationEnum.equal
                });
              }
              if (row.id === 5) {
                requestParam.filter.push({
                  propName: capitalize(gridSysNameColumnsEnum.isHls),
                  propValue: 'false',
                  filterOperation: filterOperationEnum.equal
                });
              }
              if (row.id === 6) {
                requestParam.filter.push({
                  propName: capitalize(gridSysNameColumnsEnum.serialMismatch),
                  propValue: 'true',
                  filterOperation: filterOperationEnum.equal
                });
              }
              if (row.id === 7) {
                requestParam.filter.push({
                  propName: capitalize(gridSysNameColumnsEnum.timeDeviation),
                  propValue: 'true',
                  filterOperation: filterOperationEnum.equal
                });
              }
            });
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
      }
    }
    console.log('-- OPERATIONS PAYLOAD --');
    console.log(requestParam);
    console.log('-------------');
    return requestParam;
  }

  onReadRegisters(params: IActionRequestParams, selectedRowsCount: number) {
    const options: NgbModalOptions = {
      size: 'lg'
    };
    const modalRef = this.modalService.open(PlcReadRegistersComponent, options);
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.selectedRowsCount = selectedRowsCount;
    modalRef.componentInstance.selectedDeviceIds = params.deviceIds;
    /* modalRef.componentInstance.deviceIdsParam = params.deviceIds;
    modalRef.componentInstance.filterParam = params.filter;
    modalRef.componentInstance.searchParam = params.search;
    modalRef.componentInstance.excludeIdsParam = params.excludeIds;*/

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        if (data === 'save') {
          // TODO open date time picker modal
          this.toast.successToast(this.translate.instant('COMMON.ACTION-IN-PROGRESS'));
        }
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }
}
