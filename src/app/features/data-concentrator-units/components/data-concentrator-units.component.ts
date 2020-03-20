import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { AllModules, Module, GridOptions } from '@ag-grid-enterprise/all-modules';
import { DataConcentratorUnitsGridService } from '../services/data-concentrator-units-grid.service';
import { DataConcentratorUnitsStaticTextService } from '../services/data-concentrator-units-static-text.service';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { GridSettingsSessionStoreService } from 'src/app/core/utils/services/grid-settings-session-store.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DataConcentratorUnitsGridEventEmitterService } from '../services/data-concentrator-units-grid-event-emitter.service';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';

import * as moment from 'moment';
import { Subscription } from 'rxjs';

// consts
import { configAgGrid } from 'src/environments/config';
import { enumSearchFilterOperators } from 'src/environments/config';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/gris-request-params.interface';
import * as _ from 'lodash';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';

@Component({
  selector: 'app-data-concentrator-units',
  templateUrl: './data-concentrator-units.component.html'
})
export class DataConcentratorUnitsComponent implements OnInit, OnDestroy {
  sessionNameForGridState = 'grdStateDCU';
  sessionNameForGridFilter = 'grdLayoutDCU';

  // grid variables
  columns = [];
  totalCount = 0;
  filters = '';

  private layoutChangeSubscription: Subscription;

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
  loadGrid = true;

