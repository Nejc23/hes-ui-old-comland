import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GridColumnShowHideService } from '../../../../../core/ag-grid-helpers/services/grid-column-show-hide.service';
import { AuthService } from '../../../../../core/auth/services/auth.service';
import { ModalService } from '../../../../../core/modals/services/modal.service';
import { PermissionEnumerator } from '../../../../../core/permissions/enumerators/permission-enumerator.model';
import { GridRequestParams } from '../../../../../core/repository/interfaces/helpers/grid-request-params.interface';
import { CodelistMeterUnitsRepositoryService } from '../../../../../core/repository/services/codelists/codelist-meter-units-repository.service';
import { ConcentratorService } from '../../../../../core/repository/services/concentrator/concentrator.service';
import { MeterUnitsService } from '../../../../../core/repository/services/meter-units/meter-units.service';
import { MyGridLinkService } from '../../../../../core/repository/services/myGridLink/myGridLink.service';
import { SettingsStoreEmitterService } from '../../../../../core/repository/services/settings-store/settings-store-emitter.service';
import { SettingsStoreService } from '../../../../../core/repository/services/settings-store/settings-store.service';
import { ToastNotificationService } from '../../../../../core/toast-notification/services/toast-notification.service';
import { GridLayoutSessionStoreService } from '../../../../../core/utils/services/grid-layout-session-store.service';
import { GridSettingsCookieStoreService } from '../../../../../core/utils/services/grid-settings-cookie-store.service';
import { AgGridSharedFunctionsService } from '../../../../../shared/ag-grid/services/ag-grid-shared-functions.service';
import { BreadcrumbService } from '../../../../../shared/breadcrumbs/services/breadcrumb.service';
import { JobsSelectGridService } from '../../../../jobs/jobs-select/services/jobs-select-grid.service';
import { MeterUnitsTypeEnum } from '../../enums/meter-units-type.enum';
import { MeterUnitsPlcActionsService } from '../../services/meter-units-plc-actions.service';
import { MeterUnitsTypeGridService } from '../../services/meter-units-type-grid.service';
import { MeterUnitsTypeStaticTextService } from '../../services/meter-units-type-static-text.service';
import { ExportDataComponent } from '../../../common/components/export-data/export-data.component';
import { IActionRequestParams } from '../../../../../core/repository/interfaces/myGridLink/action-prams.interface';
import { MeterParametrizationComponent } from '../../../../../shared/meter-parametrization/meter-parametrization.component';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { StatusJobComponent } from '../../../../jobs/components/status-job/status-job.component';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html'
})
export class ActionButtonsComponent {
  @Input() requestModel: GridRequestParams;
  @Input() selectedCount: number;
  @Input() searchColumnNames: string[] = [];

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private staticTextService: MeterUnitsTypeStaticTextService,
    public gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private meterUnitsTypeService: MeterUnitsService,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    private codelistMeterUnitsService: CodelistMeterUnitsRepositoryService,
    private service: MyGridLinkService,
    private authService: AuthService,
    private toast: ToastNotificationService,
    private agGridSharedFunctionsService: AgGridSharedFunctionsService,
    private gridColumnShowHideService: GridColumnShowHideService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private plcActionsService: MeterUnitsPlcActionsService,
    private settingsStoreService: SettingsStoreService,
    private settingsStoreEmitterService: SettingsStoreEmitterService,
    private jobsSelectGridService: JobsSelectGridService,
    private modalService: ModalService,
    private concentratorService: ConcentratorService,
    private translate: TranslateService
  ) {}

  // permission rights
  get permissionMuManage() {
    return PermissionEnumerator.Manage_Meters;
  }

  get permissionDeleteMeterData() {
    return PermissionEnumerator.Delete_Meter_Data;
  }

  get permissionManageJobs() {
    return PermissionEnumerator.Manage_Jobs;
  }

  get permissionManageAutoTemplates() {
    return PermissionEnumerator.Manage_Auto_Template_Rules;
  }

  get permissionFwUpgrade() {
    return PermissionEnumerator.Meter_FW_Upgrade;
  }

  get permissionDisconnectorConnect() {
    return PermissionEnumerator.Disconnector_Connect;
  }

  get permissionDisconnectorDisconnect() {
    return PermissionEnumerator.Disconnector_Disconnect;
  }

  get permissionDisconnectorGetState() {
    return PermissionEnumerator.Disconnector_Get_State;
  }

  get permissionDisconnectorSetMode() {
    return PermissionEnumerator.Disconnector_Set_Mode;
  }

  get permissionCiiActivate() {
    return PermissionEnumerator.CII_Activate;
  }

  get permissionCiiDeactivate() {
    return PermissionEnumerator.CII_Deactivate;
  }

  get permissionCiiState() {
    return PermissionEnumerator.CII_Get_State;
  }

  get permissionRelaysConnect() {
    return PermissionEnumerator.Relay_Connect;
  }

  get permissionRelaysDisconnect() {
    return PermissionEnumerator.Relay_Disconnect;
  }

  get permissionRelaysState() {
    return PermissionEnumerator.Relay_Get_State;
  }

  get permissionRelaysSetMode() {
    return PermissionEnumerator.Relay_Set_Mode;
  }

  get permissionTouUpload() {
    return PermissionEnumerator.TOU_Upload;
  }

  get permissionSetLimiter() {
    return PermissionEnumerator.Set_Limiter;
  }

  get permissionSetMonitor() {
    return PermissionEnumerator.Set_Monitor;
  }

  get permissionClearFF() {
    return PermissionEnumerator.Clear_FF;
  }

  get permissionSetDisplay() {
    return PermissionEnumerator.Set_Display;
  }

  get permissionClearAlarms() {
    return PermissionEnumerator.Clear_Alarms;
  }

  get permissionAssignTemplates() {
    return PermissionEnumerator.Assign_Templates;
  }

  get permissionSecurityActivateHls() {
    return PermissionEnumerator.Activate_HLS;
  }

  get permissionSecurityReKey() {
    return PermissionEnumerator.Initial_Re_Keying;
  }

  get permissionSecurityChangePassword() {
    return PermissionEnumerator.Change_Password;
  }

  get permissionReadMeter() {
    return PermissionEnumerator.Read_Meter;
  }

  get permissionSyncTime() {
    return PermissionEnumerator.Sync_Time;
  }

  get permissionDataExport() {
    return PermissionEnumerator.Data_Export;
  }

  get permissionUpdateShortNames() {
    return PermissionEnumerator.Update_Short_Names;
  }

  get permissionMeterParametrization() {
    return PermissionEnumerator.Meter_Parametrization;
  }

  // --> Operations action click (bulk or selected row)
  onDisconnectorStatus(selectedGuid?: string) {
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.breakerStatus,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  onActivateUpgrade(selectedGuid?: string) {
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.activateUpgrade,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  onConnect(selectedGuid?: string) {
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.connect,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  onDisconnect(selectedGuid?: string) {
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.disconnect,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  onCiiState(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.ciiState,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  onCiiActivate(selectedGuid?: string) {
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.ciiActivate,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  onCiiDeactivate(selectedGuid?: string) {
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.ciiDeactivate,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  onClearFF(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.clearFF,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  onDelete(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );

    this.plcActionsService.onDelete(params, selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount);
  }

  onDeleteData(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );

    this.plcActionsService.onDeleteMeterData(params, selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount);
  }

  // popup
  onScheduleReadJobs(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );

    this.plcActionsService.onScheduleReadJobs(params, selectedGuid?.length > 0 ? 1 : this.selectedCount);
  }

  // popup
  onScheduleMeterTimeSyncJobs(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );

    this.plcActionsService.onScheduleMeterTimeSyncJobs(params, selectedGuid?.length > 0 ? 1 : this.selectedCount);
  }

  onJobsAssignExisting(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.onJobsAssignExisting(params, selectedGuid?.length > 0 ? 1 : this.selectedCount);
  }

  onJobsTemplates(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.onJobsTemplates(params, selectedGuid?.length > 0 ? 1 : this.selectedCount);
  }

  // popup
  onTou(selectedGuid?: string) {
    const actionName = this.translate.instant('PLC-METER.TOU-UPLOAD');
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.onTou(params, selectedGuid?.length > 0 ? 1 : this.selectedCount, actionName);
  }

  // popup
  onUpgrade(selectedGuid?: string) {
    const actionName = this.translate.instant('PLC-METER.UPLOAD-IMAGE');
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.onUpgrade(params, selectedGuid?.length > 0 ? 1 : this.selectedCount, actionName);
  }

  onMeterParametrization(selectedGuid?: string, actionName?: string) {
    const params: IActionRequestParams = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    const modalRef = this.modalService.open(MeterParametrizationComponent, { size: 'lg' });
    modalRef.componentInstance.actionRequest = params;
    modalRef.componentInstance.selectedRowsCount = this.selectedCount;

    modalRef.result.then(
      (data) => {
        // on close (cancel or requestId as parameter)
        if (data !== 'cancel') {
          this.toast.successToast(this.translate.instant('COMMON.ACTION-IN-PROGRESS'));
          const options: NgbModalOptions = {
            size: 'lg'
          };
          const modalRef = this.modalService.open(StatusJobComponent, options);
          modalRef.componentInstance.requestId = data; // requestId
          modalRef.componentInstance.jobName = this.translate.instant('PLC-METER.METER-PARAMETRIZATION');
          modalRef.componentInstance.deviceCount = params.deviceIds.length;
        }
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  // popup
  onSetMonitor(selectedGuid?: string) {
    const actionName = this.translate.instant('PLC-METER.SET-MONITOR');
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.onSetMonitor(params, selectedGuid?.length > 0 ? 1 : this.selectedCount, actionName);
  }

  // popup
  onSetLimiter(selectedGuid?: string) {
    const actionName = this.translate.instant('PLC-METER.SET-LIMITER');
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.onSetLimiter(params, selectedGuid?.length > 0 ? 1 : this.selectedCount, actionName);
  }

  // popup
  onReadLimiterThreshold(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.readThresholdsLimiter,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  onReadMonitorThreshold(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.readThresholdsMonitor,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  onUpdateShortNames(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.updateShortNames,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  // popup
  onRelaysConnect(selectedGuid?: string) {
    const actionName = this.translate.instant('PLC-METER.RELAY-CONNECT');
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.onRelaysConnect(params, selectedGuid?.length > 0 ? 1 : this.selectedCount, actionName);
  }

  // popup
  onRelaysDisconnect(selectedGuid?: string) {
    const actionName = this.translate.instant('PLC-METER.RELAY-DISCONNECT');
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.onRelaysDisconnect(params, selectedGuid?.length > 0 ? 1 : this.selectedCount, actionName);
  }

  // popup
  onRelaysState(selectedGuid?: string) {
    const actionName = this.translate.instant('PLC-METER.RELAY-STATE');
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.onRelaysState(params, selectedGuid?.length > 0 ? 1 : this.selectedCount, actionName);
  }

  // popup
  onRelaysSetMode(selectedGuid?: string) {
    const actionName = this.translate.instant('PLC-METER.RELAY-MODE');
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.onRelaysSetMode(params, selectedGuid?.length > 0 ? 1 : this.selectedCount, actionName);
  }

  // popup
  onDisconnectorMode(selectedGuid?: string) {
    const actionName = this.translate.instant('PLC-METER.BREAKER-MODE');
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.onDisconnectorMode(params, selectedGuid?.length > 0 ? 1 : this.selectedCount, actionName);
  }

  // popup
  onSetDisplaySettings(selectedGuid?: string) {
    const actionName = this.translate.instant('PLC-METER.SET-DISPLAY-SETTINGS');
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );

    this.plcActionsService.onSetDisplaySettings(params, selectedGuid?.length > 0 ? 1 : this.selectedCount, actionName);
  }

  // on clear alarms
  onClearAlarms(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.clearAlarms,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  // popup
  onReadMeter(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.onReadRegisters(params, selectedGuid?.length > 0 ? 1 : this.selectedCount);
  }

  // <-- end Operations action click (bulk or selected row)

  onSecurityActivateHls(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );

    this.plcActionsService.onSecurityActivateHls(params, selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount);
  }

  onSecurityRekey(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );

    this.plcActionsService.onSecurityRekey(params, selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount);
  }

  onSecurityInitalRekey(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );

    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.initailRekey,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  // --> start Security action click (bulk or selected row)

  onSecurityChangePassword(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );

    this.plcActionsService.onSecurityChangePassword(params, selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount);
  }

  // popup
  onSyncTime(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.syncTime,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  onEnableMeter(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.enableMeter,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  onDisableMeter(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.disableMeter,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.selectedCount
    );
  }

  onExportData(selectedGuid?: string) {
    const params: IActionRequestParams = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.selectedCount,
      this.searchColumnNames
    );
    const modalRef = this.modalService.open(ExportDataComponent, { size: 'md' });
    modalRef.componentInstance.params = params;

    modalRef.result
      .then(() => {
        // todo
        console.log('success');
      })
      .catch(() => {});
  }
}
