import { Injectable } from '@angular/core';
import * as _ from 'lodash';

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
        headerTooltip: $localize`Select/deselect`,
        headerCheckboxSelection: false
      },
      {
        field: 'timeOfUseName',
        width: 160,
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        headerName: $localize`Name`,
        headerTooltip: $localize`'Name`
      },
      {
        field: 'description',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        headerName: $localize`Description`,
        headerTooltip: $localize`Description`
      }
    ];
  }
}
