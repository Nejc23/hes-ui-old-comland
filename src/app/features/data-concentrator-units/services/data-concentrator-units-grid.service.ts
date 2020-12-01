import { Injectable } from '@angular/core';
import { GridRequestParams, GridFilterParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { GridSelectionHeaderComponent } from '../components/grid-custom-components/grid-selection-header.component';
import { GridCellStatusComponent } from '../components/grid-custom-components/grid-cell-status.component';
import { GridCellReadStatusComponent } from '../components/grid-custom-components/grid-cell-read-status.component';
import { GridCellMetersComponent } from '../components/grid-custom-components/grid-cell-meters.component';
import { GridCellNameComponent } from '../components/grid-custom-components/grid-cell-name.component';
import { GridCellLastCommunicationComponent } from '../components/grid-custom-components/grid-cell-last-communication.component';
import { GridCellTagsComponent } from '../components/grid-custom-components/grid-cell-tags.component';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { GridPagination } from '../interfaces/grid-pagination.interface';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { GridSettingsSessionStoreTypeEnum } from 'src/app/core/utils/enums/grid-settings-session-store.enum';
import { GridCellIpComponent } from '../components/grid-custom-components/grid-cell-ip.component';
import { GridCellVendorComponent } from '../components/grid-custom-components/grid-cell-vendor.component';
import { GridCellTypeComponent } from '../components/grid-custom-components/grid-cell-type.component';
import { GridCellIdNumberComponent } from '../components/grid-custom-components/grid-cell-id-number.component';
import * as _ from 'lodash';
import { GridCellIconComponent } from '../components/grid-custom-components/grid-cell-icon.component';
import { GridCellJobStatusComponent } from '../components/grid-custom-components/grid-cell-job-status.component';
import { GridColumnShowHideService } from 'src/app/core/ag-grid-helpers/services/grid-column-show-hide.service';
import { GridCellActionsComponent } from '../components/grid-custom-components/grid-cell-actions.component';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsGridService {
  cookieNameForGridSettings = 'grdColDCU';
  cookieNameForGridSort = 'grdColDCUSort';
  sessionNameForGridState = 'grdStateDCU';

  gridName = 'grdDCU-requestIds';

  columns = [];
  paramsDCU = {} as GridRequestParams;

  constructor(
    private gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private gridColumnShowHideService: GridColumnShowHideService
  ) {}

  /**
   *  grid columns settings
   */
  public setGridDefaultColumns(sample: boolean) {
    return [
      {
        headerComponentFramework: GridSelectionHeaderComponent,
        pinned: true,
        minWidth: 40,
        maxWidth: 40,
        width: 40,
        suppressColumnsToolPanel: true,
        checkboxSelection: true,
        suppressMovable: true,
        lockPosition: true,
        colId: 'concentratorId',
        headerTooltip: $localize`Select/deselect all`
      },
      {
        field: 'nextRead',
        headerName: $localize``,
        suppressColumnsToolPanel: true,
        suppressMovable: true,
        //  lockPosition: true,
        //  pinned: 'left',
        //  lockPinned: true,
        sortable: false,
        filter: false,
        cellRenderer: 'gridCellIconComponent',
        headerTooltip: $localize``,
        minWidth: 50,
        maxWidth: 50,
        width: 50,
        suppressMenu: true,
        resizable: false
      },
      {
        field: 'status',
        headerName: $localize`Status`,
        //   pinned: true,
        sortable: false,
        filter: false,
        cellRenderer: 'gridCellStatusComponent',
        headerTooltip: $localize`Status`,
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'name',
        headerName: $localize`Name`,
        //   pinned: true,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellNameComponent',
        headerTooltip: $localize`Name`,
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'id',
        headerName: $localize`Serial number`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: $localize`Serial number`,
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'ip',
        headerName: $localize`IP`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIpComponent',
        headerTooltip: $localize`IP`,
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'type',
        headerName: $localize`Type`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellTypeComponent',
        headerTooltip: $localize`Type`,
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'vendor',
        headerName: $localize`Manufacturer`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellVendorComponent',
        headerTooltip: $localize`Manufacturer`,
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'meters',
        headerName: $localize`Meters`,
        //    pinned: true,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellMetersComponent',
        headerTooltip: $localize`Meters`,
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'readStatusTimeStamp',
        headerName: $localize`Read status`,
        //    pinned: true,
        sortable: true,
        filter: false,
        sort: 'desc',
        cellRenderer: 'gridCellReadStatusComponent',
        headerTooltip: $localize`Read status`,
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'lastCommunication',
        headerName: $localize`Last communication`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellLastCommunicationComponent',
        headerTooltip: $localize`Last communication`,
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'tags',
        headerName: $localize`Tags`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellTagsComponent',
        headerTooltip: $localize`Tags`,
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'jobStatus',
        headerName: $localize`Job status`,
        // pinned: 'right',
        // lockPinned: true,
        // lockPosition: true,
        suppressMovable: true,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellJobStatusComponent',
        headerTooltip: $localize`Job status`,
        resizable: false,
        suppressMenu: true
      },
      {
        pinned: 'right',
        field: 'id',
        width: 110,
        minWidth: 110,
        maxWidth: 110,
        suppressMenu: true,
        editable: false,
        suppressMovable: true,
        lockPinned: true,
        //  lockPosition: true,
        sortable: false,
        filter: false,
        cellRendererFramework: GridCellActionsComponent,
        headerName: '',
        cellClass: 'actions-button-cell',
        resizable: false
      }
    ];
  }

  // templates for grid
  public setFrameworkComponents() {
    return {
      gridCellStatusComponent: GridCellStatusComponent,
      gridCellReadStatusComponent: GridCellReadStatusComponent,
      gridCellMetersComponent: GridCellMetersComponent,
      gridCellNameComponent: GridCellNameComponent,
      gridCellLastCommunicationComponent: GridCellLastCommunicationComponent,
      gridCellTagsComponent: GridCellTagsComponent,
      gridCellIpComponent: GridCellIpComponent,
      gridCellVendorComponent: GridCellVendorComponent,
      gridCellTypeComponent: GridCellTypeComponent,
      gridCellIdNumberComponent: GridCellIdNumberComponent,
      gridCellIconComponent: GridCellIconComponent,
      gridCellJobStatusComponent: GridCellJobStatusComponent
    };
  }

  // grid settings
  public setGridOptions(component: any) {
    return {
      context: { forma: component.form, componentParent: component },
      rowModelType: configAgGrid.rowModelType,
      defaultColDef: {
        sortable: configAgGridDefCol.sortable,
        resizable: configAgGridDefCol.resizable,
        floatingFilterComponentParams: configAgGridDefCol.floatingFilterComponentParams,
        checkboxSelection: isFirstColumn,
        filter: true
      },
      suppressCellSelection: true,
      animateRows: configAgGrid.animateRows,
      debug: configAgGrid.debug,
      onColumnMoved: this.onColumnMoved,
      onColumnResized: this.onColumnMoved,
      onColumnPinned: this.onColumnMoved,
      onSortChanged: this.onSortChanged,
      onColumnVisible: this.onColumnVisible
    };
  }

  /*public setSideBar() {
    return {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
            suppressSideButtons: true,
            suppressColumnFilter: true,
            suppressColumnExpandAll: true
          }
        }
      ]
    };
  }*/

  public onColumnVisibility(params) {
    // TODO change to different store
    //  this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, params.columnApi.getColumnState());
  }

  private onColumnMoved = params => {
    // TODO change to different store
    // this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, params.columnApi.getColumnState());
  };

  private onSortChanged = params => {
    console.log('onSortChanged()', params.api.getSortModel());
    // TODO change to different store
    // this.gridSettingsCookieStoreService.setGridColumnsSortOrder(this.cookieNameForGridSort, params.api.getSortModel());
  };

  private onColumnVisible = params => {
    // send to subscribers the visibility of columns
    this.gridColumnShowHideService.sendColumnVisibilityChanged(params.columnApi);
  };

  public getCookieData() {
    return this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSettings);
  }
  public getCookieDataSortModel() {
    return this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSort);
  }

  public checkIfFilterModelAndCookieAreSame(sessionFilter: DcuLayout, requestModel: GridFilterParams) {
    if (
      JSON.stringify(sessionFilter.statusesFilter) === JSON.stringify(requestModel.statuses) &&
      JSON.stringify(sessionFilter.readStatusFilter) === JSON.stringify(requestModel.readStatus) &&
      JSON.stringify(sessionFilter.tagsFilter) === JSON.stringify(requestModel.tags) &&
      JSON.stringify(sessionFilter.typesFilter) === JSON.stringify(requestModel.types) &&
      JSON.stringify(sessionFilter.vendorsFilter) === JSON.stringify(requestModel.vendors)
    ) {
      return true;
    }
    return false;
  }

  public getCurrentRowIndex(pageSize: number): GridPagination {
    const index = this.getSessionSettingsPageIndex();
    const result: GridPagination = {
      currentPage: 0,
      startRow: 0,
      endRow: configAgGrid.paginationPageSize
    };

    if (index !== undefined && index !== null) {
      result.currentPage = index;
      // result.startRow = index * configAgGrid.paginationPageSize;
      // result.endRow = index * configAgGrid.paginationPageSize + configAgGrid.paginationPageSize;
      result.startRow = index * pageSize;
      result.endRow = index * pageSize + pageSize;
    }

    return result;
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

  // excluded rows
  public getSessionSettingsExcludedRows() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.excludedRows;
  }

  // clear excluded rows
  public setSessionSettingsClearExcludedRows() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.excludedRows = [];

    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.excludedRows,
      settings
    );
  }

  // set excluded rows
  public setSessionSettingsExcludedRows(excludedRow: any) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);

    if (!settings.excludedRows) {
      settings.excludedRows = [];
    }

    if (excludedRow.selected !== undefined && excludedRow.selected) {
      if (_.find(settings.excludedRows, x => x.id === excludedRow.data.id)) {
        settings.excludedRows = settings.excludedRows.filter(obj => obj.id !== excludedRow.data.id);
      }
    } else if (excludedRow.selected !== undefined && !excludedRow.selected) {
      if (!_.find(settings.excludedRows, x => x.id === excludedRow.data.id)) {
        settings.excludedRows.push(excludedRow.data);
      }
    } else if (excludedRow.length === 0) {
      settings.excludedRows = [];
    }

    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.excludedRows,
      settings
    );
  }

  // searched text
  public getSessionSettingsSearchedText() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.searchText;
  }

  // searched wildcard
  public getSessionSettingsSearchedWildcards() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.searchWildcards;
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

  // set searched wildcard
  public setSessionSettingsSearchedWildcards(searchWildcards: boolean) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.searchWildcards = searchWildcards;
    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.searchWildcards,
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

  saveDcOperationRequestId(requestId: string) {
    this.gridSettingsSessionStoreService.saveMyGridLinkRequestId(this.gridName, requestId);
  }

  removeDcOperationRequestId(requestId: string) {
    this.gridSettingsSessionStoreService.removeMyGridLinkRequestId(this.gridName, requestId);
  }

  getAllDcOperationRequestIds(): string[] {
    return this.gridSettingsSessionStoreService.getAllMyGridLinkRequestIds(this.gridName);
  }
}

// extra functions for grid
// set check box to first column
function isFirstColumn(params) {
  const displayedColumns = params.columnApi.getAllDisplayedColumns();
  const thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
}
