import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActiveJobsGridService {
  columns = [];

  constructor() {}

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
}