  requestModel: GridRequestParams = {
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
    private dataConcentratorUnitsService: DataConcentratorUnitsService,
    private eventService: DataConcentratorUnitsGridEventEmitterService,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    private modalService: ModalService,
    private formUtils: FormsUtilsService
  ) {
    this.sidebarService.headerTitle = staticextService.headerTitleDCU;
    this.filters = staticextService.noFilterAppliedTekst;
    this.frameworkComponents = dataConcentratorUnitsGridService.setFrameworkComponents();
    this.gridOptions = this.dataConcentratorUnitsGridService.setGridOptions();
    this.layoutChangeSubscription = this.eventService.eventEmitterLayoutChange.subscribe({
      next: (event: DcuLayout) => {
        this.requestModel.filterModel.statuses = event.statusesFilter;
        this.requestModel.filterModel.vendor = event.vendorFilter;
        this.requestModel.filterModel.types = event.typesFilter;
        this.requestModel.filterModel.tags = event.tagsFilter;
        this.gridColumnApi.setColumnState(event.gridLayout);
        this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
        this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    });
  }

  ngOnInit() {
    // set grid columns
    this.columns = this.dataConcentratorUnitsGridService.setGridDefaultColumns(false);
    // set right sidebar on the grid
    this.sideBar = this.dataConcentratorUnitsGridService.setSideBar();
  }

  ngOnDestroy(): void {
    if (this.layoutChangeSubscription) {
      this.layoutChangeSubscription.unsubscribe();
    }
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
    if ($event !== this.dataConcentratorUnitsGridService.getSessionSettingsSearchedText()) {
      this.dataConcentratorUnitsGridService.setSessionSettingsSearchedText($event);
      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event }];

      this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
      this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
      this.gridApi.onFilterChanged();
    }
  }

  // ----------------------- ag-grid set DATASOURCE ------------------------------
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.icons = {
      filter: ''
    };
    const dataFromCookie = this.dataConcentratorUnitsGridService.getCookieData(); // saved columns settings
    if (dataFromCookie) {
      params.columnApi.setColumnState(dataFromCookie);
    }

    const cookieSort = this.dataConcentratorUnitsGridService.getCookieDataSortModel();
    if (cookieSort !== undefined && cookieSort !== null) {
      this.gridApi.setSortModel(cookieSort);
    }

    const that = this;
    const datasource = {
      getRows(paramsRow) {
        that.requestModel.startRow = that.dataConcentratorUnitsGridService.getCurrentRowIndex().startRow;
        that.requestModel.endRow = that.dataConcentratorUnitsGridService.getCurrentRowIndex().endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;
        that.requestModel.filterModel = that.setFilter();
        that.requestModel.searchModel = that.setSearch();
        that.dataConcentratorUnitsService.getGridDcu(that.requestModel).subscribe(data => {
          that.totalCount = data.totalCount;
          that.gridApi.paginationGoToPage(that.dataConcentratorUnitsGridService.getSessionSettingsPageIndex());
          paramsRow.successCallback(data.data, data.totalCount);
          that.selectRows(that.gridApi);
          // params.failCallback();
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }
  // ----------------------- ag-grid set DATASOURCE end --------------------------

  onFirstDataRendered(params) {
    // console.log(params);
    // this.autoSizeAll(params);
    params.api.sizeColumnsToFit();
  }

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
          this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter),
          this.requestModel.filterModel
        )
      ) {
        const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;
        this.requestModel.filterModel.statuses = filterDCU.statusesFilter;
        this.requestModel.filterModel.vendor = filterDCU.vendorFilter;
        this.requestModel.filterModel.types = filterDCU.typesFilter;
        this.requestModel.filterModel.tags = filterDCU.tagsFilter;
        this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
        this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    }
  }

  setSearch() {
    const search = this.dataConcentratorUnitsGridService.getSessionSettingsSearchedText();
    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search }]);
    }
    return [];
  }

  // set filter in request model
  setFilter() {
    if (
      !this.dataConcentratorUnitsGridService.checkIfFilterModelAndCookieAreSame(
        this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter),
        this.requestModel.filterModel
      )
    ) {
      this.setFilterInfo();
      const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;
      this.requestModel.filterModel.statuses = filterDCU.statusesFilter;
      this.requestModel.filterModel.vendor = filterDCU.vendorFilter;
      this.requestModel.filterModel.types = filterDCU.typesFilter;
      this.requestModel.filterModel.tags = filterDCU.tagsFilter;
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
    if (params.newPage && !this.loadGrid) {
      this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(params.api.paginationGetCurrentPage());
      this.eventService.pageChange(params.api.paginationGetCurrentPage());
    } else if (!params.newPage && params.keepRenderedRows && this.loadGrid) {
      this.loadGrid = false;
      params.api.paginationGoToPage(this.dataConcentratorUnitsGridService.getSessionSettingsPageIndex());
    }
  }

  // check if "select all" was clicked
  checkSelectedAll() {
    return this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll();
  }

  // if selected-all clicked, than disable deselection of the rows
  onRowSelect(params) {
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows(params.api.getSelectedRows());
    if (this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll()) {
      params.node.setSelected(true);
    }
  }

  // select rows on load grid from session
  selectRows(api: any) {
    api.forEachNode(node => {
      const selectedRows = this.dataConcentratorUnitsGridService.getSessionSettingsSelectedRows();
      if (this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll()) {
        const startRow = api.getFirstDisplayedRow();
        const endRow = api.getLastDisplayedRow();
        api.forEachNode(node2 => {
          if (node2.rowIndex >= startRow && node2.rowIndex <= endRow) {
            node2.setSelected(true);
          }
        });
      } else if (
        node.data !== undefined &&
        node.data.id > 0 &&
        selectedRows !== undefined &&
        selectedRows.length > 0 &&
        !this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll() &&
        _.find(selectedRows, x => x.id === node.data.id && !node.selected) !== undefined
      ) {
        node.setSelected(true);
      }
    });
  }

  // form actions

  // click on the link "select all"
  selectAll() {
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(true);
    this.eventService.pageChange(this.gridApi.paginationGetCurrentPage());
  }

  // click on the link "deselect all"
  deselectAll() {
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(false);
    this.eventService.pageChange(-1); // -1 = deselect all
  }

  // TODO
  // tsg button click
  onTag() {
    //
  }

  // TODO
  // delete button click
  onDelete() {
    let selectedText = 'all';
    if (!this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll()) {
      const selectedRows = this.gridApi.getSelectedRows();
      selectedText = selectedRows ? selectedRows.length : 0;
    }

    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.confirmDelete = true;
    component.modalBody = this.i18n(`Delete ${selectedText} selected Data Concentrator Units?`);

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        const request = this.dataConcentratorUnitsService.deleteDcu({ id: null, filter: null });
        this.formUtils.deleteForm(request, this.i18n('Selected items deleted')).subscribe(
          (response: any) => {
            this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
            this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(false);
            this.gridApi.forEachNode(node => {
              node.setSelected(false);
            });

            this.gridApi.onFilterChanged();
          },
          () => {}
        );
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }

  // TODO
  // upload configuration button click
  onUploadConfiguration() {
    //
  }

  // TODO
  // upgrade button click
  onUpgrade() {
    //
  }
}
