import { AllModules, GridOptions, Module } from '@ag-grid-enterprise/all-modules';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { GridColumnShowHideService } from 'src/app/core/ag-grid-helpers/services/grid-column-show-hide.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { GridRequestParams, GridSortParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { DataConcentratorUnitsOperationsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units-operations.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { SettingsStoreService } from 'src/app/core/repository/services/settings-store/settings-store.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { AgGridSharedFunctionsService } from 'src/app/shared/ag-grid/services/ag-grid-shared-functions.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
// consts
import { configAgGrid, enumSearchFilterOperators, gridRefreshInterval } from 'src/environments/config';
import { SettingsStoreEmitterService } from '../../../core/repository/services/settings-store/settings-store-emitter.service';
import { SidebarToggleService } from '../../../shared/base-template/components/services/sidebar.service';
import { FiltersInfo } from '../../../shared/forms/interfaces/filters-info.interface';
import { GridUtils } from '../../global/grid.utils';
import { JobsSelectGridService } from '../../jobs/jobs-select/services/jobs-select-grid.service';
import { DcOperationTypeEnum } from '../enums/operation-type.enum';
import { DcuUnitsGridLayoutStore } from '../interfaces/dcu-units-grid-layout.store';
import { DataConcentratorUnitsGridEventEmitterService } from '../services/data-concentrator-units-grid-event-emitter.service';
import { DataConcentratorUnitsGridService } from '../services/data-concentrator-units-grid.service';
import { DataConcentratorUnitsStaticTextService } from '../services/data-concentrator-units-static-text.service';
import { DcOperationsService } from '../services/dc-operations.service';
import { AddDcuFormComponent } from './add-dcu-form/add-dcu-form.component';
import { DeleteDcuFormComponent } from './delete-dcu-form/delete-dcu-form.component';
import { OperationType } from './operations/dc-operations.component';
import { EventManagerService } from '../../../core/services/event-manager.service';

@Component({
  selector: 'app-data-concentrator-units',
  templateUrl: './data-concentrator-units-list.component.html'
})
export class DataConcentratorUnitsListComponent implements OnInit, OnDestroy {
  sessionNameForGridState = 'grdStateDCU';
  sessionNameForGridFilter = 'grdLayoutDCU';

  dcuUnitsGridLayoutStoreKey = 'dcu-units-grid-layout';
  dcuUnitsGridLayoutStore: DcuUnitsGridLayoutStore;

  // grid variables
  columns = [];
  totalCount = 0;
  filtersInfo: FiltersInfo;
  public localeText;
  // N/A
  notAvailableText = this.staticTextService.notAvailableTekst;
  overlayNoRowsTemplate = this.translate.instant('GRID.NO-RECORDS-FOUND');
  overlayLoadingTemplate = this.translate.instant('COMMON.LOADING-DATA');
  noData = false;
  public hideFilter = true;
  public filterCount = 0;
  // ---------------------- ag-grid ------------------
  agGridSettings = configAgGrid;
  public modules: Module[] = AllModules;
  public gridOptions: Partial<GridOptions>;
  public gridApi;
  public gridColumnApi;
  public icons;
  public frameworkComponents;
  public sideBar;
  requestModel: GridRequestParams = {
    requestId: null,
    startRow: 0,
    endRow: 0,
    sortModel: [],
    searchModel: [],
    filterModel: {
      states: [{ id: 0, value: '' }],
      readStatus: {
        operation: { id: '', value: '' },
        value1: 0,
        value2: null
      },
      types: [0],
      tags: [{ id: 0, value: '' }],
      showOptionFilter: []
    }
  };
  pageSizes: Codelist<number>[] = [
    { id: 20, value: '20' },
    { id: 50, value: '50' },
    { id: 100, value: '100' }
  ];
  selectedPageSize: Codelist<number> = this.pageSizes[0];
  form: FormGroup;
  datasource: any;
  isGridLoaded = false;
  areSettingsLoaded = false;
  messageDataFwUpgraded = this.translate.instant('DCU.FW-UPGRADE-SUCCESSFUL');
  messageActionFailed = this.translate.instant('DCU.FW-UPGRADE-FAILED');
  taskStatusOK = 'TASK_SUCCESS';
  taskStatusFailure = 'TASK_FAILURE';
  refreshInterval = gridRefreshInterval;
  componentType = OperationType;
  private layoutChangeSubscription: Subscription;
  private dcuAddedSubscription: Subscription;
  private dcuConcentratorDeleted: Subscription;
  private subscription: Subscription;

