import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class RegistersSelectGridService {
  columns = [];

  constructor(private translate: TranslateService) {}

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
        headerTooltip: this.translate.instant('GRID.SELECT-DESELECT-ALL'),
        headerCheckboxSelection: false
      },
      {
        field: 'name',
        suppressMenu: true,
        sortable: true,
        headerName: this.translate.instant('GRID.NAME'),
        headerTooltip: this.translate.instant('GRID.NAME')
      },
      {
        field: 'type',
        suppressMenu: true,
        sortable: true,
        headerName: this.translate.instant('GRID.TYPE'),
        headerTooltip: this.translate.instant('GRID.TYPE')
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
        headerTooltip: this.translate.instant('GRID.SELECT-DESELECT-ALL'),
        headerCheckboxSelection: true
      },
      {
        field: 'name',
        suppressMenu: true,
        sortable: true,
        headerName: this.translate.instant('GRID.NAME'),
        headerTooltip: this.translate.instant('GRID.NAME')
      },
      {
        field: 'type',
        suppressMenu: true,
        sortable: true,
        headerName: this.translate.instant('GRID.TYPE'),
        headerTooltip: this.translate.instant('GRID.TYPE')
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
