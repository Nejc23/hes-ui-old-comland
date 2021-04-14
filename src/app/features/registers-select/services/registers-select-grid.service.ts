import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistersSelectGridService {
  columns = [];

  constructor() {}

  setGridReadOnlyColumns() {
    return [
      {
        minWidth: 45,
        maxWidth: 45,
        width: 45,
        suppressMenu: true,
        // checkboxSelection: true,
        editable: false,
        suppressMovable: true,
        lockPosition: true,
        colId: 'id',
        headerTooltip: $localize`Select/deselect all`,
        headerCheckboxSelection: false
      },
      {
        field: 'name',
        suppressMenu: true,
        sortable: true,
        headerName: $localize`Name`,
        headerTooltip: $localize`Name`
      },
      {
        field: 'type',
        suppressMenu: true,
        sortable: true,
        headerName: $localize`Type`,
        headerTooltip: $localize`Type`
      },
      {
        field: 'description',
        suppressMenu: true,
        sortable: true,
        headerName: $localize`Description`,
        headerTooltip: $localize`Description`
      }
    ];
  }

  setGridDefaultColumns() {
    return [
      {
        minWidth: 45,
        maxWidth: 45,
        width: 45,
        suppressMenu: true,
        checkboxSelection: true,
        suppressMovable: true,
        lockPosition: true,
        colId: 'id',
        headerTooltip: $localize`Select/deselect all`,
        headerCheckboxSelection: true
      },
      {
        field: 'name',
        suppressMenu: true,
        sortable: true,
        headerName: $localize`Name`,
        headerTooltip: $localize`Name`
      },
      {
        field: 'type',
        suppressMenu: true,
        sortable: true,
        headerName: $localize`Type`,
        headerTooltip: $localize`Type`
      },
      {
        field: 'description',
        suppressMenu: true,
        sortable: true,
        headerName: $localize`Description`,
        headerTooltip: $localize`Description`
      }
    ];
  }
}
