import { PermissionEnumerator } from './../../../../../core/permissions/enumerators/permission-enumerator.model';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { GridApi } from '@ag-grid-community/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-grid-cell-actions',
  templateUrl: './grid-cell-actions.component.html'
})
export class GridCellActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public gridApi: GridApi;

  constructor(private translate: TranslateService) {}

  // called on init
  agInit(params: any): void {
    this.params = params;
    this.gridApi = this.params.api as GridApi;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    return true;
  }

  showItem() {
    this.params.context.componentParent.showItem(this.params.data.deviceId);
  }

  onScheduleReadJobs() {
    this.params.context.componentParent.onScheduleReadJobs(this.params.data.deviceId);
  }
  onJobsTemplates() {
    this.params.context.componentParent.onJobsTemplates(this.params.data.deviceId);
  }
  onTou() {
    this.params.context.componentParent.onTou(this.params.data.deviceId);
  }
  onUpgrade() {
    this.params.context.componentParent.onUpgrade(this.params.data.deviceId);
  }
  onSetMonitor() {
    this.params.context.componentParent.onSetMonitor(this.params.data.deviceId);
  }
  onReadMonitorThreshold() {
    this.params.context.componentParent.onReadMonitorThreshold(this.params.data.deviceId);
  }
  onSetLimiter() {
    this.params.context.componentParent.onSetLimiter(this.params.data.deviceId);
  }
  onReadLimiterThreshold() {
    this.params.context.componentParent.onReadLimiterThreshold(this.params.data.deviceId);
  }
  onDisconnectorStatus() {
    this.params.context.componentParent.onDisconnectorStatus(this.params.data.deviceId);
  }
  onDisconnectorMode() {
    this.params.context.componentParent.onDisconnectorMode(this.params.data.deviceId);
  }
  onActivateUpgrade() {
    this.params.context.componentParent.onActivateUpgrade(this.params.data.deviceId);
  }
  onConnect() {
    this.params.context.componentParent.onConnect(this.params.data.deviceId);
  }
  onDisconnect() {
    this.params.context.componentParent.onDisconnect(this.params.data.deviceId);
  }

  onCiiState() {
    this.params.context.componentParent.onCiiState(this.params.data.deviceId);
  }
  onCiiActivate() {
    this.params.context.componentParent.onCiiActivate(this.params.data.deviceId);
  }
  onCiiDeactivate() {
    this.params.context.componentParent.onCiiDeactivate(this.params.data.deviceId);
  }

  onRelaysConnect() {
    this.params.context.componentParent.onRelaysConnect(this.params.data.deviceId);
  }

  onRelaysDisconnect() {
    this.params.context.componentParent.onRelaysDisconnect(this.params.data.deviceId);
  }

  // popup
  onRelaysState() {
    this.params.context.componentParent.onRelaysState(this.params.data.deviceId);
  }

  // popup
  onRelaysSetMode() {
    this.params.context.componentParent.onRelaysSetMode(this.params.data.deviceId);
  }

  onClearFF() {
    this.params.context.componentParent.onClearFF(this.params.data.deviceId);
  }
  onDelete() {
    this.params.context.componentParent.onDelete(this.params.data.deviceId);
  }

  onSetDisplaySettings() {
    this.params.context.componentParent.onSetDisplaySettings(this.params.data.deviceId);
  }

  onClearAlarms() {
    this.params.context.componentParent.onClearAlarms(this.params.data.deviceId);
  }

  // permission rights
  get permissionMuManage() {
    return PermissionEnumerator.Manage_Meters;
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
  get permissionReadMeter() {
    return PermissionEnumerator.Read_Meter;
  }

  // set tooltip text
  setToolTip(type: string) {
    switch (type) {
      case 'details':
        return this.translate.instant('COMMON.OPEN-DETAILS');
      case 'chart':
        return this.translate.instant('COMMON.OPEN-DATA');
      case 'operation':
        return this.translate.instant('COMMON.SELECT-OPERATION');
    }
    return '';
  }

  showRegisters() {
    this.params.context.componentParent.showRegisters(this.params.data.deviceId);
  }
}