  constructor(
    private dataConcentratorUnitsGridService: DataConcentratorUnitsGridService,
    private staticTextService: DataConcentratorUnitsStaticTextService,
    public gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private dataConcentratorUnitsService: DataConcentratorUnitsService,
    private eventService: DataConcentratorUnitsGridEventEmitterService,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    private modalService: ModalService,
    private formUtils: FormsUtilsService,
    private authService: AuthService,
    private agGridSharedFunctionsService: AgGridSharedFunctionsService,
    private gridColumnShowHideService: GridColumnShowHideService,
    private bredcrumbService: BreadcrumbService,
    private dcOperationsService: DcOperationsService,
    private settingsStoreService: SettingsStoreService,
    private settingsStoreEmitterService: SettingsStoreEmitterService,
    private sidebarToggleService: SidebarToggleService,
    public fb: FormBuilder,
    private dcuOperationsService: DataConcentratorUnitsOperationsService,
    private toast: ToastNotificationService,
    private jobsSelectGridService: JobsSelectGridService,
    private translate: TranslateService,
    private eventsService: EventManagerService
  ) {
    this.eventsService.getCustom('RefreshConcentratorEvent').subscribe((res) => {
      this.refreshGrid();
    });
    this.filtersInfo = {
      isSet: false,
      count: 0,
      text: staticTextService.noFilterAppliedTekst
    };

    this.frameworkComponents = dataConcentratorUnitsGridService.setFrameworkComponents();
    this.gridOptions = this.dataConcentratorUnitsGridService.setGridOptions(this);
    this.layoutChangeSubscription = this.eventService.eventEmitterLayoutChange.subscribe({
      next: (event: DcuLayout) => {
        if (event !== null) {
          this.requestModel.filterModel.states = event.statesFilter;
          this.requestModel.filterModel.readStatus.operation = event.readStatusFilter.operation;
          this.requestModel.filterModel.readStatus.value1 = event.readStatusFilter.value1;
          this.requestModel.filterModel.readStatus.value2 = event.readStatusFilter.value2;
          this.requestModel.filterModel.vendors = event.vendorsFilter;
          this.requestModel.filterModel.types = event.typesFilter.map((t) => t.id);
          this.requestModel.filterModel.tags = event.tagsFilter;
          this.gridColumnApi.setColumnState(event.gridLayout);
          this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
          this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
          this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
        }
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    });
    this.dcuAddedSubscription = this.eventService.eventEmitterDcuAdded.subscribe({
      next: (dcu: DataConcentratorUnitsList) => {
        if (dcu) {
          this.dataConcentratorUnitsService.dcuSync();
          this.refreshGrid();
        }
      }
    });

    // subscribe to changes of columns visibility from other components
    this.subscription = gridColumnShowHideService.listOfColumnsVisibilityChanged$.subscribe((listOfVisibleColumns) => {
      gridColumnShowHideService.refreshGridWithColumnsVisibility(this.gridColumnApi, listOfVisibleColumns);
    });

    this.form = this.createForm(this.pageSizes[0]);
  }

  // form - rights
  // get formFunctionality() {
  //   return FunctionalityEnumerator.DCU;
  // }
  // actions - rights
  // get actionDCUUpgrade() {
  //   return ActionEnumerator.DCUUpgrade;
  // }
  // get actionDCUConfiguration() {
  //   return ActionEnumerator.DCUConfiguration;
  // }

  get permissionAdd() {
    return PermissionEnumerator.Manage_Concentrators;
  }

  // checking if at least one row on the grid is selected
  get selectedAtLeastOneRowOnGrid() {
    if (this.gridApi) {
      const selectedRows = this.dataConcentratorUnitsGridService.getSessionSettingsSelectedRows();
      return selectedRows && selectedRows.length > 0;
    }
    return false;
  }

  get pageSizeProperty() {
    return 'pageSize';
  }

  // ag-grid

  ngOnInit() {
    // set grid columns
    this.columns = this.dataConcentratorUnitsGridService.setGridDefaultColumns(false);
    // set right sidebar on the grid
    // this.sideBar = this.dataConcentratorUnitsGridService.setSideBar(); // no toopanel anymore

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
      loadingOoo: this.translate.instant('GRID.LOADING-WITH-DOTS'),

      selectAll: this.translate.instant('GRID.SELECT-ALL')
    };

    this.bredcrumbService.setPageName('');

    this.dcuConcentratorDeleted = this.eventService.eventEmitterConcentratorDeleted.subscribe((x) => {
      this.deselectAll();
      this.refreshGrid();
    });
  }

