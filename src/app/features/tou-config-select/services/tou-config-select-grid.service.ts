import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TouConfigSelectGridService {
  columns = [];

  constructor() {}

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
        colId: 'timeOfUseId',
        headerTooltip: `Select/deselect`,
        headerCheckboxSelection: false
      },
      {
        field: 'timeOfUseName',
        width: 160,
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        headerName: `Name`,
        headerTooltip: 'Name'
      },
      {
        field: 'description',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        headerName: `Description`,
        headerTooltip: `Description`
      }
    ];
  }
}
