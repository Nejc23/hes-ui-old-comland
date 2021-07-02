import { Injectable } from '@angular/core';
import { GridCellDateComponent } from '../../components/grid/grid-custom-components/grid-cell-date.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class RegistersGridService {
  constructor(private translate: TranslateService) {}

  setGridColumnsForCategorization(categorization: string) {
    if (categorization === 'EVENT') {
      return this.setGridColumnsEvents();
    }
    return this.setGridColumns();
  }

  setGridColumns() {
    return [
      {
        field: 'timestamp',
        suppressMenu: true,
        sortable: true,
        headerName: this.translate.instant('GRID.TIMESTAMP'),
        headerTooltip: this.translate.instant('GRID.TIMESTAMP'),
        cellRendererFramework: GridCellDateComponent
      },
      {
        field: 'value',
        suppressMenu: true,
        sortable: true,
        headerName: this.translate.instant('GRID.VALUE'),
        headerTooltip: this.translate.instant('GRID.VALUE')
      },
      {
        field: 'valueWithUnit.unit',
        suppressMenu: true,
        sortable: true,
        headerName: this.translate.instant('GRID.UNIT'),
        headerTooltip: this.translate.instant('GRID.UNIT')
      },
      {
        field: 'status',
        suppressMenu: true,
        sortable: true,
        headerName: this.translate.instant('GRID.STATUS'),
        headerTooltip: this.translate.instant('GRID.STATUS')
      }
    ];
  }

  setGridColumnsEvents() {
    return [
      {
        field: 'timestamp',
        suppressMenu: true,
        sortable: true,
        headerName: this.translate.instant('GRID.TIMESTAMP'),
        headerTooltip: this.translate.instant('GRID.TIMESTAMP'),
        cellRendererFramework: GridCellDateComponent
      },
      {
        field: 'value',
        suppressMenu: true,
        sortable: true,
        headerName: this.translate.instant('GRID.ID'),
        headerTooltip: this.translate.instant('GRID.ID')
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
