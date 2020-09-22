import { Component, ChangeDetectorRef } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { GridApi } from '@ag-grid-community/core';

@Component({
  selector: 'app-grid-cell-actions',
  templateUrl: './grid-cell-actions.component.html'
})
export class GridCellActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public gridApi: GridApi;

  constructor(private i18n: I18n) {}

  // called on init
  agInit(params: any): void {
    this.params = params;
    this.gridApi = this.params.api as GridApi;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    return true;
  }

  onScheduleReadJobs() {
    this.params.context.componentParent.onScheduleReadJobs(this.params.data.deviceId);
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
  onBreakerStatus() {
    this.params.context.componentParent.onBreakerStatus(this.params.data.deviceId);
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
  onDelete() {
    this.params.context.componentParent.onDelete(this.params.data.deviceId);
  }

  // set tooltip text
  setToolTip(type: string) {
    switch (type) {
      case 'detail':
        return this.i18n('Open detail');
      case 'chart':
        return this.i18n('Open data');
      case 'operation':
        return this.i18n('Select operation');
    }
    return '';
  }
}
