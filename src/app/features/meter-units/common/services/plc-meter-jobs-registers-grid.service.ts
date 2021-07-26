import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class PlcMeterJobsRegistersGridService {
  constructor(private translate: TranslateService) {}

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
        headerName: this.translate.instant('GRID.NAME'),
        headerTooltip: this.translate.instant('GRID.NAME')
      },
      {
        field: 'deviceType',
        suppressMenu: true,
        sortable: true,
        headerName: this.translate.instant('GRID.DEVICE-TYPE'),
        headerTooltip: this.translate.instant('GRID.DEVICE-TYPE')
      },
      {
        field: 'description',
        suppressMenu: true,
        sortable: true,
        headerName: this.translate.instant('GRID.DESCRIPTION'),
        headerTooltip: this.translate.instant('GRID.DESCRIPTION')
      }
    ];
  }
}