  // ag-grid

  ngOnDestroy(): void {
    if (this.layoutChangeSubscription) {
      this.layoutChangeSubscription.unsubscribe();
    }
    if (this.dcuAddedSubscription) {
      this.dcuAddedSubscription.unsubscribe();
    }
    if (this.dcuConcentratorDeleted) {
      this.dcuConcentratorDeleted.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // ag-grid

  // button click refresh grid
  refreshGrid() {
    this.gridApi.purgeServerSideCache([]);
  }

  // search string changed call get data
  searchData($event: string) {
    if (this.isGridLoaded && this.areSettingsLoaded) {
      if ($event !== this.dataConcentratorUnitsGridService.getSessionSettingsSearchedText()) {
        this.deselectAll();
        this.dataConcentratorUnitsGridService.setSessionSettingsSearchedText($event);

        const useWildcards = this.dataConcentratorUnitsGridService.getSessionSettingsSearchedWildcards();

        this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event, useWildcards }];

        this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
        this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
        this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
        this.gridApi.onFilterChanged();
      }
    }
  }

  // ----------------------- ag-grid set DATASOURCE end --------------------------

  // ----------------------- ag-grid set DATASOURCE ------------------------------
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.agGridSharedFunctionsService.addSelectDeselectAllText();

    this.icons = {
      filter: ''
    };

