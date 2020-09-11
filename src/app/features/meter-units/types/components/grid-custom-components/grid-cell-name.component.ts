import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-grid-cell-name',
  templateUrl: './grid-cell-name.component.html'
})
export class GridCellNameComponent implements ICellRendererAngularComp {
  public params: any;

  constructor() {}

  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  // action show details
  showItem() {
    this.params.context.showItem(this.params.data.deviceId);
  }
}
