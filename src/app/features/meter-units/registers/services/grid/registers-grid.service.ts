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
        headerName: $localize`Timestamp`,
        headerTooltip: $localize`Timestamp`,
        cellRendererFramework: GridCellDateComponent
      },
      {
        field: 'value',
        suppressMenu: true,
        sortable: true,
        headerName: $localize`Value`,
        headerTooltip: $localize`Value`
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
        headerName: $localize`Status`,
        headerTooltip: $localize`Status`
      }
    ];
  }

  setGridColumnsEvents() {
    return [
      {
        field: 'timestamp',
        suppressMenu: true,
        sortable: true,
        headerName: $localize`Timestamp`,
        headerTooltip: $localize`Timestamp`,
        cellRendererFramework: GridCellDateComponent
      },
      {
        field: 'value',
        suppressMenu: true,
        sortable: true,
        headerName: $localize`Id`,
        headerTooltip: $localize`Id`
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
