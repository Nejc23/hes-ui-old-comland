import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { AllModules, Module, GridOptions } from '@ag-grid-enterprise/all-modules';
import { DataConcentratorUnitsGridService } from '../services/data-concentrator-units-grid.service';
import { DataConcentratorUnitsStaticTextService } from '../services/data-concentrator-units-static-text.service';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DataConcentratorUnitsGridRequest } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-grid-request.interface';
import { DataConcentratorUnitsGridEventEmitterService } from '../services/data-concentrator-units-grid-event-emitter.service';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';

import * as moment from 'moment';
import { Subscription } from 'rxjs';

// consts
import { configGrid, configAgGrid } from 'src/environments/config';
import { enumSearchFilterOperators } from 'src/environments/config';
import { readStatusTrashold } from '../consts/data-concentrator-units.consts';
import { GridRequestParams, GridFilterParams } from 'src/app/core/repository/interfaces/helpers/gris-request-params.interface';

@Component({
  selector: 'app-data-concentrator-units',
  templateUrl: './data-concentrator-units.component.html'
})
export class DataConcentratorUnitsComponent implements OnInit {
  cookieNameForGridSettings = 'grdColDCU';
  sessionNameForGridState = 'grdStateDCU';
  sessionNameForGridFilter = 'grdLayoutDCU';

  // grid instance
  @ViewChild(DxDataGridComponent, { static: false }) grid: DxDataGridComponent;

  // grid variables
  columns = [];
  totalCount = 0;
  filters = '';
  gridSettings = configGrid;

  // N/A
  notAvailableText = this.staticextService.notAvailableTekst;

  // ---------------------- ag-grid ------------------
  agGridSettings = configAgGrid;
  public modules: Module[] = AllModules;
  public gridOptions: Partial<GridOptions>;
  public gridApi;
  private gridColumnApi;
  public icons;
  public frameworkComponents;
  public sideBar;

  requestModel: DataConcentratorUnitsGridRequest = {
    startRow: 0,
    endRow: 0,
    sortModel: [],
    searchModel: [],
    filterModel: {
      statuses: [{ id: 0, value: '' }],
      types: [0],
      tags: [{ id: 0, value: '' }],
      vendor: { id: 0, value: '' }
    }
  };

  constructor(
    private dataConcentratorUnitsGridService: DataConcentratorUnitsGridService,
    private sidebarService: SidebarService,
    private staticextService: DataConcentratorUnitsStaticTextService,
    private i18n: I18n,
    public gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private gridSettingsSessionStoreService: GridSettingsSessionStoreService,
    private dataConcentratorUnitsService: DataConcentratorUnitsService,
    private eventService: DataConcentratorUnitsGridEventEmitterService,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService
  ) {
    this.sidebarService.headerTitle = staticextService.headerTitleDCU;
    this.filters = staticextService.noFilterAppliedTekst;
    this.frameworkComponents = dataConcentratorUnitsGridService.setFrameworkComponents();
    this.gridOptions = this.dataConcentratorUnitsGridService.setGridOptions();
  }

  ngOnInit() {
    // set grid columns
    this.columns = this.dataConcentratorUnitsGridService.setGridDefaultColumns(false);
    // set right sidebar on the grid
    this.sideBar = this.dataConcentratorUnitsGridService.setSideBar();
  }

  // set momemnt text (next planned read) out of date and time
  setMomentNextPlannedReadTime(time: string) {
    return this.staticextService.nextPlannedReadText + this.i18n(moment(time).fromNow());
  }

  // set momemnt text (last communication) out of date and time
  setMomentLastCommunicationTime(time: string) {
    return this.i18n(moment(time).fromNow());
  }

  // load data from BE (default filter is selected company id)
  loadData(search: string) {
    // this.dataSource = this.dataConcentratorUnitsGridService.loadData(search);
  }

  // ag-grid
  // button click refresh grid
  refreshGrid() {
    this.gridApi.purgeServerSideCache([]);
  }

