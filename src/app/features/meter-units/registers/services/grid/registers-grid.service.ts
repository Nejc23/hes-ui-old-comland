import { Injectable } from '@angular/core';
import { GridCellDateComponent } from '../../components/grid/grid-custom-components/grid-cell-date.component';

@Injectable({
  providedIn: 'root'
})
export class RegistersGridService {
  constructor() {}

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
        headerName: `Timestamp`,
        headerTooltip: `Timestamp`,
        cellRendererFramework: GridCellDateComponent
      },
      {
        field: 'value',
        suppressMenu: true,
        sortable: true,
        headerName: `Value`,
        headerTooltip: `Value`
      },
      {
        field: 'valueWithUnit.unit',
        suppressMenu: true,
        sortable: true,
        headerName: $localize`Unit`,
        headerTooltip: $localize`Unit`
      },
      {
        field: 'status',
        suppressMenu: true,
        sortable: true,
        headerName: `Status`,
        headerTooltip: `Status`
      }
    ];
  }

  setGridColumnsEvents() {
    return [
      {
        field: 'timestamp',
        suppressMenu: true,
        sortable: true,
        headerName: `Timestamp`,
        headerTooltip: `Timestamp`,
        cellRendererFramework: GridCellDateComponent
      },
      {
        field: 'value',
        suppressMenu: true,
        sortable: true,
        headerName: `Id`,
        headerTooltip: `Id`
      },
      {
        field: 'description',
        suppressMenu: true,
        sortable: true,
        headerName: `Description`,
        headerTooltip: `Description`
      }
    ];
  }
}
