import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';

@Component({
  selector: 'app-grid-cell-unit',
  templateUrl: './grid-cell-unit.component.html'
})
export class GridCellUnitComponent implements ICellRendererAngularComp {
  notAvailableText = $localize`N/A`;
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
