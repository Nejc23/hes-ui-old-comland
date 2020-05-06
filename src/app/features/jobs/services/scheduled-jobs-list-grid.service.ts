import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';
import { GridCellActiveComponent } from '../components/grid-custom-components/grid-cell-active.component';

@Injectable({
  providedIn: 'root'
})
export class ScheduledJobsListGridService {
  columns = [];

  constructor(private i18n: I18n) {}

  public setFrameworkComponents() {
    return {
      gridCellActiveComponent: GridCellActiveComponent
    };
  }

  setGridDefaultColumns() {
    return [
      {
        width: 90,
        suppressMenu: true,
        suppressMovable: true,
        lockPosition: true,
        field: 'active',
        cellRenderer: 'gridCellActiveComponent',
        headerName: this.i18n('Active'),
        headerTooltip: this.i18n('Active')
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
