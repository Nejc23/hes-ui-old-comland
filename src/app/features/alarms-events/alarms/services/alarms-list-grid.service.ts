import { GridCellSourceComponent } from './../components/grid/grid-cell-source.component';
import { GridCellSeverityComponent } from './../components/grid/grid-cell-severity.component';
import { Injectable } from '@angular/core';
import { GridSettingsSessionStoreTypeEnum } from 'src/app/core/utils/enums/grid-settings-session-store.enum';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { GridPagination } from 'src/app/shared/ag-grid/interfaces/grid-pagination.interface';
import { configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { GridCellTimestampComponent } from '../components/grid/grid-cell-timestamp.component';
import { GridCellProtocolComponent } from 'src/app/features/meter-units/types/components/grid-custom-components/grid-cell-protocol.component';
import { GridCellManufacturerComponent } from '../components/grid/grid-cell-manufacturer.component';
import { GridCellSourceTypeComponent } from '../components/grid/grid-cell-source-type.component';

@Injectable({
  providedIn: 'root'
})
export class AlarmsListGridService {
  sessionNameForGridState = 'grdAlarms-list';

  constructor(private gridSettingsSessionStoreService: GridSettingsSessionStoreService) {}

  public setFrameworkComponents() {
    return {
      gridCellTimestampComponent: GridCellTimestampComponent,
      gridCellSeverityComponent: GridCellSeverityComponent,
      gridCellSourceComponent: GridCellSourceComponent,
      gridCellProtocolComponent: GridCellProtocolComponent,
      gridCellManufacturerComponent: GridCellManufacturerComponent,
      gridCellSourceTypeComponent: GridCellSourceTypeComponent
    };
  }

  setGridDefaultColumns() {
    return [
      {
        field: 'alarmTimestamp',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        cellRenderer: 'gridCellTimestampComponent',
        headerName: $localize`Timestamp`,
        headerTooltip: $localize`Timestamp`,
        resizable: false
      },
      {
        field: 'eventId',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        headerName: $localize`Id`,
        headerTooltip: $localize`Id`,
        resizable: false
      },
      {
        field: 'severity',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        cellRenderer: 'gridCellSeverityComponent',
        headerName: $localize`Severity`,
        headerTooltip: $localize`Severity`,
        resizable: false
      },
      {
        field: 'sourceType',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        cellRenderer: 'gridCellSourceComponent',
        headerName: $localize`Source type`,
        headerTooltip: $localize`Source type`,
        resizable: false
      },
      {
        field: 'protocol',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        cellRenderer: 'gridCellProtocolComponent',
        headerName: $localize`Protocol`,
        headerTooltip: $localize`Protocol`,
        resizable: false
      },
      {
        field: 'manufacturer',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        cellRenderer: 'gridCellManufacturerComponent',
        headerName: $localize`Manufacturer`,
        headerTooltip: $localize`Manufacturer`,
        resizable: false
      },
      {
        field: 'sourceId',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        cellRenderer: 'gridCellSourceComponent',
        headerName: $localize`Source`,
        headerTooltip: $localize`Source`,
        resizable: false
      },
      {
        field: 'description',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        headerName: $localize`Description`,
        headerTooltip: $localize`Description`,
        resizable: false
      }
    ];
  }

  /**
   * Get grid pagination for current row
   * @returns GridPagination
   */
  public getCurrentRowIndex(pageSize: number): GridPagination {
    const index = this.getSessionSettingsPageIndex();
    const result: GridPagination = {
      currentPage: 0,
      startRow: 0,
      endRow: pageSize
    };

    if (index !== undefined && index !== null) {
      result.currentPage = index;
      result.startRow = index * pageSize;
      result.endRow = index * pageSize + pageSize;
    }

    return result;
  }

  /**
   * Get page index
   */
  public getSessionSettingsPageIndex() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.pageIndex;
  }

  /**
   * Set page index
   * @param index page index
   */
  public setSessionSettingsPageIndex(index: number) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.pageIndex = index;
    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.pageIndex,
      settings
    );
  }

  /**
   * Set grid settings
   */
  public setGridOptions() {
    return {
      rowModelType: configAgGrid.rowModelType,
      defaultColDef: {
        sortable: configAgGridDefCol.sortable,
        resizable: configAgGridDefCol.resizable,
        floatingFilterComponentParams: configAgGridDefCol.floatingFilterComponentParams,
        checkboxSelection: false,
        filter: true
      },
      animateRows: configAgGrid.animateRows,
      debug: configAgGrid.debug
    };
  }
}
