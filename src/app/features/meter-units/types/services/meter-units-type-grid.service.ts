import { GridCellDetailLinkComponent } from '../components/grid-custom-components/grid-cell-detail-link.component';
import { Injectable } from '@angular/core';
import { GridRequestParams, GridFilterParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { GridSelectionHeaderComponent } from '../components/grid-custom-components/grid-selection-header.component';
import { GridCellStatusComponent } from '../components/grid-custom-components/grid-cell-status.component';
import { GridCellReadStatusComponent } from '../components/grid-custom-components/grid-cell-read-status.component';
import { GridCellTagsComponent } from '../components/grid-custom-components/grid-cell-tags.component';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { GridPagination } from '../interfaces/grid-pagination.interface';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { GridSettingsSessionStoreTypeEnum } from 'src/app/core/utils/enums/grid-settings-session-store.enum';
import { GridCellVendorComponent } from '../components/grid-custom-components/grid-cell-vendor.component';
import { GridCellIdNumberComponent } from '../components/grid-custom-components/grid-cell-id-number.component';
import * as _ from 'lodash';
import { GridCellParentComponent } from '../components/grid-custom-components/grid-cell-parent.component';
import { GridCellModuleIdComponent } from '../components/grid-custom-components/grid-cell-module-id.component';
import { GridCellMeterIdComponent } from '../components/grid-custom-components/grid-cell-meter-id.component';
import { GridCellFirmwareComponent } from '../components/grid-custom-components/grid-cell-firmware.component';
import { GridCellTimeOfUseIdComponent } from '../components/grid-custom-components/grid-cell-time-of-use-id.component';
import { GridCellBreakerStateComponent } from '../components/grid-custom-components/grid-cell-breaker-state.component';
import { GridCellInfoOfChildComponent } from '../components/grid-custom-components/grid-cell-info-of-child.component';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { GridCellIconComponent } from '../components/grid-custom-components/grid-cell-icon.component';
import { GridCellJobStatusComponent } from '../components/grid-custom-components/grid-cell-job-status.component';
import { GridCellActionsComponent } from '../components/grid-custom-components/grid-cell-actions.component';
import { GridColumnShowHideService } from 'src/app/core/ag-grid-helpers/services/grid-column-show-hide.service';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsTypeGridService {
  cookieNameForGridSettings = 'grdColMUT-typeId-';
  cookieNameForGridSort = 'grdColMUTSort-typeId-';
  sessionNameForGridState = 'grdStateMUT-typeId-';
  gridName = 'grdMUT-requestIds';
  gridNameBreakerState = 'grdMUT-breaker-state-requestIds';

  columns = [];
  paramsDCU = {} as GridRequestParams;
  meterUnitsId: number;

  constructor(
    private gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private gridColumnShowHideService: GridColumnShowHideService
  ) {}

  public set meterUnitsTypeId(id: number) {
    this.meterUnitsId = id;
    this.cookieNameForGridSettings = this.cookieNameForGridSettings.includes('grdColMUT-typeId-' + id)
      ? this.cookieNameForGridSettings
      : 'grdColMUT-typeId-' + id;
    this.cookieNameForGridSort = this.cookieNameForGridSort.includes('grdColMUTSort-typeId-' + id)
      ? this.cookieNameForGridSort
      : 'grdColMUTSort-typeId-' + id;
    this.sessionNameForGridState = this.sessionNameForGridState.includes('grdStateMUT-typeId-' + id)
      ? this.sessionNameForGridState
      : 'grdStateMUT-typeId-' + id;
  }

  /**
   *  grid columns settings
   */
  public setGridDefaultColumns(sample: boolean) {
    return [
      {
        headerComponentFramework: GridSelectionHeaderComponent,
        pinned: true,
        minWidth: 45,
        maxWidth: 45,
        width: 45,
        suppressColumnsToolPanel: true,
        checkboxSelection: true,
        suppressMovable: true,
        lockPosition: true,
        colId: 'deviceId',
        headerTooltip: $localize `Select/deselect all`
      },
      {
        field: 'nextRead',
        headerName: $localize ``,
        suppressColumnsToolPanel: true,
        suppressMovable: true,
        lockPosition: true,
        // pinned: 'left',
        // lockPinned: true,
        sortable: false,
        filter: false,
        cellRenderer: 'gridCellIconComponent',
        headerTooltip:$localize ``,
        minWidth: 100,
        maxWidth: 100,
        width: 100
      },
      {
        field: 'status',
        headerName: $localize `Status`,
        //   pinned: true,
        sortable: false,
        filter: false,
        cellRenderer: 'gridCellStatusComponent',
        headerTooltip: $localize `Status`
      },
      {
        field: 'name',
        headerName: $localize `Name`,
        //    pinned: true,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellDetailLinkComponent',
        headerTooltip:$localize `Name`
      },
      {
        field: 'moduleId',
        headerName: $localize `Module Id`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellModuleIdComponent',
        headerTooltip: $localize `Module Id`
      },
      {
        field: 'parent',
        headerName: $localize `Parent`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gidCellParentComponent',
        headerTooltip: $localize `Parent`
      },
      {
        field: 'parametrisationId',
        headerName: $localize `Parametrisation Id`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: $localize `Parametrisation Id`
      },
      {
        field: 'timeOfUseId',
        headerName: $localize `Time of use Id`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellTimeOfUseIdComponent',
        headerTooltip: $localize `Time of use Id`
      },
      {
        field: 'vendor',
        headerName: $localize `Vendor`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellVendorComponent',
        headerTooltip: $localize `Vendor`
      },
      {
        field: 'firmware',
        headerName: $localize `Firmware`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellFirmwareComponent',
        headerTooltip: $localize `Firmware`
      },
      {
        field: 'id1',
        headerName: $localize `ID1`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: $localize `ID1`,
        hide: true
      },
      {
        field: 'id2',
        headerName: $localize `ID2`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: $localize `ID2`,
        hide: true
      },
      {
        field: 'id3',
        headerName: $localize `ID3`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: $localize `ID3`,
        hide: true
      },
      {
        field: 'id4',
        headerName: $localize `ID4`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: $localize `ID4`,
        hide: true
      },
      {
        field: 'id5',
        headerName: $localize `ID5`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellDetailLinkComponent',
        headerTooltip: $localize `ID5`,
        hide: true
      },
      {
        field: 'id6',
        headerName: $localize `ID6`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: $localize `ID6`,
        hide: true
      },
      {
        field: 'configurationId',
        headerName: $localize `Configuration Id`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: $localize `Configuration Id`,
        hide: true
      },
      {
        field: 'logicalDeviceName',
        headerName: $localize `Logical device name`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellNameComponent',
        headerTooltip: $localize `Logical device name`,
        hide: true
      },
      // {
      //   field: 'childInfo',
      //   headerName: $localize `Information of child (MBus)`,
      //   pinned: false,
      //   sortable: true,
      //   filter: false,
      //   cellRenderer: 'gridCellInfoOfChildComponent',
      //   headerTooltip: $localize `Information of child (MBus)`
      // },
      {
        field: 'disconnectorState',
        headerName: $localize `Breaker State`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellBreakerStateComponent',
        headerTooltip: $localize `Breaker State`
      },
      {
        field: 'tags',
        headerName: $localize `Tags`,
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellTagsComponent',
        headerTooltip: $localize `Tags`,
        hide: true
      },
      {
        field: 'readStatusTimeStamp',
        headerName: $localize `Read status`,
        //   pinned: true,
        sortable: true,
        filter: false,
        sort: 'desc',
        cellRenderer: 'gridCellReadStatusComponent',
        headerTooltip: $localize `Read status`
      },
      {
        field: 'jobStatus',
        headerName: $localize `Job status`,
        //    pinned: 'right',
        //    lockPinned: true,
        //   lockPosition: true,
        //     suppressMovable: true,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellJobStatusComponent',
        headerTooltip: $localize `Job status`,
        resizable: false
      },
      {
        field: 'id',
        pinned: 'right',
        width: 150,
        minWidth: 150,
        maxWidth: 150,
        suppressMenu: true,
        editable: false,
        suppressMovable: true,
        lockPinned: true,
        // lockPosition: true,
        sortable: false,
        filter: false,
        cellRendererFramework: GridCellActionsComponent,
        headerName: '',
        cellClass: 'actions-button-cell'
      }
    ];
  }

  // templates for grid
  public setFrameworkComponents() {
    return {
      gridCellStatusComponent: GridCellStatusComponent,
      gridCellReadStatusComponent: GridCellReadStatusComponent,
      gridCellMeterIdComponent: GridCellMeterIdComponent,
      gridCellTagsComponent: GridCellTagsComponent,
      gridCellVendorComponent: GridCellVendorComponent,
      gidCellParentComponent: GridCellParentComponent,
      gridCellModuleIdComponent: GridCellModuleIdComponent,
      gridCellFirmwareComponent: GridCellFirmwareComponent,
      gridCellIdNumberComponent: GridCellIdNumberComponent,
      gridCellTimeOfUseIdComponent: GridCellTimeOfUseIdComponent,
      gridCellBreakerStateComponent: GridCellBreakerStateComponent,
      gridCellInfoOfChildComponent: GridCellInfoOfChildComponent,
      gridCellIconComponent: GridCellIconComponent,
      gridCellJobStatusComponent: GridCellJobStatusComponent,
      gridCellDetailLinkComponent: GridCellDetailLinkComponent
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
      animateRows: configAgGrid.animateRows,
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

  private onColumnMoved = params => {
    // TODO change to different store
    // this.gridSettingsCookieStoreService.setGridColumnsSettings(this.cookieNameForGridSettings, params.columnApi.getColumnState());
  };

  private onSortChanged = params => {
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

  public checkIfFilterModelAndCookieAreSame(sessionFilter: MeterUnitsLayout, requestModel: GridFilterParams) {
    if (
      JSON.stringify(sessionFilter.statusesFilter) === JSON.stringify(requestModel.statuses) &&
      JSON.stringify(sessionFilter.tagsFilter) === JSON.stringify(requestModel.tags) &&
      JSON.stringify(sessionFilter.vendorFilter) === JSON.stringify(requestModel.vendor) &&
      JSON.stringify(sessionFilter.readStatusFilter) === JSON.stringify(requestModel.readStatus) &&
      JSON.stringify(sessionFilter.firmwareFilter) === JSON.stringify(requestModel.firmware) &&
      JSON.stringify(sessionFilter.breakerStateFilter) === JSON.stringify(requestModel.disconnectorState) &&
      JSON.stringify(sessionFilter.showOnlyMeterUnitsWithMBusInfoFilter) === JSON.stringify(requestModel.showChildInfoMBus) &&
      JSON.stringify(sessionFilter.showDeletedMeterUnitsFilter) === JSON.stringify(requestModel.showDeleted) &&
      JSON.stringify(sessionFilter.showMeterUnitsWithoutTemplateFilter) === JSON.stringify(requestModel.showWithoutTemplate)
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

  // get stored grid settings from session configuration
  // ---------------------------------------------------------
  // is selected all
  public getSessionSettingsSelectedAll() {
    //  console.log(this.sessionNameForGridState);
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
      if (!_.find(settings.selectedRows, x => x.deviceId === selectedRow.data.deviceId)) {
        settings.selectedRows.push(selectedRow.data);
      }
    } else if (selectedRow.selected !== undefined && !selectedRow.selected) {
      settings.selectedRows = settings.selectedRows.filter(obj => obj.deviceId !== selectedRow.data.deviceId);
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
      if (_.find(settings.excludedRows, x => x.deviceId === excludedRow.data.deviceId)) {
        settings.excludedRows = settings.excludedRows.filter(obj => obj.deviceId !== excludedRow.data.deviceId);
      }
    } else if (excludedRow.selected !== undefined && !excludedRow.selected) {
      if (!_.find(settings.excludedRows, x => x.deviceId === excludedRow.data.deviceId)) {
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

  removeMyGridLink_BreakerState_RequestId(requestId: string) {
    this.gridSettingsSessionStoreService.removeMyGridLinkRequestId(this.gridNameBreakerState, requestId);
  }

  getAllMyGridLink_BreakerState_RequestIds(): string[] {
    return this.gridSettingsSessionStoreService.getAllMyGridLinkRequestIds(this.gridNameBreakerState);
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
}

// extra functions for grid
// set check box to first column
function isFirstColumn(params) {
  const displayedColumns = params.columnApi.getAllDisplayedColumns();
  const thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
}
