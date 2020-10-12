import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-grid-cell-id-number',
  templateUrl: './grid-cell-id-number.component.html'
})
export class GridCellIdNumberComponent implements ICellRendererAngularComp {
  notAvailableText = $localize `N/A`; // N/A
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
}
