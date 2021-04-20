import { SidebarToggleService } from './../../../../shared/base-template/components/services/sidebar.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { GridOptions, Module } from '@ag-grid-community/core';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { configAgGrid, enumSearchFilterOperators, gridRefreshInterval } from 'src/environments/config';
import { Subscription, Observable } from 'rxjs';
import * as _ from 'lodash';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { ActionEnumerator } from 'src/app/core/permissions/enumerators/action-enumerator.model';
import { AgGridSharedFunctionsService } from 'src/app/shared/ag-grid/services/ag-grid-shared-functions.service';
import { AllForJobStaticTextService } from '../services/meter-units-for-job-static-text.service';
import { AllForJobGridEventEmitterService } from '../services/meter-units-for-job-grid-event-emitter.service';
import { RequestMeterUnitsForJob } from 'src/app/core/repository/interfaces/meter-units/meter-units-for-job.interface';
import { MeterUnitsForJobGridService } from '../services/meter-units-for-job-grid.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { RequestFilterParams } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { GridUtils } from '../../../global/grid.utils';

@Component({
  templateUrl: './meter-units-for-job.component.html'
})
export class AllForJobComponent implements OnInit, OnDestroy {
  meterTypes$: Codelist<number>[] = [];

  scheduleId = '';
  private paramsSub: Subscription;
  sessionNameForGridFilter = 'grdLayoutMUT';
  // headerTitle = '';
  // taskStatusOK = 'TASK_PREREQ_FAILURE'; // TODO: ONLY FOR DEBUG !!!
  taskStatusOK = 'TASK_SUCCESS';
  refreshInterval = gridRefreshInterval;

  // grid variables
  columns = [];
  totalCount = 0;
  filters = '';
  private layoutChangeSubscription: Subscription;

  // N/A
  notAvailableText = this.staticTextService.notAvailableTekst;
  overlayNoRowsTemplate = this.staticTextService.noRecordsFound;
  overlayLoadingTemplate = this.staticTextService.loadingData;
  noData = false;

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
  programmaticallySelectRow = false;
  requestModel: RequestMeterUnitsForJob = {
    requestId: null,
    scheduleId: null,
    startRow: 0,
    endRow: 0,
    sortModel: [],
    searchModel: [],
    filterModel: {
      statuses: null,
      tags: null,
      firmware: null,
      // vendors: null,
      readStatus: null,
      disconnectorState: null,
      showChildInfoMBus: false,
      showWithoutTemplate: true,
      showOptionFilter: null
    }
  };

  requestId = '';
  dataResult = '';
  dataStatusResponse = '';
  dataResult2 = '';
  public localeText;

  // messageActionInProgress = this.i18n(`Action in progress!`);
  messageServerError = $localize`Server error!`;
  messageDataRefreshed = $localize`Data refreshed!`;
  messageActionFailed = $localize`Action failed!`;

  public useWildcards = false;

  constructor(
    private route: ActivatedRoute,
    private meterUnitsForJobGridService: MeterUnitsForJobGridService,
    private staticTextService: AllForJobStaticTextService,
    private agGridSharedFunctionsService: AgGridSharedFunctionsService,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    private meterUnitsTypeService: MeterUnitsService,
    private toast: ToastNotificationService,
    private eventService: AllForJobGridEventEmitterService,
    private authService: AuthService,
    private modalService: ModalService,
    private breadcrumbService: BreadcrumbService,
    private sidebarToggleService: SidebarToggleService
  ) {
    this.paramsSub = route.params.subscribe((params) => {
      this.scheduleId = params.scheduleId;
      meterUnitsForJobGridService.meterUnitsAllId = params.id;
      this.sessionNameForGridFilter = this.sessionNameForGridFilter.includes('grdLayoutMUT')
        ? this.sessionNameForGridFilter
        : 'grdLayoutMUT';

      if (this.gridApi) {
        this.gridApi.purgeServerSideCache([]);
      }

      if (this.gridColumnApi) {
        const dataFromCookie = this.meterUnitsForJobGridService.getCookieData(); // saved columns settings
        const cookieSort = this.meterUnitsForJobGridService.getCookieDataSortModel();

        if (dataFromCookie) {
          this.gridColumnApi.setColumnState(dataFromCookie);
        }

        if (cookieSort !== undefined && cookieSort !== null) {
          this.gridColumnApi.applyColumnState({ state: cookieSort });
        }
      }
    });

    this.frameworkComponents = meterUnitsForJobGridService.setFrameworkComponents();
    this.gridOptions = this.meterUnitsForJobGridService.setGridOptions();
    this.useWildcards = this.meterUnitsForJobGridService.getSessionSettingsSearchedWildcards();
  }

