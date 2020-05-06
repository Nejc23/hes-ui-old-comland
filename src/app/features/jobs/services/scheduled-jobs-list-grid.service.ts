import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ScheduledJobsListGridService {
  columns = [];

  constructor(private i18n: I18n) {}

  setGridDefaultColumns() {
    return [
      {
        width: 90,
        checkboxSelection: true,
        suppressMenu: true,
        suppressMovable: true,
        lockPosition: true,
        colId: 'active',
        headerName: this.i18n('Active'),
        headerTooltip: this.i18n('Active'),
        headerCheckboxSelection: false
      },
      {
        field: 'type',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        headerName: this.i18n('Job Type'),
        headerTooltip: this.i18n('Job Type')
      },
      {
        field: 'description',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        headerName: this.i18n('Description'),
        headerTooltip: this.i18n('Description')
      },
      {
        field: 'nextRun',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        headerName: this.i18n('Next run'),
        headerTooltip: this.i18n('Next run')
      },
      {
        field: 'owner',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        headerName: this.i18n('Owner'),
        headerTooltip: this.i18n('Owner')
      }
    ];
  }
}