  // ag-grid
  // checking if at least one row on the grid is selected
  get selectedAtLeastOneRowOnGrid() {
    if (this.gridApi) {
      const selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows && selectedRows.length > 0) {
        return true;
      }
      return false;
    }
    return false;
  }

  // ag-grid
  // search string changed call get data
  searchData($event: string) {
    if ($event !== this.gridSettingsSessionStoreService.getGridSearchText(this.sessionNameForGridState)) {
      this.gridSettingsSessionStoreService.setGridSearchText(this.sessionNameForGridState, $event);
      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event }];

      this.gridApi.onFilterChanged();
    }
  }

  // TODO
  // button click upload configuration
  onUploadConfiguration() {
    let str = '';
    this.grid.selectedRowKeys.forEach(element => {
      str = str + element + ', ';
    });
    alert('selected items for upload config: ' + str);
  }

  // TODO
  // button click upgrade
  onUpgrade() {
    let str = '';
    this.grid.selectedRowKeys.forEach(element => {
      str = str + element + ', ';
    });
    alert('selected items for upgrade: ' + str);
  }

  // ----------------------- ag-grid set DATASOURCE ------------------------------
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.gridColumnApi;
    this.gridApi.sizeColumnsToFit();
    this.icons = {
      filter: ''
    };

    const dataFromCookie = this.dataConcentratorUnitsGridService.getCookieData(); // saved columns settings
    if (dataFromCookie) {
      params.columnApi.setColumnState(dataFromCookie);
    }

    const that = this;
    const datasource = {
      getRows(paramsRow) {
        that.requestModel.startRow = paramsRow.request.startRow;
        that.requestModel.endRow = paramsRow.request.endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;
        that.requestModel.filterModel = that.setFilter();
        that.dataConcentratorUnitsService.getGridDcu(that.requestModel).subscribe(data => {
          that.totalCount = data.totalCount;
          paramsRow.successCallback(data.data, data.totalCount);
          // params.failCallback();
        });
      }
    };

    this.gridApi.setServerSideDatasource(datasource);
  }
  // ----------------------- ag-grid set DATASOURCE end --------------------------

  // ag-grid change visibillity of columns
  onColumnVisible(params) {
    this.dataConcentratorUnitsGridService.onColumnVisibility(params);
  }

  // click on check-box in the grid
  onSelectionChanged() {
    this.eventService.checkChange(true);
  }

  // on close tool panel reload filter model
  toolPanelChanged(params) {
    if (params.source === undefined) {
      if (
        !this.dataConcentratorUnitsGridService.checkIfFilterModelAndCookieAreSame(
          this.gridFilterSessionStoreService.getGridFilter(this.sessionNameForGridFilter),
          this.requestModel.filterModel
        )
      ) {
        const filterDCU = this.gridFilterSessionStoreService.getGridFilter(this.sessionNameForGridFilter) as DcuFilter;
        this.requestModel.filterModel.statuses = filterDCU.statuses;
        this.requestModel.filterModel.vendor = filterDCU.vendor;
        this.requestModel.filterModel.types = filterDCU.types;
        this.requestModel.filterModel.tags = filterDCU.tags;
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    }
  }

  // set filter in request model
  setFilter() {
    if (
      !this.dataConcentratorUnitsGridService.checkIfFilterModelAndCookieAreSame(
        this.gridFilterSessionStoreService.getGridFilter(this.sessionNameForGridFilter),
        this.requestModel.filterModel
      )
    ) {
      this.setFilterInfo();
      const filterDCU = this.gridFilterSessionStoreService.getGridFilter(this.sessionNameForGridFilter) as DcuFilter;
      this.requestModel.filterModel.statuses = filterDCU.statuses;
      this.requestModel.filterModel.vendor = filterDCU.vendor;
      this.requestModel.filterModel.types = filterDCU.types;
      this.requestModel.filterModel.tags = filterDCU.tags;
    } else {
      this.setFilterInfo();
    }
    return this.requestModel.filterModel;
  }

  // fill text in header - about selected filters
  setFilterInfo() {
    const filter = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;

    this.filters = this.staticextService.setfilterHeaderText(
      filter.name,
      filter.statusesFilter && filter.statusesFilter.length > 0,
      filter.typesFilter && filter.typesFilter.length > 0,
      filter.vendorFilter ? true : false,
      filter.tagsFilter && filter.tagsFilter.length > 0
    );
  }

  // on change page in the grid
  onPaginationChange(params) {
    if (this.gridApi) {
      this.eventService.pageChange(this.gridApi.paginationGetCurrentPage());
    }
  }

  // check if "select all" was clicked
  selectedAll() {
    return localStorage.getItem('lockCheckBox') === 'true' ? true : false;
  }

  // if selected-all clicked, than disable deselection of the rows
  onRowSelect(params) {
    if (localStorage.getItem('lockCheckBox') === 'true') {
      params.node.setSelected(true);
    }
  }

  // click on the link "select all"
  selectAll() {
    localStorage.setItem('lockCheckBox', 'true');
    this.eventService.pageChange(this.gridApi.paginationGetCurrentPage());
  }

  // click on the link "deselect all"
  deselectAll() {
    localStorage.setItem('lockCheckBox', 'false');
    this.eventService.pageChange(-1); // -1 = deselect all
  }
}
