import { DcuForJobGridCellTypeComponent } from './../components/grid-custom-components/grid-cell-type.component';
import { Injectable } from '@angular/core';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { GridSettingsSessionStoreTypeEnum } from 'src/app/core/utils/enums/grid-settings-session-store.enum';
import * as _ from 'lodash';
import { GridRequestParams, GridFilterParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { GridPagination } from 'src/app/shared/ag-grid/interfaces/grid-pagination.interface';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { DcuForJobGridCellNameComponent } from '../components/grid-custom-components/grid-cell-name.component';
import { DcuForJobGridCellVendorComponent } from '../components/grid-custom-components/grid-cell-vendor.component';
import { DcuForJobGridCellIdNumberComponent } from '../components/grid-custom-components/grid-cell-id-number.component';
import { DcuForJobGridSelectionHeaderComponent } from '../components/grid-custom-components/grid-selection-header.component';

@Injectable({
  providedIn: 'root'
})
export class DcuForJobGridService {
  cookieNameForGridSettings = 'grdColDCU-allId-';
  cookieNameForGridSort = 'grdColDCUSort-allId-';
  sessionNameForGridState = 'grdStateDCU-allId-';
  gridName = 'grdDCU-requestAllIds';
  gridNameBreakerState = 'grdDCU-breaker-state-requestAllIds';

  columns = [];
  paramsDCU = {} as GridRequestParams;
  dcuId: number;

  constructor(
    private gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService
  ) {}

  public set dcuForJobId(id: number) {
    this.dcuId = id;
    this.cookieNameForGridSettings = this.cookieNameForGridSettings.includes(this.cookieNameForGridSettings + id)
      ? this.cookieNameForGridSettings
      : this.cookieNameForGridSettings + id;
    this.cookieNameForGridSort = this.cookieNameForGridSort.includes(this.cookieNameForGridSort + id)
      ? this.cookieNameForGridSort
      : this.cookieNameForGridSort + id;
    this.sessionNameForGridState = this.sessionNameForGridState.includes(this.sessionNameForGridState + id)
      ? this.sessionNameForGridState
      : this.sessionNameForGridState + id;
  }

  public setFrameworkComponents() {
    return {
      gridCellNameComponent: DcuForJobGridCellNameComponent,
      gridCellVendorComponent: DcuForJobGridCellVendorComponent,
      gridCellIdNumberComponent: DcuForJobGridCellIdNumberComponent,
      gridCellTypeComponent: DcuForJobGridCellTypeComponent

      // gridCellMeterIdComponent: GridCellMeterIdComponent,
      // gridCellTagsComponent: GridCellTagsComponent,
      //

      // gidCellParentComponent: GridCellParentComponent,
      // gridCellModuleIdComponent: GridCellModuleIdComponent,
      // gridCellFirmwareComponent: GridCellFirmwareComponent,

      // gridCellTimeOfUseIdComponent: GridCellTimeOfUseIdComponent,
      // gridCellBreakerStateComponent: GridCellBreakerStateComponent,
      // gridCellInfoOfChildComponent: GridCellInfoOfChildComponent,
      // gridCellIconComponent: GridCellIconComponent,
      // gridCellJobStatusComponent: GridCellJobStatusComponent
    };
  }

  /**
   *  grid columns settings
   */
  public setGridDefaultColumns(sample: boolean) {
    return [
      {
        headerComponentFramework: DcuForJobGridSelectionHeaderComponent,
        pinned: true,
        minWidth: 45,
        maxWidth: 45,
        width: 45,
        suppressColumnsToolPanel: true,
        checkboxSelection: true,
        suppressMovable: true,
        lockPosition: true,
        colId: 'id',
        headerTooltip: $localize`Select/deselect all`
      },
      {
        field: 'name',
        headerName: $localize`Name`,
        pinned: true,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellNameComponent',
        headerTooltip: $localize`Name`
      },
      {
        field: 'id',
        headerName: $localize`ID`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: $localize`ID`
      },
      {
        field: 'type',
        headerName: $localize`Type`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellTypeComponent',
        headerTooltip: $localize`Type`
      },
      {
        field: 'vendor',
        headerName: $localize`Vendor`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellVendorComponent',
        headerTooltip: $localize`Vendor`
      }
    ];
  }

  // get stored grid settings from session configuration
  // ---------------------------------------------------------
  // is selected all
  public getSessionSettingsSelectedAll() {
    //  console.log(this.sessionNameForGridState);
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.isSelectedAll;
  }

  // searched text
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

  // get excluded rows
  public getSessionSettingsExcludedRows() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.excludedRows;
  }

  // cleer excluded rows
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
    // console.log('excluded row', excludedRow);

    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    if (!settings.excludedRows) {
      settings.excludedRows = [];
    }

    if (excludedRow.selected !== undefined && excludedRow.selected) {
      if (_.find(settings.excludedRows, x => x.concentratorId === excludedRow.data.concentratorId)) {
        settings.excludedRows = settings.excludedRows.filter(obj => obj.concentratorId !== excludedRow.data.concentratorId);
      }
    } else if (excludedRow.selected !== undefined && !excludedRow.selected) {
      if (!_.find(settings.excludedRows, x => x.concentratorId === excludedRow.data.concentratorId)) {
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

  // selected rows
  public getSessionSettingsSelectedRows() {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    return settings.selectedRows;
  }

  // set selected rows
  public setSessionSettingsSelectedRows(selectedRow: any) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    if (selectedRow.selected !== undefined && selectedRow.selected) {
      if (!_.find(settings.selectedRows, x => x.concentratorId === selectedRow.data.concentratorId)) {
        settings.selectedRows.push(selectedRow.data);
      }
    } else if (selectedRow.selected !== undefined && !selectedRow.selected) {
      settings.selectedRows = settings.selectedRows.filter(obj => obj.concentratorId !== selectedRow.data.concentratorId);
    } else if (selectedRow.length === 0) {
      settings.selectedRows = [];
    }

    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.selectedRows,
      settings
    );
  }

  public checkIfFilterModelAndCookieAreSame(sessionFilter: DcuLayout, requestModel: GridFilterParams) {
    if (
      JSON.stringify(sessionFilter.statusesFilter) === JSON.stringify(requestModel.statuses) &&
      JSON.stringify(sessionFilter.readStatusFilter) === JSON.stringify(requestModel.readStatus) &&
      JSON.stringify(sessionFilter.tagsFilter) === JSON.stringify(requestModel.tags) &&
      JSON.stringify(sessionFilter.typesFilter) === JSON.stringify(requestModel.types) &&
      JSON.stringify(sessionFilter.vendorFilter) === JSON.stringify(requestModel.vendor)
    ) {
      return true;
    }
    return false;
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

  public onColumnVisibility(params) {
    // TODO change to different store
    // this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, params.columnApi.getColumnState());
  }

  private onColumnMoved = params => {
    // TODO change to different store
    // this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, params.columnApi.getColumnState());
  };

  private onSortChanged = params => {
    // TODO change to different store
    // this.gridSettingsCookieStoreService.setGridColumnsSortOrder(this.cookieNameForGridSort, params.api.getSortModel());
  };

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

  // saveMyGridLinkRequestId(requestId: string) {
  //   this.gridSettingsSessionStoreService.saveMyGridLinkRequestId(this.gridName, requestId);
  // }

  // removeMyGridLinkRequestId(requestId: string) {
  //   this.gridSettingsSessionStoreService.removeMyGridLinkRequestId(this.gridName, requestId);
  // }

  // getAllMyGridLinkRequestIds(): string[] {
  //   return this.gridSettingsSessionStoreService.getAllMyGridLinkRequestIds(this.gridName);
  // }

  public getCookieData() {
    return this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSettings);
  }
  public getCookieDataSortModel() {
    return this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSort);
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
        filter: true
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

  removeMyGridLink_BreakerState_RequestId(requestId: string) {
    this.gridSettingsSessionStoreService.removeMyGridLinkRequestId(this.gridNameBreakerState, requestId);
  }

  getAllMyGridLink_BreakerState_RequestIds(): string[] {
    return this.gridSettingsSessionStoreService.getAllMyGridLinkRequestIds(this.gridNameBreakerState);
  }
}

// extra functions for grid
// set check box to first column
function isFirstColumn(params) {
  const displayedColumns = params.columnApi.getAllDisplayedColumns();
  const thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
}
