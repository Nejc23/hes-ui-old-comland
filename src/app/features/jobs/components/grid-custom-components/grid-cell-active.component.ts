import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as moment from 'moment';

@Component({
  selector: 'app-grid-cell-active',
  templateUrl: './grid-cell-active.component.html'
})
export class GridCellActiveComponent implements ICellRendererAngularComp {
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