  // form - rights
  get formFunctionality() {
    return FunctionalityEnumerator.MU;
  }
  // actions - rights
  get actionMURemoveFromJob() {
    return ActionEnumerator.MURemoveFromJob;
  }

  ngOnInit() {
    this.setTitle('');

    this.route.queryParams.subscribe((params) => {
      this.requestModel.scheduleId = params.scheduleId;
    });

    // set grid columns
    this.columns = this.meterUnitsForJobGridService.setGridDefaultColumns(false);
    // set right sidebar on the grid
    this.sideBar = this.meterUnitsForJobGridService.setSideBar();

    this.localeText = {
      // for side panel
      columns: $localize`Columns`,
      filters: $localize`Filters`,

      // for filter panel
      page: $localize`page`,
      more: $localize`more`,
      to: $localize`to`,
      of: $localize`of`,
      next: $localize`next`,
      last: $localize`last`,
      first: $localize`first`,
      previous: $localize`previous`,
      loadingOoo: $localize`loading...`
    };

    this.sidebarToggleService.eventEmitterToggleMenu.subscribe(() => {
      setTimeout(() => {
        this.gridApi.sizeColumnsToFit();
      }, 320);
    });
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }

    if (this.layoutChangeSubscription) {
      this.layoutChangeSubscription.unsubscribe();
    }
  }

  isFilterSet(): boolean {
    const filterInfo: MeterUnitsLayout = this.gridFilterSessionStoreService.getGridLayout(
      this.sessionNameForGridFilter
    ) as MeterUnitsLayout;
    return (
      (filterInfo.name !== '' && filterInfo.name !== undefined) ||
      (filterInfo.statusesFilter && filterInfo.statusesFilter.length > 0) ||
      (filterInfo.readStatusFilter && filterInfo.readStatusFilter.operation && filterInfo.readStatusFilter.operation.id.length > 0) ||
      (filterInfo.vendorsFilter &&
        filterInfo.vendorsFilter.length > 0 &&
        filterInfo.vendorsFilter[0].value !== undefined &&
        filterInfo.vendorsFilter[0].value !== '') ||
      (filterInfo.readStatusFilter && filterInfo.readStatusFilter.operation && filterInfo.readStatusFilter.operation.id.length > 0) ||
      (filterInfo.firmwareFilter && filterInfo.firmwareFilter.length > 0) ||
      (filterInfo.breakerStateFilter && filterInfo.breakerStateFilter.length > 0) ||
      filterInfo.showOnlyMeterUnitsWithMBusInfoFilter ||
      filterInfo.showMeterUnitsWithoutTemplateFilter ||
      filterInfo.showOnlyImageReadyForActivationFilter
    );
  }

  checkSelectedAll() {
    return this.meterUnitsForJobGridService.getSessionSettingsSelectedAll();
  }

  clearFilter() {
    this.gridFilterSessionStoreService.clearGridLayout();
    this.refreshGrid();
  }

  // ag-grid
  // button click refresh grid
  refreshGrid() {
    if (this.gridApi) {
      this.gridApi.purgeServerSideCache([]);
    }
  }

  // ag-grid
  // search string changed call get data
  searchData($event: string) {
    if ($event !== this.meterUnitsForJobGridService.getSessionSettingsSearchedText()) {
      this.deselectAll();
      this.meterUnitsForJobGridService.setSessionSettingsSearchedText($event);

      const useWildcards = this.meterUnitsForJobGridService.getSessionSettingsSearchedWildcards();
      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event, useWildcards }];

      this.meterUnitsForJobGridService.setSessionSettingsPageIndex(0);
      this.meterUnitsForJobGridService.setSessionSettingsSelectedRows([]);
      this.gridApi.onFilterChanged();
    }
  }

  // ag-grid
  // checking if at least one row on the grid is selected
  get selectedAtLeastOneRowOnGrid() {
    if (this.gridApi) {
      const selectedRows = this.meterUnitsForJobGridService.getSessionSettingsSelectedRows();
      if (selectedRows && selectedRows.length > 0) {
        return true;
      }
      return false;
    }
    return false;
  }

  // click on the link "select all"
  selectAll() {
    this.meterUnitsForJobGridService.setSessionSettingsClearExcludedRows();
    this.meterUnitsForJobGridService.setSessionSettingsSelectedAll(true);
    this.eventService.selectDeselectAll(true);
    this.eventService.setIsSelectedAll(true);
  }

  // click on the link "deselect all"
  deselectAll() {
    this.meterUnitsForJobGridService.setSessionSettingsClearExcludedRows();
    this.meterUnitsForJobGridService.setSessionSettingsSelectedRows([]);
    this.meterUnitsForJobGridService.setSessionSettingsSelectedAll(false);
    this.eventService.selectDeselectAll(false);
    this.eventService.setIsSelectedAll(false);
  }

  // click on check-box in the grid
  onSelectionChanged() {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }
    // this.eventService.checkChange(true);
  }

  // ----------------------- ag-grid set DATASOURCE ------------------------------
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.agGridSharedFunctionsService.addSelectDeselectAllText();

    window.onresize = () => {
      this.gridApi.sizeColumnsToFit();
    };
    this.icons = {
      filter: ''
    };

    const that = this;
    const datasource = {
      getRows(paramsRow) {
        that.requestModel.scheduleId = that.scheduleId; // type of meter units
        that.requestModel.startRow = that.meterUnitsForJobGridService.getCurrentRowIndex().startRow;
        that.requestModel.endRow = that.meterUnitsForJobGridService.getCurrentRowIndex().endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;
        that.requestModel.searchModel = that.setSearch();
        that.meterUnitsTypeService.getGridMeterUnitsForJob(that.requestModel).subscribe((response) => {
          that.gridApi.hideOverlay();
          that.totalCount = 0;
          if (response) {
            that.setTitle(response.jobDescription);
          }

          if (response && response.grid && response.grid.totalCount > 0) {
            that.totalCount = response.grid.totalCount;
            that.gridApi.paginationGoToPage(that.meterUnitsForJobGridService.getSessionSettingsPageIndex());
            paramsRow.successCallback(response.grid.data, response.grid.totalCount);
            that.selectRows(that.gridApi);
            that.eventService.setIsSelectedAll(that.meterUnitsForJobGridService.getSessionSettingsSelectedAll());
          } else {
            that.gridApi.showNoRowsOverlay();
            paramsRow.successCallback([], 0);
          }
        });
        // }
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }
  // ----------------------- ag-grid set DATASOURCE end --------------------------

  // ag-grid change visibillity of columns
  onColumnVisible(params) {
    this.meterUnitsForJobGridService.onColumnVisibility(params);
  }

  // on close tool panel reload filter model
  toolPanelChanged(params) {
    if (params.source === undefined) {
      if (
        !this.meterUnitsForJobGridService.checkIfFilterModelAndCookieAreSame(
          this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter),
          this.requestModel.filterModel
        )
      ) {
        const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
        this.requestModel.filterModel.statuses = filterDCU.statusesFilter;
        this.requestModel.filterModel.vendors = filterDCU.vendorsFilter;
        this.requestModel.filterModel.tags = filterDCU.tagsFilter;
        if (filterDCU.readStatusFilter !== undefined && filterDCU.readStatusFilter != null) {
          this.requestModel.filterModel.readStatus.operation = filterDCU.readStatusFilter.operation;
          this.requestModel.filterModel.readStatus.value1 = filterDCU.readStatusFilter.value1;
          this.requestModel.filterModel.readStatus.value2 = filterDCU.readStatusFilter.value2;
        } else {
          this.requestModel.filterModel.readStatus = {
            operation: { id: '', value: '' },
            value1: 0,
            value2: 0
          };
        }
        this.requestModel.filterModel.firmware = filterDCU.firmwareFilter;
        this.requestModel.filterModel.disconnectorState = filterDCU.breakerStateFilter;
        this.requestModel.filterModel.showChildInfoMBus = filterDCU.showOnlyMeterUnitsWithMBusInfoFilter;
        this.requestModel.filterModel.showWithoutTemplate = filterDCU.showMeterUnitsWithoutTemplateFilter;
        this.requestModel.filterModel.readyForActivation = filterDCU.showOnlyImageReadyForActivationFilter;

        this.meterUnitsForJobGridService.setSessionSettingsPageIndex(0);
        this.meterUnitsForJobGridService.setSessionSettingsSelectedAll(false);
        this.meterUnitsForJobGridService.setSessionSettingsSelectedRows([]);
        this.eventService.selectDeselectAll(false);
        this.eventService.setIsSelectedAll(false);
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    }
  }

  // on change page in the grid
  onPaginationChange(params) {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }

    if (params.newPage && !this.loadGrid) {
      this.meterUnitsForJobGridService.setSessionSettingsPageIndex(params.api.paginationGetCurrentPage());
    } else if (!params.newPage && params.keepRenderedRows && this.loadGrid) {
      this.loadGrid = false;
      params.api.paginationGoToPage(this.meterUnitsForJobGridService.getSessionSettingsPageIndex());
    }
  }

  gridSizeChanged() {
    this.resizeColumns();
  }

  resizeColumns() {
    GridUtils.resizeColumns(this.gridColumnApi, this.gridOptions);
  }

  // if selected-all clicked, than disable deselection of the rows
  onRowSelect(params) {
    if (this.meterUnitsForJobGridService.getSessionSettingsSelectedAll()) {
      this.meterUnitsForJobGridService.setSessionSettingsExcludedRows(params.node);
    } else {
      this.meterUnitsForJobGridService.setSessionSettingsSelectedRows(params.node);
    }
  }

  onFirstDataRendered(params) {}

  refresh() {
    this.refreshGrid();
    this.deselectAll();
  }

  // set filter in request model
  setFilter() {
    if (
      !this.meterUnitsForJobGridService.checkIfFilterModelAndCookieAreSame(
        this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter),
        this.requestModel.filterModel
      )
    ) {
      this.setFilterInfo();
      const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
      this.requestModel.filterModel.statuses = filterDCU.statusesFilter;
      this.requestModel.filterModel.vendors = filterDCU.vendorsFilter;
      this.requestModel.filterModel.tags = filterDCU.tagsFilter;
      this.requestModel.filterModel.readStatus = {
        operation: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.operation : { id: '', value: '' },
        value1: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value1 : 0,
        value2: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value2 : 0
      };
      this.requestModel.filterModel.firmware = filterDCU.firmwareFilter;
      this.requestModel.filterModel.disconnectorState = filterDCU.breakerStateFilter;
      this.requestModel.filterModel.showChildInfoMBus = filterDCU.showOnlyMeterUnitsWithMBusInfoFilter;
      this.requestModel.filterModel.showWithoutTemplate = filterDCU.showMeterUnitsWithoutTemplateFilter;
      this.requestModel.filterModel.readyForActivation = filterDCU.showOnlyImageReadyForActivationFilter;
    } else {
      this.setFilterInfo();
    }
    return this.requestModel.filterModel;
  }

  // fill text in header - about selected filters
  setFilterInfo() {
    const filterInfo = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
    this.filters = this.staticTextService.setfilterHeaderText(
      filterInfo.name,
      filterInfo.statusesFilter && filterInfo.statusesFilter.length > 0,
      filterInfo.vendorsFilter && filterInfo.vendorsFilter.length > 0 ? true : false,
      filterInfo.tagsFilter && filterInfo.tagsFilter.length > 0,
      filterInfo.readStatusFilter && filterInfo.readStatusFilter.operation && filterInfo.readStatusFilter.operation.id.length > 0
        ? true
        : false,
      filterInfo.firmwareFilter && filterInfo.firmwareFilter.length > 0,
      filterInfo.breakerStateFilter && filterInfo.breakerStateFilter.length > 0,
      filterInfo.showOnlyMeterUnitsWithMBusInfoFilter,
      filterInfo.showMeterUnitsWithoutTemplateFilter,
      filterInfo.showOnlyImageReadyForActivationFilter
    );
  }

  setSearch() {
    const search = this.meterUnitsForJobGridService.getSessionSettingsSearchedText();

    let useWildcards = this.meterUnitsForJobGridService.getSessionSettingsSearchedWildcards();
    if (!useWildcards) {
      useWildcards = false;
    }

    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search, useWildcards }]);
    }
    return [];
  }

  // select rows on load grid from session
  selectRows(api: any) {
    this.programmaticallySelectRow = true;
    const selectedAll = this.meterUnitsForJobGridService.getSessionSettingsSelectedAll();
    const selectedRows = this.meterUnitsForJobGridService.getSessionSettingsSelectedRows();
    api.forEachNode((node) => {
      if (selectedAll) {
        const startRow = api.getFirstDisplayedRow();
        const endRow = api.getLastDisplayedRow();

        const excludedRows = this.meterUnitsForJobGridService.getSessionSettingsExcludedRows();
        api.forEachNode((node2) => {
          if (node2.rowIndex >= startRow && node2.rowIndex <= endRow && !_.find(excludedRows, (x) => x.deviceId === node2.data.deviceId)) {
            node2.setSelected(true);
          }
        });
      } else if (
        node.data !== undefined &&
        selectedRows !== undefined &&
        selectedRows.length > 0 &&
        !selectedAll &&
        _.find(selectedRows, (x) => x.deviceId === node.data.deviceId) !== undefined
      ) {
        node.setSelected(true);
      } else {
        node.setSelected(false);
      }
    });

    this.programmaticallySelectRow = false;
  }

  private noSearch() {
    if (this.requestModel.searchModel == null || this.requestModel.searchModel.length === 0) {
      return true;
    }
    return false;
  }

  private noFilters() {
    if (
      this.requestModel.filterModel == null ||
      ((!this.requestModel.filterModel.statuses ||
        this.requestModel.filterModel.statuses.length === 0 ||
        this.requestModel.filterModel.statuses[0].id === 0) &&
        (!this.requestModel.filterModel.tags ||
          this.requestModel.filterModel.tags.length === 0 ||
          this.requestModel.filterModel.tags[0].id === 0) &&
        (!this.requestModel.filterModel.types ||
          this.requestModel.filterModel.types.length === 0 ||
          this.requestModel.filterModel.types[0] === 0) &&
        (!this.requestModel.filterModel.vendors ||
          this.requestModel.filterModel.vendors.length === 0 ||
          this.requestModel.filterModel.vendors[0].id === 0) &&
        (!this.requestModel.filterModel.readStatus || this.requestModel.filterModel.readStatus === null) &&
        (!this.requestModel.filterModel.firmware ||
          this.requestModel.filterModel.firmware.length === 0 ||
          this.requestModel.filterModel.firmware[0].id === 0) &&
        (!this.requestModel.filterModel.disconnectorState ||
          this.requestModel.filterModel.disconnectorState.length === 0 ||
          this.requestModel.filterModel.disconnectorState[0].id === 0) &&
        !this.requestModel.filterModel.showChildInfoMBus &&
        !this.requestModel.filterModel.showWithoutTemplate &&
        !this.requestModel.filterModel.readyForActivation)
    ) {
      return true;
    }
    return false;
  }

  // set form title by selected meter unit type
  public setTitle(jobDescription?: string) {
    // const selectedType = this.meterTypes$.find(x => x.id === id);
    // if (selectedType !== undefined && selectedType != null) {
    //   this.headerTitle = selectedType.value + ' ' + this.staticTextService.headerTitleMeterUnitsAll;
    // }
    if (jobDescription === undefined || jobDescription.trim().length === 0) {
      jobDescription = this.staticTextService.notAvailableTekst;
    } else {
      jobDescription = this.staticTextService.headerTitleMeterUnitsAll + ' ' + jobDescription;
    }

    // this.headerTitle = `${this.staticTextService.headerTitleMeterUnitsAll} ${jobDescription}`;
    this.breadcrumbService.setPageName(jobDescription);
  }

  onRemoveFromJob() {
    const selectedRows = this.meterUnitsForJobGridService.getSessionSettingsSelectedRows();
    const deviceIdsParam = [];

    // const selectedDeviceCount = this.totalCount;
    const selectedAll = this.meterUnitsForJobGridService.getSessionSettingsSelectedAll();
    if (!selectedAll && selectedRows && selectedRows.length > 0) {
      selectedRows.map((row) => deviceIdsParam.push(row.deviceId));
    }

    const selectedText = `${this.getSelectedCount()}`;
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.btnConfirmText = $localize`Confirm`;
    let response: Observable<any> = new Observable();

    const request: RequestMeterUnitsForJob = {
      requestId: null,
      scheduleId: this.requestModel.scheduleId,
      startRow: 0,
      endRow: 0,
      sortModel: [],
      searchModel: [],
      filterModel: null,
      deviceIds: deviceIdsParam
    };

    if (selectedAll) {
      request.searchModel = this.setSearch();

      const excludedRows = this.meterUnitsForJobGridService.getSessionSettingsExcludedRows();
      if (excludedRows && excludedRows.length > 0) {
        request.excludeIds = [];
        excludedRows.map((row) => request.excludeIds.push(row.deviceId));
      }
    }

    response = this.meterUnitsTypeService.removeMeterUnitsFromJob(request);

    component.btnConfirmText = $localize`Remove`;
    component.modalTitle = $localize`Confirm bulk operation`;
    component.modalBody = $localize`Remove ${selectedText} Meter Unit(s) from Job?`;

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        // this.toast.successToast(this.messageActionInProgress);
        response.subscribe(
          (value) => {
            // this.allForJobGridService.saveMyGridLinkRequestId(value.requestId);
            this.toast.successToast($localize`Selected Meter Units removed successfully`);
            this.refresh();
          },
          (e) => {
            this.toast.errorToast(this.messageServerError);
          }
        );
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  getBulkRequestParam(): RequestFilterParams {
    const requestParam: RequestFilterParams = {
      deviceIds: [],
      filter: null,
      search: null,
      excludeIds: null
    };

    if (this.meterUnitsForJobGridService.getSessionSettingsSelectedAll()) {
      const excludedRows = this.meterUnitsForJobGridService.getSessionSettingsExcludedRows();

      requestParam.filter = this.setFilter();
      requestParam.search = this.setSearch();
      requestParam.excludeIds = [];

      excludedRows.map((row) => requestParam.excludeIds.push(row.deviceId));
    } else {
      const selectedRows = this.meterUnitsForJobGridService.getSessionSettingsSelectedRows();
      if (selectedRows && selectedRows.length > 0) {
        selectedRows.map((row) => requestParam.deviceIds.push(row.deviceId));
      }
    }

    return requestParam;
  }

  getSelectedCount(): number {
    if (this.checkSelectedAll()) {
      const excludedRowsLength = this.meterUnitsForJobGridService.getSessionSettingsExcludedRows().length;
      return this.totalCount - excludedRowsLength;
    } else {
      return this.meterUnitsForJobGridService.getSessionSettingsSelectedRows().length;
    }
  }

  getTotalCountWithoutExcludedDisplay(): string {
    const selectedCount = this.getSelectedCount();
    if (this.checkSelectedAll()) {
      if (selectedCount === this.totalCount) {
        return `${this.totalCount}`;
      } else {
        return `${selectedCount} ${$localize`of`} ${this.totalCount}`;
      }
    } else {
      return `${selectedCount}`;
    }
  }

  toggleWildcards($event: boolean) {
    this.deselectAll();
    this.meterUnitsForJobGridService.setSessionSettingsSearchedWildcards($event);

    if (this.meterUnitsForJobGridService.getSessionSettingsSearchedText()) {
      this.meterUnitsForJobGridService.setSessionSettingsPageIndex(0);
      this.gridApi.onFilterChanged();
    }
  }
}
