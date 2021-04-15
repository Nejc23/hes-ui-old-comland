import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { GridApi } from '@ag-grid-community/core';
import { Router } from '@angular/router';
import { DcOperationsService } from '../../services/dc-operations.service';
import { DcOperationTypeEnum } from '../../enums/operation-type.enum';

@Component({
  selector: 'app-grid-cell-actions',
  templateUrl: './grid-cell-actions.component.html'
})
export class GridCellActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public gridApi: GridApi;

  constructor(private router: Router) {}

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

  // set tooltip text
  setToolTip(type: string) {
    switch (type) {
      case 'details':
        return $localize`Open details`;
      case 'operation':
        return $localize`Select operation`;
    }
    return '';
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

  get permissionSynchronizeTime() {
    return PermissionEnumerator.Sync_Time;
  }

  get permissionFwUpgrade() {
    return PermissionEnumerator.Concentrator_FW_Upgrade;
  }

  get permissionDeviceDiscovery() {
    return PermissionEnumerator.Sync_Time;
  }
}