    this.getDcuUnitsGridLayoutStore();
  }

  onFirstDataRendered(params) {}

  // ag-grid change visibillity of columns
  onColumnVisible(params) {
    this.dataConcentratorUnitsGridService.onColumnVisibility(params);

    if (this.isGridLoaded && this.areSettingsLoaded) {
      this.saveSettingsStore(this.requestModel.sortModel);
    }
    this.resizeColumns();
  }

  // click on check-box in the grid
  onSelectionChanged() {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }
    // this.eventService.checkChange(true);
  }

  setSearch() {
    const search = this.dataConcentratorUnitsGridService.getSessionSettingsSearchedText();

    let useWildcards = this.dataConcentratorUnitsGridService.getSessionSettingsSearchedWildcards();
    if (!useWildcards) {
      useWildcards = false;
    }

    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search, useWildcards }]);
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
      this.requestModel.filterModel.states = filterDCU.statesFilter;
      this.requestModel.filterModel.readStatus = {
        operation: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.operation : { id: '', value: '' },
        value1: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value1 : 0,
        value2: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value2 : 0
      };

      this.requestModel.filterModel.types = filterDCU.typesFilter?.map((t) => t.id);
      this.requestModel.filterModel.tags = filterDCU.tagsFilter;
      this.requestModel.filterModel.vendors = filterDCU.vendorsFilter;
    } else {
      this.setFilterInfo();
    }
    return this.requestModel.filterModel;
  }

  // fill text in header - about selected filters
  setFilterInfo() {
    const filter = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;

    this.filtersInfo = this.staticTextService.getFiltersInfo(
      filter.name,
      filter.statesFilter && filter.statesFilter.length > 0,
      filter.readStatusFilter && filter.readStatusFilter.operation && filter.readStatusFilter.operation.id.length > 0 ? true : false,
      filter.typesFilter && filter.typesFilter.length > 0,
      filter.vendorsFilter && filter.vendorsFilter.length > 0 ? true : false,
      filter.tagsFilter && filter.tagsFilter.length > 0
    );
  }

  isFilterSet(): boolean {
    const tmpFilter: DcuLayout = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;
    return (
      (tmpFilter.name !== '' && tmpFilter.name !== undefined) ||
      (tmpFilter.statesFilter && tmpFilter.statesFilter.length > 0) ||
      (tmpFilter.readStatusFilter && tmpFilter.readStatusFilter.operation && tmpFilter.readStatusFilter.operation.id.length > 0) ||
      (tmpFilter.typesFilter && tmpFilter.typesFilter.length > 0) ||
      (tmpFilter.vendorsFilter &&
        tmpFilter.vendorsFilter.length > 0 &&
        tmpFilter.vendorsFilter[0].value &&
        tmpFilter.vendorsFilter[0].value !== undefined &&
        tmpFilter.vendorsFilter[0].value !== '') ||
      (tmpFilter.tagsFilter && tmpFilter.tagsFilter.length > 0)
    );
  }

  clearFilter() {
    this.gridFilterSessionStoreService.clearGridLayout();
    this.refreshGrid();
  }

  reloadGrid() {
    this.refreshGrid();
  }

  // on change page in the grid
  onPaginationChange(params) {
    const currentApiPage = params.api.paginationGetCurrentPage();
    const currentSessionPage = this.dataConcentratorUnitsGridService.getSessionSettingsPageIndex();

    if (currentApiPage !== currentSessionPage) {
      if (this.isGridLoaded && this.areSettingsLoaded) {
        if (params.newPage) {
          this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(currentApiPage);
        }
      } else {
        // params.api.paginationGoToPage(currentSessionPage);
      }
    }
  }

  // check if "select all" was clicked
  checkSelectedAll() {
    return this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll();
  }

  // if selected-all clicked, than disable deselection of the rows
  onRowSelect(params) {
    if (this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll()) {
      this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows(params.node);
    } else {
      this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows(params.node);
    }
  }

  // select rows on load grid from session
  selectRows(api: any) {
    const selectedRows = this.dataConcentratorUnitsGridService.getSessionSettingsSelectedRows();
    api.forEachNode((node) => {
      if (this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll()) {
        const startRow = api.getFirstDisplayedRow();
        const endRow = api.getLastDisplayedRow();
        const excludedRows = this.dataConcentratorUnitsGridService.getSessionSettingsExcludedRows();
        api.forEachNode((node2) => {
          if (node2.rowIndex >= startRow && node2.rowIndex <= endRow && !_.find(excludedRows, (x) => x.id === node2.data.id)) {
            node2.setSelected(true);
          }
        });
      } else if (
        node.data !== undefined &&
        selectedRows !== undefined &&
        selectedRows.length > 0 &&
        !this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll() &&
        _.find(selectedRows, (x) => x.id === node.data.id && !node.selected) !== undefined
      ) {
        node.setSelected(true);
      }
    });
  }

  // click on the link "select all"
  selectAll() {
    this.dataConcentratorUnitsGridService.setSessionSettingsClearExcludedRows();
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(true);
    this.eventService.selectDeselectAll(this.gridApi.paginationGetCurrentPage());
  }

  // form actions

  // click on the link "deselect all"
  deselectAll() {
    this.dataConcentratorUnitsGridService.setSessionSettingsClearExcludedRows();
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
    this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(false);
    this.eventService.selectDeselectAll(-1); // -1 = deselect all
  }

  // tsg button click
  onTag() {
    //
  }

  // TODO

  onDelete(selectedGuid?: string) {
    const params = this.dcOperationsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getAllDisplayedColumnsNames()
    );

    const modalRef = this.modalService.open(DeleteDcuFormComponent);
    const component: DeleteDcuFormComponent = modalRef.componentInstance;
    component.applyRequestParams(params, this.getSelectedCount());
  }

  getTotalCountWithoutExcluded(): string {
    const excludedRowsLength = this.dataConcentratorUnitsGridService.getSessionSettingsExcludedRows().length;
    if (excludedRowsLength === 0) {
      return this.totalCount.toString();
    } else {
      return this.translate.instant('GRID.SELECTED-OF-ALL', { selected: this.totalCount - excludedRowsLength, all: this.totalCount });
    }
  }

  getSelectedCount(): number {
    if (this.checkSelectedAll()) {
      const excludedRowsLength = this.dataConcentratorUnitsGridService.getSessionSettingsExcludedRows().length;
      return this.totalCount - excludedRowsLength;
    } else {
      return this.dataConcentratorUnitsGridService.getSessionSettingsSelectedRows().length;
    }
  }

  addDcu() {
    this.jobsSelectGridService.clearSessionSettingsSelectedRows();
    const options: NgbModalOptions = {
      size: 'lg'
    };
    const modalRef = this.modalService.open(AddDcuFormComponent, options);
    modalRef.result
      .then((result) => {
        this.refreshGrid();
      })
      .catch(() => {});
  }

  toggleFilter() {
    if (this.areSettingsLoaded) {
      this.hideFilter = !this.hideFilter;
      this.saveSettingsStore(this.requestModel.sortModel);
    }
  }

  // ******************************************************************************** */
  onSynchronizeTime(selectedGuid?: string) {
    this.requestModel.filterModel = this.setFilter();
    this.requestModel.searchModel = this.setSearch();

    // const params = this.dcOperationsService.getOperationRequestParam(selectedGuid, this.requestModel, 1);
    // const params = this.dcOperationsService.getOperationRequestParamOld(selectedGuid, this.requestModel);
    const params = this.dcOperationsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getAllDisplayedColumnsNames()
    );
    this.dcOperationsService.bulkOperation(DcOperationTypeEnum.syncTime, params, 1);
  }

  // functions for operations called from grid

  onFwUpgrade(selectedGuid?: string) {
    this.requestModel.filterModel = this.setFilter();
    this.requestModel.searchModel = this.setSearch();

    // const params = this.dcOperationsService.getOperationRequestParam(selectedGuid, this.requestModel, 1);
    // const params = this.dcOperationsService.getOperationRequestParamOld(selectedGuid, this.requestModel);
    const params = this.dcOperationsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getAllDisplayedColumnsNames()
    );
    this.dcOperationsService.fwUpgrade(params, 1);
  }

  onDeviceDiscovery(selectedGuid?: string) {
    this.requestModel.filterModel = this.setFilter();
    this.requestModel.searchModel = this.setSearch();

    // const params = this.dcOperationsService.getOperationRequestParam(selectedGuid, this.requestModel, 1);
    // const params = this.dcOperationsService.getOperationRequestParamOld(selectedGuid, this.requestModel);
    const params = this.dcOperationsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getAllDisplayedColumnsNames()
    );
    this.dcOperationsService.bulkOperation(DcOperationTypeEnum.deviceDiscovery, params, 1);
  }

  filterChanged() {
    this.reloadGrid();
    this.deselectAll();
  }

  // *******************************************************************************

  gridSizeChanged() {
    this.resizeColumns();
  }

  getAllDisplayedColumnsNames(): string[] {
    if (this.gridColumnApi) {
      const columns = this.gridColumnApi.getAllDisplayedColumns();
      return columns.map((c) => c.colId);
    }
    return;
  }

  resizeColumns() {
    GridUtils.resizeColumns(this.gridColumnApi, this.gridOptions);
  }

  setGridDataSource() {
    const that = this;
    that.datasource = {
      getRows(paramsRow) {
        if (!that.areSettingsLoaded) {
          return;
        }

        const displayedColumnsNames = that.getAllDisplayedColumnsNames();

        that.requestModel.startRow = that.dataConcentratorUnitsGridService.getCurrentRowIndex(that.selectedPageSize.id).startRow;
        that.requestModel.endRow = that.dataConcentratorUnitsGridService.getCurrentRowIndex(that.selectedPageSize.id).endRow;

        that.requestModel.sortModel = paramsRow.request.sortModel;
        that.requestModel.filterModel = that.setFilter();
        that.requestModel.searchModel = that.setSearch();

        if (that.isGridLoaded) {
          that.saveSettingsStore(that.requestModel.sortModel);
        }

        that.dataConcentratorUnitsService
          .getGridDcuForm(that.requestModel, that.dataConcentratorUnitsGridService.getSessionSettingsPageIndex(), displayedColumnsNames)
          .subscribe((data) => {
            that.gridApi.hideOverlay();

            if (data === undefined || data == null || data.totalCount === 0) {
              that.totalCount = 0;
              that.gridApi.showNoRowsOverlay();
              // that.noData = true;
            } else {
              that.totalCount = data.totalCount;
              // that.noData = false;
            }

            paramsRow.successCallback(data ? data.data : [], that.totalCount);
            // params.failCallback();
            that.gridApi.paginationGoToPage(that.dataConcentratorUnitsGridService.getSessionSettingsPageIndex());

            that.resizeColumns();
            that.selectRows(that.gridApi);
            that.isGridLoaded = true;
          });
        // }
      }
    };
    that.gridApi.setServerSideDatasource(that.datasource);
  }

  getDcuUnitsGridLayoutStore() {
    this.settingsStoreService.getCurrentUserSettings(this.dcuUnitsGridLayoutStoreKey).subscribe(
      (settings) => {
        this.dcuUnitsGridLayoutStore = settings as DcuUnitsGridLayoutStore;
        this.addSettingsToSession(settings);
        this.areSettingsLoaded = true;
        this.setGridDataSource();
        this.gridColumnShowHideService.sendColumnVisibilityChanged(this.gridColumnApi);
      },
      (error) => {
        this.areSettingsLoaded = true;
        this.setGridDataSource();
        this.gridColumnShowHideService.sendColumnVisibilityChanged(this.gridColumnApi);
      }
    );
  }

  addSettingsToSession(settings: DcuUnitsGridLayoutStore) {
    if (settings) {
      if (settings.currentPageIndex) {
        this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(settings.currentPageIndex);
      }

      if (settings.dcuLayout) {
        this.gridFilterSessionStoreService.setGridLayout(this.sessionNameForGridFilter, settings.dcuLayout);
      }
      if (settings.sortModel && this.gridColumnApi) {
        this.requestModel.sortModel = settings.sortModel;
        this.gridColumnApi.applyColumnState({ state: settings.sortModel });
      }

      if (settings.searchText) {
        this.dataConcentratorUnitsGridService.setSessionSettingsSearchedText(settings.searchText);
      }

      if (settings.searchWildcards) {
        this.dataConcentratorUnitsGridService.setSessionSettingsSearchedWildcards(settings.searchWildcards);
      }

      if (settings.visibleColumns && settings.visibleColumns.length > 0) {
        this.gridColumnShowHideService.listOfColumnsVisibilityChanged(settings.visibleColumns);
      }

      if (settings.pageSize) {
        this.selectedPageSize = settings.pageSize;
        this.form.get(this.pageSizeProperty).setValue(this.selectedPageSize);
        this.setGridPageSize();
      }

      this.hideFilter = settings.hideFilter;

      this.settingsStoreEmitterService.settingsLoaded();
    }
  }

  saveSettingsStore(sortModel?: GridSortParams[]) {
    const store: DcuUnitsGridLayoutStore = {
      currentPageIndex: this.dataConcentratorUnitsGridService.getSessionSettingsPageIndex(),
      dcuLayout: this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout,
      sortModel: sortModel ? sortModel : this.dcuUnitsGridLayoutStore.sortModel,
      searchText: this.dataConcentratorUnitsGridService.getSessionSettingsSearchedText(),
      searchWildcards: this.dataConcentratorUnitsGridService.getSessionSettingsSearchedWildcards(),
      visibleColumns: this.getAllDisplayedColumnsNames(),
      pageSize: this.selectedPageSize,
      hideFilter: this.hideFilter
    };

    if (
      !this.dcuUnitsGridLayoutStore ||
      store.currentPageIndex !== this.dcuUnitsGridLayoutStore.currentPageIndex ||
      JSON.stringify(store.dcuLayout) !== JSON.stringify(this.dcuUnitsGridLayoutStore.dcuLayout) ||
      JSON.stringify(store.sortModel) !== JSON.stringify(this.dcuUnitsGridLayoutStore.sortModel) ||
      store.searchText !== this.dcuUnitsGridLayoutStore.searchText ||
      store.searchWildcards !== this.dcuUnitsGridLayoutStore.searchWildcards ||
      JSON.stringify(store.visibleColumns) !== JSON.stringify(this.dcuUnitsGridLayoutStore.visibleColumns) ||
      JSON.stringify(store.pageSize) !== JSON.stringify(this.dcuUnitsGridLayoutStore.pageSize) ||
      store.hideFilter !== this.dcuUnitsGridLayoutStore.hideFilter
    ) {
      this.settingsStoreService.saveCurrentUserSettings(this.dcuUnitsGridLayoutStoreKey, store);
      this.dcuUnitsGridLayoutStore = store;
    }
  }

  createForm(pageSize: Codelist<number>): FormGroup {
    return this.fb.group({
      [this.pageSizeProperty]: pageSize
    });
  }

  pageSizeChanged(selectedValue: any) {
    if (this.isGridLoaded && this.areSettingsLoaded) {
      this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
      this.selectedPageSize = selectedValue;
      this.setGridPageSize();
    }
  }

  setGridPageSize() {
    const api: any = this.gridApi;
    api.gridOptionsWrapper.setProperty('cacheBlockSize', this.selectedPageSize.id);
    this.gridApi.setServerSideDatasource(this.datasource);
  }

  toggleWildcards($event: boolean) {
    if (this.isGridLoaded && this.areSettingsLoaded) {
      if ($event !== this.dataConcentratorUnitsGridService.getSessionSettingsSearchedWildcards()) {
        this.dataConcentratorUnitsGridService.setSessionSettingsSearchedWildcards($event);

        if (this.dataConcentratorUnitsGridService.getSessionSettingsSearchedText()) {
          this.deselectAll();
          // const value = this.dataConcentratorUnitsGridService.getSessionSettingsSearchedText();
          // this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value, useWildcards: $event  }];

          this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
          this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
          this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
          this.gridApi.onFilterChanged();
        } else {
          this.saveSettingsStore(this.requestModel.sortModel);
        }
      }
    }
  }

  refresh() {
    const requestIds = this.dataConcentratorUnitsGridService.getAllDcOperationRequestIds();

    if (requestIds && requestIds.length > 0) {
      requestIds.map((requestId) =>
        this.dcuOperationsService.getDcLastStatus(requestId).subscribe((results) => {
          if (results && results.tasks && results.tasks.length > 0) {
            const lastStatus = results.tasks[0].status;
            if (lastStatus.status === this.taskStatusOK) {
              this.dataConcentratorUnitsGridService.removeDcOperationRequestId(requestId);
              this.toast.successToast(this.messageDataFwUpgraded);
            } else if (lastStatus.status === this.taskStatusFailure) {
              this.toast.errorToast(this.messageActionFailed);
              this.dataConcentratorUnitsGridService.removeDcOperationRequestId(requestId);
            }
          }
        })
      );
      this.refreshGrid();
    }
  }

  onEnableDC(selectedGuid?: string) {
    this.requestModel.filterModel = this.setFilter();
    this.requestModel.searchModel = this.setSearch();

    // const params = this.dcOperationsService.getOperationRequestParam(selectedGuid, this.requestModel, 1);
    // const params = this.dcOperationsService.getOperationRequestParamOld(selectedGuid, this.requestModel);
    const params = this.dcOperationsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getAllDisplayedColumnsNames()
    );
    this.dcOperationsService.bulkOperation(DcOperationTypeEnum.enable, params, 1);
  }

  onDisableDC(selectedGuid?: string) {
    this.requestModel.filterModel = this.setFilter();
    this.requestModel.searchModel = this.setSearch();

    // const params = this.dcOperationsService.getOperationRequestParam(selectedGuid, this.requestModel, 1);
    // const params = this.dcOperationsService.getOperationRequestParamOld(selectedGuid, this.requestModel);
    const params = this.dcOperationsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getAllDisplayedColumnsNames()
    );
    this.dcOperationsService.bulkOperation(DcOperationTypeEnum.disable, params, 1);
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
      ((this.requestModel.filterModel.states === undefined ||
        this.requestModel.filterModel.states.length === 0 ||
        this.requestModel.filterModel.states[0].id === 0) &&
        (this.requestModel.filterModel.readStatus === undefined || this.requestModel.filterModel.readStatus === null) &&
        (this.requestModel.filterModel.tags === undefined ||
          this.requestModel.filterModel.tags.length === 0 ||
          this.requestModel.filterModel.tags[0].id === 0) &&
        (this.requestModel.filterModel.types === undefined ||
          this.requestModel.filterModel.types.length === 0 ||
          this.requestModel.filterModel.types[0] === 0) &&
        (this.requestModel.filterModel.vendors === undefined || this.requestModel.filterModel.vendors.length === 0))
    );
  }
}
