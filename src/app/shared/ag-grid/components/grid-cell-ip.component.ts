import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-grid-cell-ip',
  templateUrl: './grid-cell-ip.component.html'
})
export class GridCellIpComponent implements ICellRendererAngularComp {
  notAvailableText = this.i18n('N/A'); // N/A
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