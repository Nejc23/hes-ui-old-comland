import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class RegistersSelectGridService {
  columns = [];

  constructor(private i18n: I18n) {}

  setGridDefaultColumns() {
    return [
      {
        pinned: true,
        minWidth: 45,
        maxWidth: 45,
        width: 45,
        suppressColumnsToolPanel: true,
        checkboxSelection: true,
        suppressMovable: true,
        lockPosition: true,
        colId: 'id',
        headerTooltip: this.i18n('Select/deselect all'),
        headerCheckboxSelection: true
      },
      {
        field: 'name',
        pinned: true,
        headerName: this.i18n('Name'),
        headerTooltip: this.i18n('Name')
      },
      {
        field: 'type',
        pinned: true,
        headerName: this.i18n('Type'),
        headerTooltip: this.i18n('Type')
      },
      {
        field: 'description',
        pinned: true,
        headerName: this.i18n('Description'),
        headerTooltip: this.i18n('Description')
      }
    ];
  }
}
