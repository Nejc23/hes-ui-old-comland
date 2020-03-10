import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { readStatusTrashold } from '../../consts/data-concentrator-units.consts';

@Component({
  selector: 'app-grid-cell-name',
  templateUrl: './grid-cell-name.component.html'
})
export class GridCellNameComponent implements ICellRendererAngularComp {
  tresholds = readStatusTrashold;
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
