import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-grid-cell-status',
  templateUrl: './grid-cell-status.component.html'
})
export class GridCellStatusComponent implements ICellRendererAngularComp {
  public params: any;

  constructor(private i18n: I18n) {}
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
