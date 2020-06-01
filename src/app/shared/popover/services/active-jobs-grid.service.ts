import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';
import { GridCellActiveJobStatusComponent } from '../components/grid-custom-components/grid-cell-active-job-status.component';
import { GridCellLinkComponent } from '../components/grid-custom-components/grid-cell-link.component';

@Injectable({
  providedIn: 'root'
})
export class ActiveJobsGridService {
  columns = [];

  constructor(private i18n: I18n) {}

  setGridDefaultColumns() {
    return [
      {
        field: 'type',
        suppressMenu: true
      },
      {
        field: 'running',
        suppressMenu: true,
        cellRenderer: 'gridCellActiveJobStatusComponent'
      },
      {
        field: 'triggerInfo',
        suppressMenu: true
      },
      {
        field: 'timeInfo',
        suppressMenu: true
      },
      {
        field: 'id',
        suppressMenu: true,
        cellRenderer: 'gridCellLinkComponent'
      }
    ];
  }

  public setFrameworkComponents() {
    return {
      gridCellActiveJobStatusComponent: GridCellActiveJobStatusComponent,
      gridCellLinkComponent: GridCellLinkComponent
    };
  }
}