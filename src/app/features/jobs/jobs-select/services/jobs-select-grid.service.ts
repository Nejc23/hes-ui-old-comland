import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { GridSettingsSessionStoreTypeEnum } from 'src/app/core/utils/enums/grid-settings-session-store.enum';
import { GridPagination } from 'src/app/shared/ag-grid/interfaces/grid-pagination.interface';
import { GridCellNameComponent } from 'src/app/shared/ag-grid/components/grid-cell-name.component';
import { GridCellIdNumberComponent } from 'src/app/shared/ag-grid/components/grid-cell-id-number.component';
import { GridCellIpComponent } from 'src/app/shared/ag-grid/components/grid-cell-ip.component';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { GridSelectionHeaderScrollableComponent } from 'src/app/shared/ag-grid/components/grid-selection-header-scrollable.component';
import { GridCellActiveReadOnlyComponent } from '../components/grid-custom-components/grid-cell-active-read-only.component';
import { GridCellNextRunNoEventComponent } from 'src/app/features/configuration/auto-template/components/grid-custom-components/grid-cell-next-run-no-event.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class JobsSelectGridService {
  cookieNameForGridSettings = 'grdColJobsSelect';
  cookieNameForGridSort = 'grdColJobsSortSelect';
  sessionNameForGridState = 'grdStateJobsSelect';

  columns = [];

  constructor(
    private gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private translate: TranslateService
  ) {}

  setGridDefaultColumns() {
    return [
      {
        headerComponentFramework: GridSelectionHeaderScrollableComponent,
        pinned: false,
        minWidth: 45,
        maxWidth: 45,
        width: 45,
        suppressColumnsToolPanel: true,
        checkboxSelection: true,
        suppressMovable: true,
        lockPosition: true,
        colId: 'concentratorId',
        headerTooltip: this.translate.instant('GRID.SELECT-DESELECT-ALL')
      },
      {
        field: 'description',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        headerName: this.translate.instant('GRID.DESCRIPTION'),
        headerTooltip: this.translate.instant('GRID.DESCRIPTION'),
        resizable: false
      },
      {
        field: 'type',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        headerName: this.translate.instant('GRID.JOB-TYPE'),
        headerTooltip: this.translate.instant('GRID.JOB-TYPE'),
        resizable: false
      },
      {
        field: 'nextRun',
        suppressMenu: true,
        sortable: false,
        suppressMovable: true,
        cellRenderer: 'gridCellNextRunComponent',
        headerName: this.translate.instant('GRID.NEXT-RUN'),
        headerTooltip: this.translate.instant('GRID.NEXT-RUN'),
        resizable: false
      },
      {
        width: 100,
        minWidth: 100,
        maxWidth: 100,
        suppressMenu: true,
        suppressMovable: true,
        field: 'active',
        cellRenderer: 'gridCellActiveReadOnlyComponent',
        headerName: this.translate.instant('GRID.ACTIVE'),
        headerTooltip: this.translate.instant('GRID.ACTIVE'),
        resizable: false
      }
    ];
  }

  public setFrameworkComponents() {
    return {
      gridCellNameComponent: GridCellNameComponent,
      gridCellIpComponent: GridCellIpComponent,
      gridCellIdNumberComponent: GridCellIdNumberComponent,
      gridCellActiveReadOnlyComponent: GridCellActiveReadOnlyComponent,
      gridCellNextRunComponent: GridCellNextRunNoEventComponent
    };
  }

  // grid settings
  public setGridOptions() {
    return {
      rowModelType: configAgGrid.rowModelType,
      defaultColDef: {
        sortable: configAgGridDefCol.sortable,
        resizable: configAgGridDefCol.resizable,
        floatingFilterComponentParams: configAgGridDefCol.floatingFilterComponentParams,
        checkboxSelection: isFirstColumn,
        filter: false,
        suppressContextMenu: true
      },
      animateRows: configAgGrid.animateRows,
      debug: configAgGrid.debug,
      suppressCellSelection: true,
      onColumnMoved: this.onColumnMoved,
      onColumnResized: this.onColumnMoved,
      onColumnPinned: this.onColumnMoved,
      onSortChanged: this.onSortChanged
    };
  }

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

  public getSessionSettingsSearchedText() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.searchText;
  }

  // set searched text
  public setSessionSettingsSearchedText(text: string) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.searchText = text;
    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.searchString,
      settings
    );
  }

  // // get stored grid settings from session configuration
  // // ---------------------------------------------------------
  // // is selected all
  // public getSessionSettingsSelectedAll() {
  //   const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
  //   return settings.isSelectedAll;
  // }

  // // set is selected all
  // public setSessionSettingsSelectedAll(selectAll: boolean) {
  //   const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
  //   settings.isSelectedAll = selectAll;
  //   this.gridSettingsSessionStoreService.setGridSettings(
  //     this.sessionNameForGridState,
  //     GridSettingsSessionStoreTypeEnum.isSelectedAll,
  //     settings
  //   );
  // }

  // selected rows
  public getSessionSettingsSelectedRows() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.selectedRows;
  }

  // set selected rows
  public setSessionSettingsSelectedRows(id: string) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    if (!_.find(settings.selectedRows, (x) => x === id)) {
      settings.selectedRows.push(id);

      this.gridSettingsSessionStoreService.setGridSettings(
        this.sessionNameForGridState,
        GridSettingsSessionStoreTypeEnum.selectedRows,
        settings
      );
    }
  }

  // set selected rows
  public clearSessionSettingsSelectedRows() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);

    settings.selectedRows = [];
    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.selectedRows,
      settings
    );
  }

  // remove selected rows
  public setSessionSettingsRemoveSelectedRow(id: string) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    if (_.find(settings.selectedRows, (x) => x === id)) {
      settings.selectedRows = settings.selectedRows.filter((x) => x !== id);

      this.gridSettingsSessionStoreService.setGridSettings(
        this.sessionNameForGridState,
        GridSettingsSessionStoreTypeEnum.selectedRows,
        settings
      );
    }
  }

  public setSessionSettingsSelectedRowsById(ids: string[]) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    if (ids !== undefined && ids != null && ids.length > 0) {
      settings.selectedRows = ids;
    } else {
      settings.selectedRows = [];
    }

    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.selectedRows,
      settings
    );
  }

  // page index
  public getSessionSettingsPageIndex() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.pageIndex;
  }

  // set page index
  public setSessionSettingsPageIndex(index: number) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.pageIndex = index;
    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.pageIndex,
      settings
    );
  }

  public getCookieData() {
    return this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSettings);
  }
  public getCookieDataSortModel() {
    return this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSort);
  }

  public onColumnVisibility(params) {
    // TODO change to different store
    //  this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, params.columnApi.getColumnState());
  }

  private onColumnMoved = (params) => {
    // TODO change to different store
    // this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, params.columnApi.getColumnState());
  };

  private onSortChanged = (params) => {
    // TODO change to different store
    // this.gridSettingsCookieStoreService.setGridColumnsSortOrder(this.cookieNameForGridSort, params.api.getSortModel());
  };
}

// extra functions for grid
// set check box to first column
function isFirstColumn(params) {
  const displayedColumns = params.columnApi.getAllDisplayedColumns();
  const thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
}
