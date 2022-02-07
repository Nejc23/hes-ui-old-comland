import { Injectable } from '@angular/core';
import { GridFilterParams, GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { GridPagination } from '../interfaces/grid-pagination.interface';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { GridSettingsSessionStoreTypeEnum } from 'src/app/core/utils/enums/grid-settings-session-store.enum';
import * as _ from 'lodash';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { GridColumnShowHideService } from 'src/app/core/ag-grid-helpers/services/grid-column-show-hide.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsTypeGridService {
  cookieNameForGridSettings = 'grdColMUT';
  cookieNameForGridSort = 'grdColMUTSort';
  sessionNameForGridState = 'grdStateMUT';
  gridName = 'grdMUT-requestIds';
  gridNameBreakerState = 'grdMUT-breaker-state-requestIds';
  gridNameCiiState = 'grdMUT-cii-state-requestIds';
  gridNameRelaysState = 'grdMUT-relays-state-requestIds';

  columns = [];
  paramsDCU = {} as GridRequestParams;
  meterUnitsId: number;

  constructor(
    private gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private gridColumnShowHideService: GridColumnShowHideService,
    private translate: TranslateService
  ) {}

  public set meterUnitsTypeId(id: number) {
    this.meterUnitsId = id;
    this.cookieNameForGridSettings = this.cookieNameForGridSettings.includes('grdColMUT') ? this.cookieNameForGridSettings : 'grdColMUT';
    this.cookieNameForGridSort = this.cookieNameForGridSort.includes('grdColMUTSort') ? this.cookieNameForGridSort : 'grdColMUTSort';
    this.sessionNameForGridState = this.sessionNameForGridState.includes('grdStateMUT') ? this.sessionNameForGridState : 'grdStateMUT';
  }

  /**
   *  grid columns settings
   */
  // TODO CLEANUP
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
      animateRows: configAgGrid.animateRows,
      suppressCellSelection: true,
      debug: configAgGrid.debug,
      onColumnMoved: this.onColumnMoved,
      onColumnResized: this.onColumnMoved,
      onColumnPinned: this.onColumnMoved,
      onSortChanged: this.onSortChanged,
      onColumnVisible: this.onColumnVisible
    };
  }

  /*
  public setSideBar() {
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
    // this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, params.columnApi.getColumnState());
  }

  public getCookieData() {
    return this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSettings);
  }

  public getCookieDataSortModel() {
    return this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSort);
  }

  public checkIfFilterModelAndCookieAreSame(sessionFilter: MeterUnitsLayout, requestModel: GridFilterParams) {
    if (
      JSON.stringify(sessionFilter.statesFilter) === JSON.stringify(requestModel.states) &&
      JSON.stringify(sessionFilter.tagsFilter) === JSON.stringify(requestModel.tags) &&
      JSON.stringify(sessionFilter.vendorsFilter) === JSON.stringify(requestModel.vendors) &&
      JSON.stringify(sessionFilter.readStatusFilter) === JSON.stringify(requestModel.readStatus) &&
      JSON.stringify(sessionFilter.firmwareFilter) === JSON.stringify(requestModel.firmware) &&
      JSON.stringify(sessionFilter.breakerStateFilter) === JSON.stringify(requestModel.disconnectorState) &&
      JSON.stringify(sessionFilter.ciiStateFilter) === JSON.stringify(requestModel.ciiState) &&
      JSON.stringify(sessionFilter.showOnlyMeterUnitsWithMBusInfoFilter) === JSON.stringify(requestModel.showChildInfoMBus) &&
      JSON.stringify(sessionFilter.showMeterUnitsWithoutTemplateFilter) === JSON.stringify(requestModel.showWithoutTemplate) &&
      JSON.stringify(sessionFilter.showOptionFilter) === JSON.stringify(requestModel.showOptionFilter) &&
      JSON.stringify(sessionFilter.protocolFilter) === JSON.stringify(requestModel.protocol) &&
      JSON.stringify(sessionFilter.mediumFilter) === JSON.stringify(requestModel.medium)
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
      result.startRow = index * pageSize;
      result.endRow = index * pageSize + pageSize;
    }

    return result;
  }

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

  // get stored grid settings from session configuration
  // ---------------------------------------------------------

  // set selected rows
  public setSessionSettingsSelectedRows(selectedRow: any) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    if (selectedRow.selected !== undefined && selectedRow.selected) {
      if (!_.find(settings.selectedRows, (x) => x.deviceId === selectedRow.data.deviceId)) {
        settings.selectedRows.push(selectedRow.data);
      }
    } else if (selectedRow.selected !== undefined && !selectedRow.selected) {
      settings.selectedRows = settings.selectedRows.filter((obj) => obj.deviceId !== selectedRow.data.deviceId);
    } else if (selectedRow.length === 0) {
      settings.selectedRows = [];
    }

    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.selectedRows,
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
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    if (!settings.excludedRows) {
      settings.excludedRows = [];
    }

    if (excludedRow.selected !== undefined && excludedRow.selected) {
      if (_.find(settings.excludedRows, (x) => x.deviceId === excludedRow.data.deviceId)) {
        settings.excludedRows = settings.excludedRows.filter((obj) => obj.deviceId !== excludedRow.data.deviceId);
      }
    } else if (excludedRow.selected !== undefined && !excludedRow.selected) {
      if (!_.find(settings.excludedRows, (x) => x.deviceId === excludedRow.data.deviceId)) {
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
  public setSessionSettingsSearchedWildcards(searchedWildcards: boolean) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.searchWildcards = searchedWildcards;
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

  saveMyGridLinkRequestId(requestId: string) {
    this.gridSettingsSessionStoreService.saveMyGridLinkRequestId(this.gridName, requestId);
  }

  removeMyGridLinkRequestId(requestId: string) {
    this.gridSettingsSessionStoreService.removeMyGridLinkRequestId(this.gridName, requestId);
  }

  getAllMyGridLinkRequestIds(): string[] {
    return this.gridSettingsSessionStoreService.getAllMyGridLinkRequestIds(this.gridName);
  }

  saveMyGridLink_BreakerState_RequestId(requestId: string) {
    this.gridSettingsSessionStoreService.saveMyGridLinkRequestId(this.gridNameBreakerState, requestId);
  }

  saveMyGridLink_CiiState_RequestId(requestId: string) {
    this.gridSettingsSessionStoreService.saveMyGridLinkRequestId(this.gridNameCiiState, requestId);
  }

  saveMyGridLink_RelaysState_RequestId(requestId: string) {
    this.gridSettingsSessionStoreService.saveMyGridLinkRequestId(this.gridNameRelaysState, requestId);
  }

  removeMyGridLink_BreakerState_RequestId(requestId: string) {
    this.gridSettingsSessionStoreService.removeMyGridLinkRequestId(this.gridNameBreakerState, requestId);
  }

  removeMyGridLink_CiiState_RequestId(requestId: string) {
    this.gridSettingsSessionStoreService.removeMyGridLinkRequestId(this.gridNameCiiState, requestId);
  }

  removeMyGridLink_RelaysState_RequestId(requestId: string) {
    this.gridSettingsSessionStoreService.removeMyGridLinkRequestId(this.gridNameRelaysState, requestId);
  }

  getAllMyGridLink_BreakerState_RequestIds(): string[] {
    return this.gridSettingsSessionStoreService.getAllMyGridLinkRequestIds(this.gridNameBreakerState);
  }

  getAllMyGridLink_CiiState_RequestIds(): string[] {
    return this.gridSettingsSessionStoreService.getAllMyGridLinkRequestIds(this.gridNameCiiState);
  }

  getAllMyGridLink_RelaysState_RequestIds(): string[] {
    return this.gridSettingsSessionStoreService.getAllMyGridLinkRequestIds(this.gridNameRelaysState);
  }

  saveCryptoimportId(importId: string) {
    this.gridSettingsSessionStoreService.saveCryptoImportId(importId);
  }

  removeCryptoImportId(importId: string) {
    this.gridSettingsSessionStoreService.removeCryptoImportId(importId);
  }

  getAllCryptoImportIds(): string[] {
    return this.gridSettingsSessionStoreService.getAllCryptoImportIds();
  }

  private onColumnMoved = (params) => {
    // TODO change to different store
    // this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, params.columnApi.getColumnState());
  };

  private onSortChanged = (params) => {
    // TODO change to different store
    // this.gridSettingsCookieStoreService.setGridColumnsSortOrder(this.cookieNameForGridSort, params.api.getSortModel());
  };

  private onColumnVisible = (params) => {
    // send to subscribers the visibility of columns
    this.gridColumnShowHideService.sendColumnVisibilityChanged(params.columnApi);
  };
}

// extra functions for grid
// set check box to first column
function isFirstColumn(params) {
  const displayedColumns = params.columnApi.getAllDisplayedColumns();
  const thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
}
