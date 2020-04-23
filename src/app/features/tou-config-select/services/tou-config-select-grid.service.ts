import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class TouConfigSelectGridService {
  columns = [];

  constructor(private i18n: I18n) {}

  setGridDefaultColumns() {
    return [
      {
        minWidth: 45,
        maxWidth: 45,
        width: 45,
        checkboxSelection: true,
        suppressMenu: true,
        suppressMovable: true,
        lockPosition: true,
        colId: 'id',
        headerTooltip: this.i18n('Select/deselect'),
        headerCheckboxSelection: false
      },
      {
        field: 'id',
        width: 45,
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        headerName: this.i18n('Id'),
        headerTooltip: this.i18n('Id')
      },
      {
        field: 'description',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        headerName: this.i18n('Description'),
        headerTooltip: this.i18n('Description')
      }
    ];
  }
}
