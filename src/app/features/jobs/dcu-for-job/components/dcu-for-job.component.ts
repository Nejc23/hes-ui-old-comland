import { SidebarToggleService } from '../../../../shared/base-template/components/services/sidebar.service';
import { DataConcentratorUnitsService } from '../../../../core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { GridOptions, Module } from '@ag-grid-community/core';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { configAgGrid, enumSearchFilterOperators, gridRefreshInterval } from 'src/environments/config';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { ActionEnumerator } from 'src/app/core/permissions/enumerators/action-enumerator.model';
import { AgGridSharedFunctionsService } from 'src/app/shared/ag-grid/services/ag-grid-shared-functions.service';
import { RequestDcuForJob } from 'src/app/core/repository/interfaces/jobs/dcu/dcu-for-job.interface';
import { DcuForJobGridService } from '../services/dcu-for-job-grid.service';
import { DcuForJobStaticTextService } from '../services/dcu-for-job-static-text.service';
import { DcuForJobGridEventEmitterService } from '../services/dcu-for-job-grid-event-emitter.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { RequestFilterParams } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { TranslateService } from '@ngx-translate/core';

@Component({
  // selector: 'app-meter-units-all-for-job',
  templateUrl: './dcu-for-job.component.html'
})
export class DcuForJobComponent implements OnInit, OnDestroy {
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
  loadGrid = true;
  programmaticallySelectRow = false;
  requestModel: RequestDcuForJob = {
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
      readStatus: null,
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
  messageServerError = this.translate.instant('COMMON.SERVER-ERROR');
  messageDataRefreshed = this.translate.instant('COMMON.DATA-REFRESHED') + '!';
  messageActionFailed = this.translate.instant('COMMON.ACTION-FAILED') + '!';

  public useWildcards = false;

  constructor(
    private route: ActivatedRoute,
    private dcuForJobGridService: DcuForJobGridService,
    private staticTextService: DcuForJobStaticTextService,
    private agGridSharedFunctionsService: AgGridSharedFunctionsService,
    private service: MyGridLinkService,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    private dataConcentratorUnitsService: DataConcentratorUnitsService,
    private toast: ToastNotificationService,
    private eventService: DcuForJobGridEventEmitterService,
    private authService: AuthService,
    private codelistMeterUnitsService: CodelistMeterUnitsRepositoryService,
    private modalService: ModalService,
    private jobsService: JobsService,
    private breadcrumbService: BreadcrumbService,
    private sidebarToggleService: SidebarToggleService,
    private translate: TranslateService
  ) {
    this.paramsSub = route.params.subscribe((params) => {
      this.scheduleId = params.scheduleId;
      dcuForJobGridService.dcuId = params.id;
      this.sessionNameForGridFilter = this.sessionNameForGridFilter.includes('grdLayoutMUT')
        ? this.sessionNameForGridFilter
        : 'grdLayoutMUT';

      if (this.gridApi) {
        this.gridApi.purgeServerSideCache([]);
      }

      if (this.gridColumnApi) {
        const dataFromCookie = this.dcuForJobGridService.getCookieData(); // saved columns settings
        const cookieSort = this.dcuForJobGridService.getCookieDataSortModel();

        if (dataFromCookie) {
          this.gridColumnApi.setColumnState(dataFromCookie);
        }

        if (cookieSort !== undefined && cookieSort !== null && this.gridColumnApi) {
          this.gridApi.applyColumnState({ state: cookieSort });
        }
      }
    });

    this.frameworkComponents = dcuForJobGridService.setFrameworkComponents();
    this.gridOptions = this.dcuForJobGridService.setGridOptions();
    this.useWildcards = this.dcuForJobGridService.getSessionSettingsSearchedWildcards();
    console.log(
      'this.dcuForJobGridService.getSessionSettingsSearchedWildcards()',
      this.dcuForJobGridService.getSessionSettingsSearchedWildcards()
    );
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
    this.columns = this.dcuForJobGridService.setGridDefaultColumns(false);

    this.localeText = {
      // for side panel
      columns: this.translate.instant('GRID.COLUMNS'),
      filters: this.translate.instant('GRID.FILTERS'),

      // for filter panel
      page: this.translate.instant('GRID.PAGE'),
      more: this.translate.instant('GRID.MORE'),
      to: this.translate.instant('GRID.TO'),
      of: this.translate.instant('GRID.OF'),
      next: this.translate.instant('GRID.NEXT'),
      last: this.translate.instant('GRID.LAST'),
      first: this.translate.instant('GRID.FIRST'),
      previous: this.translate.instant('GRID.PREVIOUS'),
      loadingOoo: this.translate.instant('GRID.LOADING-WITH-DOTS')
    };

    this.sidebarToggleService.eventEmitterToggleMenu.subscribe(() => {
      setTimeout(() => {
        this.gridApi.sizeColumnsToFit();
      }, 320);
    });
    // this.deleteAllRequests();
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
    return this.dcuForJobGridService.getSessionSettingsSelectedAll();
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
    if ($event !== this.dcuForJobGridService.getSessionSettingsSearchedText()) {
      this.deselectAll();
      this.dcuForJobGridService.setSessionSettingsSearchedText($event);

      const useWildcards = this.dcuForJobGridService.getSessionSettingsSearchedWildcards();
      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event, useWildcards }];

      this.dcuForJobGridService.setSessionSettingsPageIndex(0);
      this.dcuForJobGridService.setSessionSettingsSelectedRows([]);
      this.gridApi.onFilterChanged();
    }
  }

  // ag-grid
  // checking if at least one row on the grid is selected
  get selectedAtLeastOneRowOnGrid() {
    if (this.gridApi) {
      const selectedRows = this.dcuForJobGridService.getSessionSettingsSelectedRows();
      if (selectedRows && selectedRows.length > 0) {
        return true;
      }
      return false;
    }
    return false;
  }

  // click on the link "select all"
  selectAll() {
    this.dcuForJobGridService.setSessionSettingsClearExcludedRows();
    this.dcuForJobGridService.setSessionSettingsSelectedAll(true);
    this.eventService.selectDeselectAll(true);
    this.eventService.setIsSelectedAll(true);
  }

  // click on the link "deselect all"
  deselectAll() {
    this.dcuForJobGridService.setSessionSettingsClearExcludedRows();
    this.dcuForJobGridService.setSessionSettingsSelectedRows([]);
    this.dcuForJobGridService.setSessionSettingsSelectedAll(false);
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
        that.requestModel.startRow = that.dcuForJobGridService.getCurrentRowIndex().startRow;
        that.requestModel.endRow = that.dcuForJobGridService.getCurrentRowIndex().endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;
        that.requestModel.searchModel = that.setSearch();
        that.dataConcentratorUnitsService.getConcentratorsForJob(that.requestModel).subscribe((response) => {
          that.gridApi.hideOverlay();
          that.totalCount = 0;
          if (response) {
            that.setTitle(response.jobDescription);
          }

          if (response && response.grid && response.grid.totalCount > 0) {
            that.totalCount = response.grid.totalCount;
            that.gridApi.paginationGoToPage(that.dcuForJobGridService.getSessionSettingsPageIndex());
            paramsRow.successCallback(response.grid.data, response.grid.totalCount);
            that.selectRows(that.gridApi);
            that.eventService.setIsSelectedAll(that.dcuForJobGridService.getSessionSettingsSelectedAll());
          } else {
            that.gridApi.showNoRowsOverlay();
            paramsRow.successCallback([], 0);
          }
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  // ----------------------- ag-grid set DATASOURCE end --------------------------

  // ag-grid change visibillity of columns
  onColumnVisible(params) {
    this.dcuForJobGridService.onColumnVisibility(params);
  }

  // on close tool panel reload filter model
  toolPanelChanged(params) {
    if (params.source === undefined) {
      if (
        !this.dcuForJobGridService.checkIfFilterModelAndCookieAreSame(
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
        // this.requestModel.filterModel.breakerState = filterDCU.breakerStateFilter;
        this.requestModel.filterModel.showChildInfoMBus = filterDCU.showOnlyMeterUnitsWithMBusInfoFilter;
        this.requestModel.filterModel.showWithoutTemplate = filterDCU.showMeterUnitsWithoutTemplateFilter;
        this.requestModel.filterModel.readyForActivation = filterDCU.showOnlyImageReadyForActivationFilter;

        this.dcuForJobGridService.setSessionSettingsPageIndex(0);
        this.dcuForJobGridService.setSessionSettingsSelectedAll(false);
        this.dcuForJobGridService.setSessionSettingsSelectedRows([]);
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
      this.dcuForJobGridService.setSessionSettingsPageIndex(params.api.paginationGetCurrentPage());
    } else if (!params.newPage && params.keepRenderedRows && this.loadGrid) {
      this.loadGrid = false;
      params.api.paginationGoToPage(this.dcuForJobGridService.getSessionSettingsPageIndex());
    }
  }

  // if selected-all clicked, than disable deselection of the rows
  onRowSelect(params) {
    if (this.dcuForJobGridService.getSessionSettingsSelectedAll()) {
      this.dcuForJobGridService.setSessionSettingsExcludedRows(params.node);
    } else {
      this.dcuForJobGridService.setSessionSettingsSelectedRows(params.node);
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
      !this.dcuForJobGridService.checkIfFilterModelAndCookieAreSame(
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
      // this.requestModel.filterModel.breakerState = filterDCU.breakerStateFilter;
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
    const search = this.dcuForJobGridService.getSessionSettingsSearchedText();

    let useWildcards = this.dcuForJobGridService.getSessionSettingsSearchedWildcards();
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
    const selectedAll = this.dcuForJobGridService.getSessionSettingsSelectedAll();
    const selectedRows = this.dcuForJobGridService.getSessionSettingsSelectedRows();
    api.forEachNode((node) => {
      if (selectedAll) {
        const startRow = api.getFirstDisplayedRow();
        const endRow = api.getLastDisplayedRow();

        const excludedRows = this.dcuForJobGridService.getSessionSettingsExcludedRows();
        api.forEachNode((node2) => {
          if (
            node2.rowIndex >= startRow &&
            node2.rowIndex <= endRow &&
            !_.find(excludedRows, (x) => x.concentratorId === node2.data.concentratorId)
          ) {
            node2.setSelected(true);
          }
        });
      } else if (
        node.data !== undefined &&
        selectedRows !== undefined &&
        selectedRows.length > 0 &&
        !selectedAll &&
        _.find(selectedRows, (x) => x.concentratorId === node.data.concentratorId) !== undefined
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
    return (
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
        !this.requestModel.filterModel.readStatus &&
        (!this.requestModel.filterModel.firmware ||
          this.requestModel.filterModel.firmware.length === 0 ||
          this.requestModel.filterModel.firmware[0].id === 0) &&
        !this.requestModel.filterModel.showChildInfoMBus &&
        !this.requestModel.filterModel.showWithoutTemplate &&
        !this.requestModel.filterModel.readyForActivation)
    );
  }

  // set form title by selected meter unit type
  public setTitle(jobDescription?: string) {
    if (jobDescription === undefined || jobDescription.trim().length === 0) {
      jobDescription = this.staticTextService.notAvailableTekst;
    } else {
      jobDescription = this.staticTextService.headerTitleDcu + ' ' + jobDescription;
    }

    this.breadcrumbService.setPageName(jobDescription);
  }

  onRemoveFromJob() {
    const selectedRows = this.dcuForJobGridService.getSessionSettingsSelectedRows();
    const deviceIdsParam = [];
    // const selectedDeviceCount = this.totalCount;
    const selectedAll = this.dcuForJobGridService.getSessionSettingsSelectedAll();
    if (!selectedAll && selectedRows && selectedRows.length > 0) {
      selectedRows.map((row) => deviceIdsParam.push(row.concentratorId));
    }

    const selectedText = `${this.getSelectedCount()}`;
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.btnConfirmText = this.translate.instant('BUTTON.CONFIRM');
    let response: Observable<any> = new Observable();

    const request: RequestDcuForJob = {
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

      const excludedRows = this.dcuForJobGridService.getSessionSettingsExcludedRows();
      if (excludedRows && excludedRows.length > 0) {
        request.excludeIds = [];
        excludedRows.map((row) => request.excludeIds.push(row.concentratorId));
      }
    }

    response = this.dataConcentratorUnitsService.removeConcentratorsFromJob(request);

    component.btnConfirmText = this.translate.instant('COMMON.REMOVE');
    component.modalTitle = this.translate.instant('JOB.CONFIRM-BULK');
    component.modalBody = this.translate.instant('JOB.CONFIRM-BULK', { selectedText: selectedText }); //
    // `Remove ${selectedText} Concentrator(s) from Job?`;

    modalRef.result.then(
      (data) => {
        response.subscribe(
          (value) => {
            this.toast.successToast(this.translate.instant('JOB.DCU-FOR-JOB'));
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

    if (this.dcuForJobGridService.getSessionSettingsSelectedAll()) {
      const excludedRows = this.dcuForJobGridService.getSessionSettingsExcludedRows();

      requestParam.filter = this.requestModel.filterModel;
      requestParam.search = this.requestModel.searchModel;
      requestParam.excludeIds = [];

      excludedRows.map((row) => requestParam.excludeIds.push(row.deviceId));
    } else {
      const selectedRows = this.dcuForJobGridService.getSessionSettingsSelectedRows();
      if (selectedRows && selectedRows.length > 0) {
        selectedRows.map((row) => requestParam.deviceIds.push(row.deviceId));
      }
    }

    return requestParam;
  }

  getSelectedCount(): number {
    if (this.checkSelectedAll()) {
      const excludedRowsLength = this.dcuForJobGridService.getSessionSettingsExcludedRows().length;
      return this.totalCount - excludedRowsLength;
    } else {
      return this.dcuForJobGridService.getSessionSettingsSelectedRows().length;
    }
  }

  getTotalCountWithoutExcludedDisplay(): string {
    const selectedCount = this.getSelectedCount();
    if (this.checkSelectedAll()) {
      if (selectedCount === this.totalCount) {
        return `${this.totalCount}`;
      } else {
        return selectedCount + this.translate.instant('GRID.OF') + this.totalCount;
      }
    } else {
      return `${selectedCount}`;
    }
  }

  toggleWildcards($event: boolean) {
    this.deselectAll();
    this.dcuForJobGridService.setSessionSettingsSearchedWildcards($event);

    if (this.dcuForJobGridService.getSessionSettingsSearchedText()) {
      this.dcuForJobGridService.setSessionSettingsPageIndex(0);
      this.gridApi.onFilterChanged();
    }
  }
}
