import { Injectable } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as _ from 'lodash';
import { GridSelectionHeaderComponent } from 'src/app/shared/ag-grid/components/grid-selection-header.component';
import { configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { GridSettingsSessionStoreTypeEnum } from 'src/app/core/utils/enums/grid-settings-session-store.enum';
import { GridPagination } from 'src/app/shared/ag-grid/interfaces/grid-pagination.interface';
import { GridCellNameComponent } from 'src/app/shared/ag-grid/components/grid-cell-name.component';
import { GridCellIdNumberComponent } from 'src/app/shared/ag-grid/components/grid-cell-id-number.component';
import { GridCellIpComponent } from 'src/app/shared/ag-grid/components/grid-cell-ip.component';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsSelectGridService {
  cookieNameForGridSettings = 'grdColDCUSelect';
  cookieNameForGridSort = 'grdColDCUSortSelect';
  sessionNameForGridState = 'grdStateDCUSelect';

  columns = [];

  constructor(
    private i18n: I18n,
    private gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService
  ) {}

  setGridReadOnlyColumns() {
    return [
      {
        headerComponentFramework: GridSelectionHeaderComponent,
        pinned: false,
        minWidth: 45,
        maxWidth: 45,
        width: 45,
        suppressColumnsToolPanel: true,
        checkboxSelection: true,
        suppressMovable: true,
        lockPosition: true,
        colId: 'concentratorId',
        headerTooltip: this.i18n('Select/deselect all')
      },
      {
        field: 'name',
        headerName: this.i18n('Name'),
        pinned: false,
        sortable: true,
        filter: false,
        sort: 'asc',
        cellRenderer: 'gridCellNameComponent',
        headerTooltip: this.i18n('Name')
      },
      {
        field: 'id',
        headerName: this.i18n('ID'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: this.i18n('ID')
      },
      {
        field: 'ip',
        headerName: this.i18n('IP'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIpComponent',
        headerTooltip: this.i18n('IP')
      }
    ];
  }

  setGridDefaultColumns() {
    return [
      {
        headerComponentFramework: GridSelectionHeaderComponent,
        pinned: false,
        minWidth: 45,
        maxWidth: 45,
        width: 45,
        suppressColumnsToolPanel: true,
        checkboxSelection: true,
        suppressMovable: true,
        lockPosition: true,
        colId: 'concentratorId',
        headerTooltip: this.i18n('Select/deselect all')
      },
      {
        field: 'name',
        suppressMenu: true,
        sortable: true,
        suppressMovable: true,
        sort: 'asc',
        headerName: this.i18n('Name'),
        headerTooltip: this.i18n('Name')
      },
      {
        field: 'id',
        headerName: this.i18n('ID'),
        suppressMenu: true,
        suppressMovable: true,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: this.i18n('ID')
      },
      {
        field: 'ip',
        headerName: this.i18n('IP'),
        suppressMenu: true,
        suppressMovable: true,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIpComponent',
        headerTooltip: this.i18n('IP')
      }
    ];
  }

  public setFrameworkComponents() {
    return {
      gridCellNameComponent: GridCellNameComponent,
      gridCellIpComponent: GridCellIpComponent,
      gridCellIdNumberComponent: GridCellIdNumberComponent
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
      onColumnMoved: this.onColumnMoved,
      onColumnResized: this.onColumnMoved,
      onColumnPinned: this.onColumnMoved,
      onSortChanged: this.onSortChanged
    };
  }

  public getCurrentRowIndex(): GridPagination {
    const index = this.getSessionSettingsPageIndex();
    const result: GridPagination = {
      currentPage: 0,
      startRow: 0,
      endRow: configAgGrid.paginationPageSize
    };

    if (index !== undefined && index !== null) {
      result.currentPage = index;
      result.startRow = index * configAgGrid.paginationPageSize;
      result.endRow = index * configAgGrid.paginationPageSize + configAgGrid.paginationPageSize;
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

  // get stored grid settings from session configuration
  // ---------------------------------------------------------
  // is selected all
  public getSessionSettingsSelectedAll() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.isSelectedAll;
  }

  // set is selected all
  public setSessionSettingsSelectedAll(selectAll: boolean) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.isSelectedAll = selectAll;
    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.isSelectedAll,
      settings
    );
  }

  // selected rows
  public getSessionSettingsSelectedRows() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.selectedRows;
  }

  // set selected rows
  public setSessionSettingsSelectedRows(selectedRow: any) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    if (selectedRow.selected !== undefined && selectedRow.selected) {
      if (!_.find(settings.selectedRows, x => x.id === selectedRow.data.id)) {
        settings.selectedRows.push(selectedRow.data);
      }
    } else if (selectedRow.selected !== undefined && !selectedRow.selected) {
      settings.selectedRows = settings.selectedRows.filter(obj => obj.id !== selectedRow.data.id);
    } else if (selectedRow.length === 0) {
      settings.selectedRows = [];
    }

    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.selectedRows,
      settings
    );
  }

  public setSessionSettingsSelectedRowsById(ids: string[]) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    if (ids !== undefined && ids != null && ids.length > 0) {
      settings.selectedRows = ids;
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

  private onColumnMoved = params => {
    // TODO change to different store
    // this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, params.columnApi.getColumnState());
  };

  private onSortChanged = params => {
    console.log(params.api.getSortModel());
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
