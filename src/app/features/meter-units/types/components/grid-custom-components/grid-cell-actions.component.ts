import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { GridApi } from '@ag-grid-community/core';

@Component({
  selector: 'app-grid-cell-actions',
  templateUrl: './grid-cell-actions.component.html'
})
export class GridCellActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public gridApi: GridApi;

  constructor() {}

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
  onSetLimiter() {
    this.params.context.componentParent.onSetLimiter(this.params.data.deviceId);
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

  onRelaysConnect(selectedGuid: string) {
    this.params.context.componentParent.onRelaysConnect(this.params.data.deviceId);
  }

  onRelaysDisconnect(selectedGuid: string) {
    this.params.context.componentParent.onRelaysDisconnect(this.params.data.deviceId);
  }

  // popup
  onRelaysState(selectedGuid: string) {
    this.params.context.componentParent.onRelaysState(this.params.data.deviceId);
  }

  // popup
  onRelaysSetMode(selectedGuid: string) {
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

  // set tooltip text
  setToolTip(type: string) {
    switch (type) {
      case 'details':
        return $localize`Open details`;
      case 'chart':
        return $localize`Open data`;
      case 'operation':
        return $localize`Select operation`;
    }
    return '';
  }

  showRegisters() {
    this.params.context.componentParent.showRegisters(this.params.data.deviceId);
  }
}
