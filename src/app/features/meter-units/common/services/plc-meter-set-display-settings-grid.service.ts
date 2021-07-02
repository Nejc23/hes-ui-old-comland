import { Injectable } from '@angular/core';
import { GridSelectionHeaderComponent } from 'src/app/features/data-concentrator-units/components/grid-custom-components/grid-selection-header.component';
import { TranslateService } from '@ngx-translate/core';
import { IntlService } from '@progress/kendo-angular-intl';

@Injectable({
  providedIn: 'root'
})
export class PlcMeterSetDisplaySettingsGridService {
  constructor(private translate: TranslateService) {}

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
        headerName: this.translate.instant('PLC-METER.AVAILABLE-REGISTERS'),
        headerTooltip: this.translate.instant('PLC-METER.AVAILABLE-REGISTERS'),
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
        headerName: this.translate.instant('PLC-METER.SELECTED-REGISTERS'),
        headerTooltip: this.translate.instant('PLC-METER.SELECTED-REGISTERS'),
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
