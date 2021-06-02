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
      //   headerTooltip:  `Select/deselect all`
      // },
      {
        field: 'name',
        suppressMenu: true,
        // sortable: true,
        headerName: `Available reigsters`,
        headerTooltip: `Available registers`,
        dndSource: true,
        sortable: true
      }
      // {
      //   field: 'obisCode',
      //   suppressMenu: true,
      //   sortable: true,
      //   headerName:  `Obis code`,
      //   headerTooltip:  `Obis code`
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
      //   headerTooltip:  `Select/deselect all`
      // },
      {
        field: 'name',
        suppressMenu: true,
        // sortable: true,
        headerName: `Selected registers *`,
        headerTooltip: `Selected registers`,
        dndSource: true
      }
      // {
      //   field: 'obisCode',
      //   suppressMenu: true,
      //   sortable: true,
      //   headerName:  `Obis code`,
      //   headerTooltip:  `Obis code`
      // }
    ];
  }
}
