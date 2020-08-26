import { Component, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-grid-cell-active-readony',
  templateUrl: './grid-cell-active-readonly.component.html'
})
export class GridCellActiveReadonlyComponent implements ICellRendererAngularComp {
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

  // set tooltip text
  setToolTip(value: boolean) {
    return value ? this.i18n('Active') : this.i18n('Inactive');
  }
}
