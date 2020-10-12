import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { GridApi } from '@ag-grid-community/core';

@Component({
  selector: 'app-grid-cell-remove-btn',
  templateUrl: './grid-cell-remove-btn.component.html'
})
export class GridCellRemoveBtnComponent implements ICellRendererAngularComp {
  private jobId = '';
  public params: any;
  public gridApi: GridApi;

  constructor() {}

  // called on init
  agInit(params: any): void {
    this.params = params;
    this.jobId = params.data.id;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    return true;
  }

  // action delete
  removeItem(params: any) {
    this.params.context.componentParent.removeForm(this.jobId);
  }

  // set tooltip text
  setToolTip() {
    return $localize`Remove job`;
  }
}
