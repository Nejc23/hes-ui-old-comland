import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TouConfigSelectGridService {
  columns = [];

  constructor(private translate: TranslateService) {}

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
        headerTooltip: this.translate.instant('GRID.SELECT-DESELECT-ALL'),
        headerCheckboxSelection: false
      },
      {
        field: 'timeOfUseName',
        width: 160,
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        lockPosition: true,
        headerName: this.translate.instant('GRID.NAME'),
        headerTooltip: this.translate.instant('GRID.NAME')
      },
      {
        field: 'description',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        headerName: this.translate.instant('GRID.DESCRIPTION'),
        headerTooltip: this.translate.instant('GRID.DESCRIPTION')
      }
    ];
  }
}
