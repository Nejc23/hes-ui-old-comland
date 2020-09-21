import { Injectable, Input, setTestabilityGetter } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { GridRequestParams, GridFilterParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { GridSelectionHeaderComponent } from '../components/grid-custom-components/grid-selection-header.component';
import { GridCellStatusComponent } from '../components/grid-custom-components/grid-cell-status.component';
import { GridCellReadStatusComponent } from '../components/grid-custom-components/grid-cell-read-status.component';
import { GridCellNameComponent } from '../components/grid-custom-components/grid-cell-name.component';
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
    private i18n: I18n,
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
        headerTooltip: this.i18n('Select/deselect all')
      },
      {
        field: 'nextRead',
        headerName: this.i18n(''),
        suppressColumnsToolPanel: true,
        suppressMovable: true,
        lockPosition: true,
        pinned: 'left',
        lockPinned: true,
        sortable: false,
        filter: false,
        cellRenderer: 'gridCellIconComponent',
        headerTooltip: this.i18n(''),
        minWidth: 100,
        maxWidth: 100,
        width: 100
      },
      {
        field: 'status',
        headerName: this.i18n('Status'),
        pinned: true,
        sortable: false,
        filter: false,
        cellRenderer: 'gridCellStatusComponent',
        headerTooltip: this.i18n('Status')
      },
      {
        field: 'name',
        headerName: this.i18n('Name'),
        pinned: true,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellNameComponent',
        headerTooltip: this.i18n('Name')
      },
      {
        field: 'readStatusTimeStamp',
        headerName: this.i18n('Read status'),
        pinned: true,
        sortable: true,
        filter: false,
        sort: 'desc',
        cellRenderer: 'gridCellReadStatusComponent',
        headerTooltip: this.i18n('Read status')
      },
      {
        field: 'vendor',
        headerName: this.i18n('Vendor'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellVendorComponent',
        headerTooltip: this.i18n('Vendor')
      },
      {
        field: 'parent',
        headerName: this.i18n('Parent'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gidCellParentComponent',
        headerTooltip: this.i18n('Parent')
      },
      {
        field: 'moduleId',
        headerName: this.i18n('Module Id'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellModuleIdComponent',
        headerTooltip: this.i18n('Module Id')
      },
      {
        field: 'firmware',
        headerName: this.i18n('Firmware'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellFirmwareComponent',
        headerTooltip: this.i18n('Firmware')
      },
      {
        field: 'timeOfUseId',
        headerName: this.i18n('Time of use Id'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellTimeOfUseIdComponent',
        headerTooltip: this.i18n('Time of use Id')
      },
      {
        field: 'id1',
        headerName: this.i18n('ID1'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: this.i18n('ID1'),
        hide: true
      },
      {
        field: 'id2',
        headerName: this.i18n('ID2'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: this.i18n('ID2'),
        hide: true
      },
      {
        field: 'id3',
        headerName: this.i18n('ID3'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: this.i18n('ID3'),
        hide: true
      },
      {
        field: 'id4',
        headerName: this.i18n('ID4'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: this.i18n('ID4'),
        hide: true
      },
      {
        field: 'id5',
        headerName: this.i18n('ID5'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: this.i18n('ID5')
      },
      {
        field: 'id6',
        headerName: this.i18n('ID6'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: this.i18n('ID6'),
        hide: true
      },
      {
        field: 'configurationId',
        headerName: this.i18n('Configuration Id'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: this.i18n('Configuration Id')
      },
      {
        field: 'parametrisationId',
        headerName: this.i18n('Parametrisation Id'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: this.i18n('Parametrisation Id')
      },
      {
        field: 'logicalDeviceName',
        headerName: this.i18n('Logical device name'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellNameComponent',
        headerTooltip: this.i18n('Logical device name'),
        hide: true
      },
      // {
      //   field: 'childInfo',
      //   headerName: this.i18n('Information of child (MBus)'),
      //   pinned: false,
      //   sortable: true,
      //   filter: false,
      //   cellRenderer: 'gridCellInfoOfChildComponent',
      //   headerTooltip: this.i18n('Information of child (MBus)')
      // },
      {
        field: 'disconnectorState',
        headerName: this.i18n('Breaker State'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellBreakerStateComponent',
        headerTooltip: this.i18n('Breaker State')
      },
      {
        field: 'tags',
        headerName: this.i18n('Tags'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellTagsComponent',
        headerTooltip: this.i18n('Tags')
      },
      {
        field: 'jobStatus',
        headerName: this.i18n('Job status'),
        pinned: 'right',
        lockPinned: true,
        lockPosition: true,
        suppressMovable: true,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellJobStatusComponent',
        headerTooltip: this.i18n('Job status'),
        resizable: false
      },
      {
        field: 'id',
        pinned: 'right',
        width: 180,
        minWidth: 180,
        maxWidth: 180,
        suppressMenu: true,
        editable: false,
        suppressMovable: true,
        lockPinned: true,
        lockPosition: true,
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
      gridCellNameComponent: GridCellNameComponent,
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
      gridCellJobStatusComponent: GridCellJobStatusComponent
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
    console.log('excluded row', excludedRow);

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
