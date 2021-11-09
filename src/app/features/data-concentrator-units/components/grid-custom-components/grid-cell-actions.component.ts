import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { GridApi } from '@ag-grid-community/core';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { DeviceState } from '../../../../core/repository/interfaces/meter-units/meter-unit-details.interface';

@Component({
  selector: 'app-grid-cell-actions',
  templateUrl: './grid-cell-actions.component.html'
})
export class GridCellActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public gridApi: GridApi;
  DeviceStateEnum = DeviceState;

  constructor(private router: Router) {}

  get permissionSynchronizeTime() {
    return PermissionEnumerator.Sync_Time;
  }

  get permissionFwUpgrade() {
    return PermissionEnumerator.Concentrator_FW_Upgrade;
  }

  get permissionDeviceDiscovery() {
    return PermissionEnumerator.Manage_Concentrators;
  }

  // called on init
  agInit(params: any): void {
    this.params = params;
    this.gridApi = this.params.api as GridApi;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    return true;
  }

  toDetails() {
    this.router.navigate(['dataConcentratorUnits/' + this.params.data.concentratorId]);
  }

  onSynchronizeTime() {
    this.params.context.componentParent.onSynchronizeTime(this.params.data.concentratorId);
  }

  onFwUpgrade() {
    this.params.context.componentParent.onFwUpgrade(this.params.data.concentratorId);
  }

  onDeviceDiscovery() {
    this.params.context.componentParent.onDeviceDiscovery(this.params.data.concentratorId);
  }

  onEnableDC() {
    this.params.context.componentParent.onEnableDC(this.params.data.concentratorId);
  }

  onDisableDC() {
    this.params.context.componentParent.onDisableDC(this.params.data.concentratorId);
  }
}
