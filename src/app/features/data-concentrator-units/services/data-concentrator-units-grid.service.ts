import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GridColumnShowHideService } from 'src/app/core/ag-grid-helpers/services/grid-column-show-hide.service';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { GridFilterParams, GridSortParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { GridSettingsSessionStoreTypeEnum } from 'src/app/core/utils/enums/grid-settings-session-store.enum';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { GridColumn, GridColumnType, GridRowAction } from 'src/app/shared/data-table/data-table.component';
import { configAgGrid, configAgGridDefCol } from 'src/environments/config';
import { gridSysNameColumnsEnum } from '../../global/enums/meter-units-global.enum';
import { GridCellActionsComponent } from '../components/grid-custom-components/grid-cell-actions.component';
import { GridCellIconComponent } from '../components/grid-custom-components/grid-cell-icon.component';
import { GridCellIdNumberComponent } from '../components/grid-custom-components/grid-cell-id-number.component';
import { GridCellIpComponent } from '../components/grid-custom-components/grid-cell-ip.component';
import { GridCellJobStatusComponent } from '../components/grid-custom-components/grid-cell-job-status.component';
import { GridCellLastCommunicationComponent } from '../components/grid-custom-components/grid-cell-last-communication.component';
import { GridCellMetersComponent } from '../components/grid-custom-components/grid-cell-meters.component';
import { GridCellNameComponent } from '../components/grid-custom-components/grid-cell-name.component';
import { GridCellReadStatusComponent } from '../components/grid-custom-components/grid-cell-read-status.component';
import { GridCellStatusComponent } from '../components/grid-custom-components/grid-cell-status.component';
import { GridCellTagsComponent } from '../components/grid-custom-components/grid-cell-tags.component';
import { GridCellTypeComponent } from '../components/grid-custom-components/grid-cell-type.component';
import { GridCellVendorComponent } from '../components/grid-custom-components/grid-cell-vendor.component';
import { GridSelectionHeaderComponent } from '../components/grid-custom-components/grid-selection-header.component';
import { GridPagination } from '../interfaces/grid-pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsGridService {
  cookieNameForGridSettings = 'grdColDCU';
  cookieNameForGridSort = 'grdColDCUSort';
  sessionNameForGridState = 'grdStateDCU';

  gridName = 'grdDCU-requestIds';

  concentratorsColumns: Array<GridColumn> = [
    {
      field: 'icons',
      translationKey: '',
      width: 20,
      sortingDisabled: true,
      class: 'no-padding',
      type: GridColumnType.ICONS,
      iconsData: [
        {
          field: gridSysNameColumnsEnum.hasActiveJobs,
          iconName: 'clock-icon',
          popoverText: 'GRID.ACTIVE-JOBS'
        }
      ]
    },
    {
      field: gridSysNameColumnsEnum.sla,
      translationKey: 'GRID.SLA',
      width: 80,
      type: GridColumnType.SLA
    },
    {
      field: 'lastCommunication',
      translationKey: 'GRID.LAST-COMMUNICATION',
      width: 160,
      type: GridColumnType.DATE_TIME
    },
    {
      field: gridSysNameColumnsEnum.state,
      translationKey: 'GRID.STATE',
      width: 120,
      type: GridColumnType.BOLD_TEXT
    },
    {
      field: gridSysNameColumnsEnum.name,
      translationKey: 'GRID.NAME',
      width: 140,
      type: GridColumnType.LINK
    },
    {
      field: 'id',
      translationKey: 'GRID.SERIAL-NUMBER',
      width: 140
    },
    {
      field: 'hostname',
      translationKey: 'GRID.HOSTNAME',
      width: 200,
      type: GridColumnType.LINK
    },
    {
      field: gridSysNameColumnsEnum.type,
      translationKey: 'GRID.TYPE',
      width: 80
    },
    {
      field: gridSysNameColumnsEnum.vendor,
      translationKey: 'GRID.VENDOR',
      width: 80
    },
    {
      field: 'meters',
      translationKey: 'COMMON.METERS',
      width: 80,
      type: GridColumnType.LINK
    },
    {
      field: 'firmwareBase',
      translationKey: 'GRID.FIRMWARE-BASE',
      width: 140
    },
    {
      field: 'firmwareApp',
      translationKey: 'GRID.FIRMWARE-APP',
      width: 140
    },
    {
      field: gridSysNameColumnsEnum.readStatusTimeStamp,
      translationKey: 'GRID.READ-STATUS',
      width: 80
    }
  ];

  concentratorsRowActionConfiguration: Array<GridRowAction> = [
    {
      actionName: 'details',
      iconName: 'eye-icon'
    }
  ];

  constructor(
    private gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private gridColumnShowHideService: GridColumnShowHideService,
    private translate: TranslateService
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
        headerTooltip: this.translate.instant('GRID.SELECT-DESELECT-ALL')
      },
      {
        field: 'nextRead',
        headerName: ``,
        suppressColumnsToolPanel: true,
        suppressMovable: true,
        //  lockPosition: true,
        //  pinned: 'left',
        //  lockPinned: true,
        sortable: false,
        filter: false,
        cellRenderer: 'gridCellIconComponent',
        headerTooltip: ``,
        minWidth: 50,
        maxWidth: 50,
        width: 50,
        suppressMenu: true,
        resizable: false
      },
      {
        field: 'state',
        headerName: this.translate.instant('GRID.STATE'),
        //   pinned: true,
        sortable: false,
        filter: false,
        cellRenderer: 'gridCellStatusComponent',
        headerTooltip: this.translate.instant('GRID.STATE'),
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'name',
        headerName: this.translate.instant('GRID.NAME'),
        //   pinned: true,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellNameComponent',
        headerTooltip: this.translate.instant('GRID.NAME'),
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'id',
        headerName: this.translate.instant('GRID.SERIAL-NUMBER'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIdNumberComponent',
        headerTooltip: this.translate.instant('GRID.SERIAL-NUMBER'),
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'hostname',
        headerName: this.translate.instant('GRID.HOSTNAME'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellIpComponent',
        headerTooltip: this.translate.instant('GRID.HOSTNAME'),
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'type',
        headerName: this.translate.instant('COMMON.TYPE'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellTypeComponent',
        headerTooltip: this.translate.instant('COMMON.TYPE'),
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'vendor',
        headerName: this.translate.instant('GRID.MANUFACTURER'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellVendorComponent',
        headerTooltip: this.translate.instant('GRID.MANUFACTURER'),
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'meters',
        headerName: this.translate.instant('COMMON.METERS'),
        //    pinned: true,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellMetersComponent',
        headerTooltip: this.translate.instant('COMMON.METERS'),
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'readStatusTimeStamp',
        headerName: this.translate.instant('GRID.READ-STATUS'),
        //    pinned: true,
        sortable: true,
        filter: false,
        sort: 'desc',
        cellRenderer: 'gridCellReadStatusComponent',
        headerTooltip: this.translate.instant('GRID.READ-STATUS'),
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'lastCommunication',
        headerName: this.translate.instant('GRID.LAST-COMMUNICATION'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellLastCommunicationComponent',
        headerTooltip: this.translate.instant('GRID.LAST-COMMUNICATION'),
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'tags',
        headerName: this.translate.instant('GRID.TAGS'),
        pinned: false,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellTagsComponent',
        headerTooltip: this.translate.instant('GRID.TAGS'),
        suppressMenu: true,
        suppressMovable: true,
        resizable: false
      },
      {
        field: 'jobStatus',
        headerName: this.translate.instant('GRID.JOB-TYPE'),
        // pinned: 'right',
        // lockPinned: true,
        // lockPosition: true,
        suppressMovable: true,
        sortable: true,
        filter: false,
        cellRenderer: 'gridCellJobStatusComponent',
        headerTooltip: this.translate.instant('GRID.JOB-TYPE'),
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

  public getCookieData() {
    return this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSettings);
  }

  public getCookieDataSortModel() {
    return this.gridSettingsCookieStoreService.getGridColumnsSettings(this.cookieNameForGridSort);
  }

  public checkIfFilterModelAndCookieAreSame(sessionFilter: DcuLayout, requestModel: GridFilterParams) {
    return (
      JSON.stringify(sessionFilter.statesFilter) === JSON.stringify(requestModel.states) &&
      JSON.stringify(sessionFilter.readStatusFilter) === JSON.stringify(requestModel.readStatus) &&
      JSON.stringify(sessionFilter.tagsFilter) === JSON.stringify(requestModel.tags) &&
      JSON.stringify(sessionFilter.typesFilter) === JSON.stringify(requestModel.types) &&
      JSON.stringify(sessionFilter.vendorsFilter) === JSON.stringify(requestModel.vendors) &&
      JSON.stringify(sessionFilter.slaFilter) === JSON.stringify(requestModel.sla) &&
      JSON.stringify(sessionFilter.lastCommunicationFilter) === JSON.stringify(requestModel.lastCommunicationFilter)
    );
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
    settings.selectedRows = selectedRow;

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
    } else {
      settings.excludedRows = excludedRow;
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
    return settings.searchWildcards ? settings.searchWildcards : false;
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

  public setSessionSettingsGridSort(sorting: GridSortParams) {
    const settings = this.gridSettingsSessionStoreService.getGridSettings(this.sessionNameForGridState);
    settings.sortModel = [sorting];
    this.gridSettingsSessionStoreService.setGridSettings(
      this.sessionNameForGridState,
      GridSettingsSessionStoreTypeEnum.searchString,
      settings
    );
  }
}

// extra functions for grid
// set check box to first column
function isFirstColumn(params) {
  if (!params?.columnApi) {
    return;
  }

  const displayedColumns = params.columnApi.getAllDisplayedColumns();
  const thisIsFirstColumn = displayedColumns[0] === params.column;
  return thisIsFirstColumn;
}
