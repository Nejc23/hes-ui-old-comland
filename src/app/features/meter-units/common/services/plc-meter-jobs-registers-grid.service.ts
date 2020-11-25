import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlcMeterJobsRegistersGridService {
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
        colId: 'templateId'
      },
      {
        field: 'name',
        suppressMenu: true,
        sortable: true,
        headerName: $localize`Name`,
        headerTooltip: $localize`Name`
      },
      {
        field: 'deviceType',
        suppressMenu: true,
        sortable: true,
        headerName: $localize`Device type`,
        headerTooltip: $localize`Device type`
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
