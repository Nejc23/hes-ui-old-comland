import { Injectable, PipeTransform } from '@angular/core';
import { GridCellDateComponent } from '../../components/grid/grid-custom-components/grid-cell-date.component';

@Injectable({
  providedIn: 'root'
})
export class RegistersGridService {
  constructor() {}

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
        field: 'status',
        suppressMenu: true,
        sortable: true,
        headerName: $localize`Status`,
        headerTooltip: $localize`Status`
      }
    ];
  }
}
