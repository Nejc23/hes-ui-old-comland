import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { DcLastStatusStatus } from './../../../core/repository/interfaces/data-concentrator-units/dcu-operations/dcu-operations-params.interface';
import { GridSettingsSessionStoreService } from './../../../core/utils/services/grid-settings-session-store.service';
import { GridSearchParams } from './../../../core/repository/interfaces/helpers/grid-request-params.interface';
import { GridSettingsSessionStore } from './../../../core/utils/interfaces/grid-settings-session-store.interface';
import { SettingsStoreEmitterService } from './../../../core/repository/services/settings-store/settings-store-emitter.service';
import { DcuUnitsGridLayoutStore } from './../interfaces/dcu-units-grid-layout.store';
import { SettingsStoreService } from 'src/app/core/repository/services/settings-store/settings-store.service';
import { SidebarToggleService } from './../../../shared/base-template/components/services/sidebar.service';
import { FiltersInfo } from '../../../shared/forms/interfaces/filters-info.interface';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { AllModules, Module, GridOptions } from '@ag-grid-enterprise/all-modules';
import { DataConcentratorUnitsGridService } from '../services/data-concentrator-units-grid.service';
import { DataConcentratorUnitsStaticTextService } from '../services/data-concentrator-units-static-text.service';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DataConcentratorUnitsGridEventEmitterService } from '../services/data-concentrator-units-grid-event-emitter.service';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';

import * as moment from 'moment';
import { Subscription, Observable, of } from 'rxjs';

