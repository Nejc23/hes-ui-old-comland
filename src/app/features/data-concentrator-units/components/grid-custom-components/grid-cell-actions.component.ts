import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { GridApi } from '@ag-grid-community/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid-cell-actions',
  templateUrl: './grid-cell-actions.component.html'
})
export class GridCellActionsComponent implements ICellRendererAngularComp {
  public params: any;
  public gridApi: GridApi;

  constructor(private i18n: I18n, private router: Router) {}

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
        return this.i18n('Open details');
    }
    return '';
  }
}
