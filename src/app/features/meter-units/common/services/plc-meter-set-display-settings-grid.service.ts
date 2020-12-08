import { Injectable } from '@angular/core';
import { GridSelectionHeaderComponent } from 'src/app/features/data-concentrator-units/components/grid-custom-components/grid-selection-header.component';

@Injectable({
  providedIn: 'root'
})
export class PlcMeterSetDisplaySettingsGridService {
  setGridDefaultColumnsLeft() {
    return [
      // {
      //   headerComponentFramework: GridSelectionHeaderComponent,
      //   minWidth: 45,
      //   maxWidth: 45,
      //   width: 45,
      //   suppressMenu: true,
      //   checkboxSelection: true,
      //   suppressMovable: true,
      //   lockPosition: true,
      //   colId: 'displayRegisterDefinitionId',
      //   headerTooltip: $localize`Select/deselect all`
      // },
      {
        field: 'name',
        suppressMenu: true,
        // sortable: true,
        headerName: $localize`Available reigsters`,
        headerTooltip: $localize`Available registers`,
        dndSource: true,
        sortable: true
      }
      // {
      //   field: 'obisCode',
      //   suppressMenu: true,
      //   sortable: true,
      //   headerName: $localize`Obis code`,
      //   headerTooltip: $localize`Obis code`
      // }
    ];
  }

  setGridDefaultColumnsRight() {
    return [
      // {
      //   headerComponentFramework: GridSelectionHeaderComponent,
      //   minWidth: 45,
      //   maxWidth: 45,
      //   width: 45,
      //   suppressMenu: true,
      //   checkboxSelection: true,
      //   suppressMovable: true,
      //   lockPosition: true,
      //   colId: 'displayRegisterDefinitionId',
      //   headerTooltip: $localize`Select/deselect all`
      // },
      {
        field: 'name',
        suppressMenu: true,
        // sortable: true,
        headerName: $localize`Selected registers *`,
        headerTooltip: $localize`Selected registers`,
        dndSource: true
      }
      // {
      //   field: 'obisCode',
      //   suppressMenu: true,
      //   sortable: true,
      //   headerName: $localize`Obis code`,
      //   headerTooltip: $localize`Obis code`
      // }
    ];
  }
}