// consts
import { configAgGrid, gridRefreshInterval } from 'src/environments/config';
import { enumSearchFilterOperators } from 'src/environments/config';
import { GridRequestParams, GridSortParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import * as _ from 'lodash';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { AddDcuFormComponent } from './add-dcu-form/add-dcu-form.component';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { ActionEnumerator } from 'src/app/core/permissions/enumerators/action-enumerator.model';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { AgGridSharedFunctionsService } from 'src/app/shared/ag-grid/services/ag-grid-shared-functions.service';
import { GridColumnShowHideService } from 'src/app/core/ag-grid-helpers/services/grid-column-show-hide.service';
import { DcOperationsService } from '../services/dc-operations.service';
import { DcOperationTypeEnum } from '../enums/operation-type.enum';
import { capitalize } from 'lodash';
import { gridSysNameColumnsEnum } from '../../global/enums/dcu-global.enum';
import { filterOperationEnum } from '../../global/enums/filter-operation-global.enum';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { DataConcentratorUnitsOperationsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units-operations.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { GridUtils } from '../../global/grid.utils';
import { JobsSelectGridService } from '../../jobs/jobs-select/services/jobs-select-grid.service';

@Component({
  selector: 'app-data-concentrator-units',
  templateUrl: './data-concentrator-units.component.html'
})
export class DataConcentratorUnitsComponent implements OnInit, OnDestroy {
  sessionNameForGridState = 'grdStateDCU';
  sessionNameForGridFilter = 'grdLayoutDCU';

  dcuUnitsGridLayoutStoreKey = 'dcu-units-grid-layout';
  dcuUnitsGridLayoutStore: DcuUnitsGridLayoutStore;

  // grid variables
  columns = [];
  totalCount = 0;
  filtersInfo: FiltersInfo;
  private layoutChangeSubscription: Subscription;
  private dcuAddedSubscription: Subscription;
  private subscription: Subscription;
  public localeText;

  // N/A
  notAvailableText = this.staticTextService.notAvailableTekst;
  overlayNoRowsTemplate = this.staticTextService.noRecordsFound;
  overlayLoadingTemplate = this.staticTextService.loadingData;
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
  headerTitle = this.staticTextService.headerTitleDCU;

  requestModel: GridRequestParams = {
    requestId: null,
    startRow: 0,
    endRow: 0,
    sortModel: [],
    searchModel: [],
    filterModel: {
      statuses: [{ id: 0, value: '' }],
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

  messageDataFwUpgraded = $localize`FW Upgrade successful!`;
  messageActionFailed = $localize`FW Upgrade failed!`;

  taskStatusOK = 'TASK_SUCCESS';
  taskStatusFailure = 'TASK_FAILURE';
  refreshInterval = gridRefreshInterval;

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
    private jobsSelectGridService: JobsSelectGridService
  ) {
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
          this.requestModel.filterModel.statuses = event.statusesFilter;
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

  ngOnInit() {
    // set grid columns
    this.columns = this.dataConcentratorUnitsGridService.setGridDefaultColumns(false);
    // set right sidebar on the grid
    // this.sideBar = this.dataConcentratorUnitsGridService.setSideBar(); // no toopanel anymore

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
      loadingOoo: $localize`loading...`,

      selectAll: $localize`Select All`
    };

    this.bredcrumbService.setPageName(this.headerTitle);
  }

  ngOnDestroy(): void {
    if (this.layoutChangeSubscription) {
      this.layoutChangeSubscription.unsubscribe();
    }
    if (this.dcuAddedSubscription) {
      this.dcuAddedSubscription.unsubscribe();
    }

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // set momemnt text (next planned read) out of date and time
  setMomentNextPlannedReadTime(time: string) {
    return this.staticTextService.nextPlannedReadText + $localize`${moment(time).fromNow()}`;
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
      const selectedRows = this.dataConcentratorUnitsGridService.getSessionSettingsSelectedRows();
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

  // ----------------------- ag-grid set DATASOURCE ------------------------------
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.agGridSharedFunctionsService.addSelectDeselectAllText();

    this.icons = {
      filter: ''
    };

    // const dataFromCookie = this.dataConcentratorUnitsGridService.getCookieData(); // saved columns settings
    // if (dataFromCookie) {
    //   params.columnApi.setColumnState(dataFromCookie);
    // }

    // const cookieSort = this.dataConcentratorUnitsGridService.getCookieDataSortModel();
    // if (cookieSort !== undefined && cookieSort !== null) {
    //   this.gridApi.setSortModel(cookieSort);
    // }

    this.getDcuUnitsGridLayoutStore();
  }
  // ----------------------- ag-grid set DATASOURCE end --------------------------

  private noSearch() {
    if (this.requestModel.searchModel == null || this.requestModel.searchModel.length === 0) {
      return true;
    }
    return false;
  }

  private noFilters() {
    if (
      this.requestModel.filterModel == null ||
      ((this.requestModel.filterModel.statuses === undefined ||
        this.requestModel.filterModel.statuses.length === 0 ||
        this.requestModel.filterModel.statuses[0].id === 0) &&
        (this.requestModel.filterModel.readStatus === undefined || this.requestModel.filterModel.readStatus === null) &&
        (this.requestModel.filterModel.tags === undefined ||
          this.requestModel.filterModel.tags.length === 0 ||
          this.requestModel.filterModel.tags[0].id === 0) &&
        (this.requestModel.filterModel.types === undefined ||
          this.requestModel.filterModel.types.length === 0 ||
          this.requestModel.filterModel.types[0] === 0) &&
        (this.requestModel.filterModel.vendors === undefined || this.requestModel.filterModel.vendors.length === 0))
    ) {
      return true;
    }
    return false;
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

  // on close tool panel reload filter model
  // no toolpanel anymore
  /*toolPanelChanged(params) {
    if (params.source === undefined) {
      if (
        !this.dataConcentratorUnitsGridService.checkIfFilterModelAndCookieAreSame(
          this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter),
          this.requestModel.filterModel
        )
      ) {
        const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;
        this.requestModel.filterModel.statuses = filterDCU.statusesFilter;
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
        this.requestModel.filterModel.vendor = filterDCU.vendorFilter;
        this.requestModel.filterModel.types = filterDCU.typesFilter;
        this.requestModel.filterModel.tags = filterDCU.tagsFilter;
        this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
        this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
        this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    }
  }*/

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
      this.requestModel.filterModel.statuses = filterDCU.statusesFilter;
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
      filter.statusesFilter && filter.statusesFilter.length > 0,
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
      (tmpFilter.statusesFilter && tmpFilter.statusesFilter.length > 0) ||
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

  // form actions

  // click on the link "select all"
  selectAll() {
    this.dataConcentratorUnitsGridService.setSessionSettingsClearExcludedRows();
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(true);
    this.eventService.selectDeselectAll(this.gridApi.paginationGetCurrentPage());
  }

  // click on the link "deselect all"
  deselectAll() {
    this.dataConcentratorUnitsGridService.setSessionSettingsClearExcludedRows();
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
    this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(false);
    this.eventService.selectDeselectAll(-1); // -1 = deselect all
  }

  // TODO
  // tsg button click
  onTag() {
    //
  }

  // delete button click
  onDelete() {
    let selectedText = 'all';
    const object: GridBulkActionRequestParams = {
      id: [],
      filter: {
        statuses: [],
        readStatus: {
          operation: { id: '', value: '' },
          value1: 0,
          value2: 0
        },
        types: [],
        tags: [],
        showOptionFilter: null
      }
    };
    if (!this.dataConcentratorUnitsGridService.getSessionSettingsSelectedAll()) {
      const selectedRows = this.dataConcentratorUnitsGridService.getSessionSettingsSelectedRows();
      selectedRows.forEach((element) => {
        object.id.push(element.id);
      });
      object.filter = null;
      selectedText = selectedRows ? selectedRows.length.toString() : '0';
    } else {
      object.filter = this.requestModel.filterModel;
      object.id = null;
    }

    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.btnConfirmText = $localize`Delete`;
    component.modalBody = $localize`Delete` + ` ${selectedText} ` + $localize`selected Data Concentrator Units?`;

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        const request = this.dataConcentratorUnitsService.deleteDcu(object);
        this.formUtils.deleteForm(request, $localize`Selected items deleted`).subscribe(
          (response: any) => {
            this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
            this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
            this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(false);
            this.eventService.selectDeselectAll(-1);
            this.gridApi.forEachNode((node) => {
              node.setSelected(false);
            });

            this.gridApi.onFilterChanged();
          },
          () => {}
        );
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  getTotalCountWithoutExcluded(): string {
    const excludedRowsLength = this.dataConcentratorUnitsGridService.getSessionSettingsExcludedRows().length;

    if (excludedRowsLength === 0) {
      return this.totalCount.toString();
    } else {
      return `${this.totalCount - excludedRowsLength} ${$localize`of`} ${this.totalCount}`;
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
    const modalRef = this.modalService.open(AddDcuFormComponent);
    modalRef.result
      .then((result) => {
        this.refreshGrid();
      })
      .catch(() => {});
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

  toggleFilter() {
    if (this.areSettingsLoaded) {
      this.hideFilter = !this.hideFilter;
      this.saveSettingsStore(this.requestModel.sortModel);
    }
  }

  // functions for operations called from grid
  // ******************************************************************************** */
  onSynchronizeTime(selectedGuid: string) {
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

  onFwUpgrade(selectedGuid: string) {
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
    this.dcOperationsService.fwUpgrade(DcOperationTypeEnum.syncTime, params, 1);
  }

  // *******************************************************************************

  filterChanged() {
    this.reloadGrid();
    this.deselectAll();
  }

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

        // if (that.authService.isRefreshNeeded2()) {
        //   that.authService
        //     .renewToken()
        //     .then((value) => {
        //       that.authService.user = value;
        //       that.authService.saveTokenAndSetUserRights2(value, '');

        //       that.dataConcentratorUnitsService
        //         .getGridDcuForm(
        //           that.requestModel,
        //           that.dataConcentratorUnitsGridService.getSessionSettingsPageIndex(),
        //           displayedColumnsNames
        //         )
        //         .subscribe((data) => {
        //           that.gridApi.hideOverlay();
        //           if (data === undefined || data == null || data.totalCount === 0) {
        //             that.totalCount = 0;
        //             // that.noData = true;
        //             that.gridApi.showNoRowsOverlay();
        //           } else {
        //             that.totalCount = data.totalCount;
        //             // that.noData = false;
        //           }

        //           paramsRow.successCallback(data ? data.data : [], that.totalCount);

        //           that.gridApi.paginationGoToPage(that.dataConcentratorUnitsGridService.getSessionSettingsPageIndex());
        //           that.selectRows(that.gridApi);
        //           // params.failCallback();
        //           that.resizeColumns();
        //           that.isGridLoaded = true;
        //         });
        //     })
        //     .catch((err) => {
        //       if (err.message === 'login_required') {
        //         that.authService.login().catch((errDetail) => console.log(errDetail));
        //       }
        //     });
        // } else {
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
      if (settings.sortModel) {
        this.requestModel.sortModel = settings.sortModel;
        this.gridApi.setSortModel(settings.sortModel);
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

  get pageSizeProperty() {
    return 'pageSize';
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
}
