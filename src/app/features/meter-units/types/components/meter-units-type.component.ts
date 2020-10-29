import { SidebarToggleService } from './../../../../shared/base-template/components/services/sidebar.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MeterUnitsTypeGridService } from '../services/meter-units-type-grid.service';
import { MeterUnitsTypeStaticTextService } from '../services/meter-units-type-static-text.service';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MeterUnitsTypeGridEventEmitterService } from '../services/meter-units-type-grid-event-emitter.service';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { GridOptions, Module } from '@ag-grid-community/core';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { configAgGrid, enumSearchFilterOperators, gridRefreshInterval } from 'src/environments/config';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { MeterUnitsTypeEnum } from '../enums/meter-units-type.enum';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { ActionEnumerator } from 'src/app/core/permissions/enumerators/action-enumerator.model';
import { AgGridSharedFunctionsService } from 'src/app/shared/ag-grid/services/ag-grid-shared-functions.service';
import { GridColumnShowHideService } from 'src/app/core/ag-grid-helpers/services/grid-column-show-hide.service';
import { MeterUnitsPlcActionsService } from '../services/meter-units-plc-actions.service';
import { FiltersInfo } from 'src/app/shared/forms/interfaces/filters-info.interface';

@Component({
  selector: 'app-meter-units-type',
  templateUrl: './meter-units-type.component.html'
})
export class MeterUnitsTypeComponent implements OnInit, OnDestroy {
  id = 0;
  private paramsSub: Subscription;
  private subscription: Subscription;
  sessionNameForGridFilter = 'grdLayoutMUT-typeId-';
  headerTitle = '';
  // taskStatusOK = 'TASK_PREREQ_FAILURE'; // TODO: ONLY FOR DEBUG !!!
  taskStatusOK = 'TASK_SUCCESS';
  refreshInterval = gridRefreshInterval;

  // grid variables
  columns = [];
  totalCount = 0;
  filtersInfo: FiltersInfo;
  private layoutChangeSubscription: Subscription;

  // N/A
  notAvailableText = this.staticTextService.notAvailableTekst;
  overlayNoRowsTemplate = this.staticTextService.noRecordsFound;
  overlayLoadingTemplate = this.staticTextService.loadingData;
  noData = false;

  meterTypes$: Codelist<number>[] = [];
  public hideFilter = false;

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
  requestModel: GridRequestParams = {
    requestId: null,
    startRow: 0,
    endRow: 0,
    sortModel: [],
    searchModel: [],
    filterModel: {
      statuses: [{ id: 0, value: '' }],
      tags: [{ id: 0, value: '' }],
      vendor: { id: 0, value: '' },
      readStatus: {
        operation: { id: '', value: '' },
        value1: 0,
        value2: null
      },
      firmware: [{ id: 0, value: '' }],
      disconnectorState: [{ id: 0, value: '' }],
      ciiState: [{ id: 0, value: '' }],
      showChildInfoMBus: false,
      showWithoutTemplate: false
    }
  };

  requestId = '';
  dataResult = '';
  dataStatusResponse = '';
  dataResult2 = '';
  public localeText;

  messageDataRefreshed = $localize`Data refreshed!`;
  messageActionFailed = $localize`Action failed!`;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private staticTextService: MeterUnitsTypeStaticTextService,
    public gridSettingsCookieStoreService: GridSettingsCookieStoreService,
    private meterUnitsTypeService: MeterUnitsService,
    private eventService: MeterUnitsTypeGridEventEmitterService,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    private codelistMeterUnitsService: CodelistMeterUnitsRepositoryService,
    private service: MyGridLinkService,
    private authService: AuthService,
    private toast: ToastNotificationService,
    private agGridSharedFunctionsService: AgGridSharedFunctionsService,
    private gridColumnShowHideService: GridColumnShowHideService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private plcActionsService: MeterUnitsPlcActionsService,
    private sidebarToggleService: SidebarToggleService
  ) {
    this.filtersInfo = {
      isSet: false,
      count: 0,
      text: staticTextService.noFilterAppliedTekst
    };

    this.setTitle(-1);
    this.paramsSub = route.params.subscribe(params => {
      this.id = params.id;
      meterUnitsTypeGridService.meterUnitsTypeId = params.id;
      this.sessionNameForGridFilter = this.sessionNameForGridFilter.includes('grdLayoutMUT-typeId-' + params.id)
        ? this.sessionNameForGridFilter
        : 'grdLayoutMUT-typeId-' + params.id;

      if (this.gridApi) {
        this.gridApi.purgeServerSideCache([]);
      }

      if (this.gridColumnApi) {
        const dataFromCookie = this.meterUnitsTypeGridService.getCookieData(); // saved columns settings
        if (dataFromCookie) {
          this.gridColumnApi.setColumnState(dataFromCookie);
        }
      }

      if (this.gridApi) {
        const cookieSort = this.meterUnitsTypeGridService.getCookieDataSortModel();
        if (cookieSort !== undefined && cookieSort !== null) {
          this.gridApi.setSortModel(cookieSort);
        }
      }

      // set title by selected meter unit type
      if (this.meterTypes$.length === 0) {
        this.codelistMeterUnitsService.meterUnitTypeCodelist().subscribe(data => {
          this.meterTypes$ = data;
          this.setTitle(this.id);
        });
      } else {
        this.setTitle(this.id);
      }
    });

    this.frameworkComponents = meterUnitsTypeGridService.setFrameworkComponents();
    this.gridOptions = this.meterUnitsTypeGridService.setGridOptions(this);
    this.layoutChangeSubscription = this.eventService.eventEmitterLayoutChange.subscribe({
      next: (event: MeterUnitsLayout) => {
        if (event !== null) {
          this.requestModel.filterModel.statuses = event.statusesFilter;
          this.requestModel.filterModel.vendor = event.vendorFilter;
          this.requestModel.filterModel.tags = event.tagsFilter;
          this.requestModel.filterModel.readStatus.operation = event.readStatusFilter.operation;
          this.requestModel.filterModel.readStatus.value1 = event.readStatusFilter.value1;
          this.requestModel.filterModel.readStatus.value2 = event.readStatusFilter.value2;
          this.requestModel.filterModel.firmware = event.firmwareFilter;
          this.requestModel.filterModel.disconnectorState = event.breakerStateFilter;
          this.requestModel.filterModel.ciiState = event.ciiStateFilter;
          this.requestModel.filterModel.showChildInfoMBus = event.showOnlyMeterUnitsWithMBusInfoFilter;
          this.requestModel.filterModel.showWithoutTemplate = event.showMeterUnitsWithoutTemplateFilter;
          this.requestModel.filterModel.readyForActivation = event.showOnlyImageReadyForActivationFilter;
          this.gridColumnApi.setColumnState(event.gridLayout);
          this.meterUnitsTypeGridService.setSessionSettingsPageIndex(0);
          this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
          this.meterUnitsTypeGridService.setSessionSettingsExcludedRows([]);
        }
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    });

    // subscribe to changes of columns visibility from other components
    this.subscription = gridColumnShowHideService.listOfColumnsVisibilityChanged$.subscribe(listOfVisibleColumns => {
      gridColumnShowHideService.refreshGridWithColumnsVisibility(this.gridColumnApi, listOfVisibleColumns);
    });
  }

  // form - rights
  get formFunctionality() {
    return FunctionalityEnumerator.MU;
  }
  // actions - rights
  get actionMUBreakerStatus() {
    return ActionEnumerator.MUBreakerStatus;
  }
  get actionMUConnect() {
    return ActionEnumerator.MUConnect;
  }
  get actionMUDisconnect() {
    return ActionEnumerator.MUDisconnect;
  }
  get actionMUCiiState() {
    return ActionEnumerator.MUCiiState;
  }
  get actionMUCiiActivate() {
    return ActionEnumerator.MUCiiActivate;
  }
  get actionMUCiiDeactivate() {
    return ActionEnumerator.MUCiiDeactivate;
  }
  get actionMUReadJobs() {
    return ActionEnumerator.MUReadJobs;
  }
  get actionMUSetLimiter() {
    return ActionEnumerator.MUSetLimiter;
  }
  get actionMUTOU() {
    return ActionEnumerator.MUTOU;
  }
  get actionMUUpgrade() {
    return ActionEnumerator.MUUpgrade;
  }

  // set form title by selected meter unit type
  private setTitle(id: number) {
    const selectedType = this.meterTypes$.find(x => x.id === id);
    if (selectedType !== undefined && selectedType != null) {
      this.headerTitle = selectedType.value + ' ' + this.staticTextService.headerTitleMeterUnitsType;
    } else {
      this.headerTitle = this.staticTextService.headerTitleMeterUnitsType;
    }

    this.breadcrumbService.setPageName(this.headerTitle);
  }

  ngOnInit() {
    // set grid columns
    this.columns = this.meterUnitsTypeGridService.setGridDefaultColumns(false);
    // set right sidebar on the grid
    // this.sideBar = this.meterUnitsTypeGridService.setSideBar(); // no sidebar anymore

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

    this.deleteAllRequests();

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

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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
      const selectedRows = this.meterUnitsTypeGridService.getSessionSettingsSelectedRows();
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
    this.deselectAll();
    if ($event !== this.meterUnitsTypeGridService.getSessionSettingsSearchedText()) {
      this.meterUnitsTypeGridService.setSessionSettingsSearchedText($event);
      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event }];

      this.meterUnitsTypeGridService.setSessionSettingsPageIndex(0);
      this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
      this.meterUnitsTypeGridService.setSessionSettingsExcludedRows([]);
      this.gridApi.onFilterChanged();
    }
  }

  // ----------------------- ag-grid set DATASOURCE ------------------------------
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.agGridSharedFunctionsService.addSelectDeselectAllText();
    // send to subscribers the visibility of columns
    this.gridColumnShowHideService.sendColumnVisibilityChanged(this.gridColumnApi);

    window.onresize = () => {
      this.gridApi.sizeColumnsToFit();
    };
    this.icons = {
      filter: ''
    };
    /*
    const dataFromCookie = this.meterUnitsTypeGridService.getCookieData(); // saved columns settings
    if (dataFromCookie) {
      params.columnApi.setColumnState(dataFromCookie);
    }

    const cookieSort = this.meterUnitsTypeGridService.getCookieDataSortModel();
    if (cookieSort !== undefined && cookieSort !== null) {
      this.gridApi.setSortModel(cookieSort);
    }*/

    const that = this;
    const datasource = {
      getRows(paramsRow) {
        that.requestModel.typeId = that.id; // type of meter units
        that.requestModel.startRow = that.meterUnitsTypeGridService.getCurrentRowIndex().startRow;
        that.requestModel.endRow = that.meterUnitsTypeGridService.getCurrentRowIndex().endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;

        that.requestModel.filterModel = that.setFilter();
        that.requestModel.searchModel = that.setSearch();
        if (that.authService.isRefreshNeeded2()) {
          that.authService
            .renewToken()
            .then(value => {
              that.authService.user = value;
              that.authService.saveTokenAndSetUserRights2(value, '');

              that.meterUnitsTypeService.getGridMeterUnits(that.requestModel).subscribe(data => {
                that.gridApi.hideOverlay();
                that.totalCount = data.totalCount;
                if ((data === undefined || data == null || data.totalCount === 0) && that.noSearch() && that.noFilters()) {
                  that.noData = true;
                } else if (data.totalCount === 0) {
                  that.gridApi.showNoRowsOverlay();
                }

                that.gridApi.paginationGoToPage(that.meterUnitsTypeGridService.getSessionSettingsPageIndex());
                paramsRow.successCallback(data.data, data.totalCount);
                that.selectRows(that.gridApi);
                that.eventService.setIsSelectedAll(that.meterUnitsTypeGridService.getSessionSettingsSelectedAll());
                // params.failCallback();
              });
            })
            .catch(err => {
              if (err.message === 'login_required') {
                that.authService.login().catch(errDetail => console.log(errDetail));
              }
            });
        } else {
          that.meterUnitsTypeService.getGridMeterUnits(that.requestModel).subscribe(data => {
            that.gridApi.hideOverlay();
            that.totalCount = data.totalCount;
            if ((data === undefined || data == null || data.totalCount === 0) && that.noSearch() && that.noFilters()) {
              that.noData = true;
            } else if (data.totalCount === 0) {
              that.gridApi.showNoRowsOverlay();
            }

            that.gridApi.paginationGoToPage(that.meterUnitsTypeGridService.getSessionSettingsPageIndex());
            paramsRow.successCallback(data.data, data.totalCount);
            that.selectRows(that.gridApi);
            that.eventService.setIsSelectedAll(that.meterUnitsTypeGridService.getSessionSettingsSelectedAll());
            // params.failCallback();
          });
        }
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
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
      ((!this.requestModel.filterModel.statuses ||
        this.requestModel.filterModel.statuses.length === 0 ||
        this.requestModel.filterModel.statuses[0].id === 0) &&
        (!this.requestModel.filterModel.tags ||
          this.requestModel.filterModel.tags.length === 0 ||
          this.requestModel.filterModel.tags[0].id === 0) &&
        (!this.requestModel.filterModel.types ||
          this.requestModel.filterModel.types.length === 0 ||
          this.requestModel.filterModel.types[0] === 0) &&
        (!this.requestModel.filterModel.vendor || this.requestModel.filterModel.vendor.id === 0) &&
        (!this.requestModel.filterModel.readStatus || this.requestModel.filterModel.readStatus === null) &&
        (!this.requestModel.filterModel.firmware ||
          this.requestModel.filterModel.firmware.length === 0 ||
          this.requestModel.filterModel.firmware[0].id === 0) &&
        (!this.requestModel.filterModel.disconnectorState ||
          this.requestModel.filterModel.disconnectorState.length === 0 ||
          this.requestModel.filterModel.disconnectorState[0].id === 0) &&
        (!this.requestModel.filterModel.ciiState ||
          this.requestModel.filterModel.ciiState.length === 0 ||
          this.requestModel.filterModel.disconnectorState[0].id === 0) &&
        !this.requestModel.filterModel.showChildInfoMBus &&
        !this.requestModel.filterModel.showWithoutTemplate &&
        !this.requestModel.filterModel.readyForActivation)
    ) {
      return true;
    }
    return false;
  }
  onFirstDataRendered(params) {
    //  params.api.sizeColumnsToFit();
    // params.api.showLoadingOverlay();
  }

  // ag-grid change visibillity of columns
  onColumnVisible(params) {
    this.meterUnitsTypeGridService.onColumnVisibility(params);
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
        !this.meterUnitsTypeGridService.checkIfFilterModelAndCookieAreSame(
          this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter),
          this.requestModel.filterModel
        )
      ) {
        const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
        this.requestModel.filterModel.statuses = filterDCU.statusesFilter;
        this.requestModel.filterModel.vendor = filterDCU.vendorFilter;
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
        this.requestModel.filterModel.breakerState = filterDCU.breakerStateFilter;
        this.requestModel.filterModel.showChildInfoMBus = filterDCU.showOnlyMeterUnitsWithMBusInfoFilter;
        this.requestModel.filterModel.showWithoutTemplate = filterDCU.showMeterUnitsWithoutTemplateFilter;
        this.requestModel.filterModel.readyForActivation = filterDCU.showOnlyImageReadyForActivationFilter;

        this.meterUnitsTypeGridService.setSessionSettingsPageIndex(0);
        this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(false);
        this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
        this.meterUnitsTypeGridService.setSessionSettingsExcludedRows([]);

        this.eventService.selectDeselectAll(false);
        this.eventService.setIsSelectedAll(false);
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    }
  }*/

  setSearch() {
    const search = this.meterUnitsTypeGridService.getSessionSettingsSearchedText();
    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search }]);
    }
    return [];
  }

  // set filter in request model
  setFilter() {
    if (
      !this.meterUnitsTypeGridService.checkIfFilterModelAndCookieAreSame(
        this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter),
        this.requestModel.filterModel
      )
    ) {
      this.setFilterInfo();
      const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
      this.requestModel.filterModel.statuses = filterDCU.statusesFilter;
      this.requestModel.filterModel.vendor = filterDCU.vendorFilter;
      this.requestModel.filterModel.tags = filterDCU.tagsFilter;
      this.requestModel.filterModel.readStatus = {
        operation: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.operation : { id: '', value: '' },
        value1: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value1 : 0,
        value2: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value2 : 0
      };
      this.requestModel.filterModel.firmware = filterDCU.firmwareFilter;
      this.requestModel.filterModel.disconnectorState = filterDCU.breakerStateFilter;
      this.requestModel.filterModel.ciiState = filterDCU.ciiStateFilter;
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
    this.filtersInfo = this.staticTextService.getFiltersInfo(
      filterInfo.name,
      filterInfo.statusesFilter && filterInfo.statusesFilter.length > 0,
      filterInfo.vendorFilter ? true : false,
      filterInfo.tagsFilter && filterInfo.tagsFilter.length > 0,
      filterInfo.readStatusFilter && filterInfo.readStatusFilter.operation && filterInfo.readStatusFilter.operation.id.length > 0
        ? true
        : false,
      filterInfo.firmwareFilter && filterInfo.firmwareFilter.length > 0,
      filterInfo.breakerStateFilter && filterInfo.breakerStateFilter.length > 0,
      filterInfo.ciiStateFilter && filterInfo.ciiStateFilter.length > 0,
      filterInfo.showOnlyMeterUnitsWithMBusInfoFilter,
      filterInfo.showMeterUnitsWithoutTemplateFilter,
      filterInfo.showOnlyImageReadyForActivationFilter
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
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }

    if (params.newPage && !this.loadGrid) {
      this.meterUnitsTypeGridService.setSessionSettingsPageIndex(params.api.paginationGetCurrentPage());
    } else if (!params.newPage && params.keepRenderedRows && this.loadGrid) {
      this.loadGrid = false;
      params.api.paginationGoToPage(this.meterUnitsTypeGridService.getSessionSettingsPageIndex());
    }
  }

  // check if "select all" was clicked
  checkSelectedAll() {
    return this.meterUnitsTypeGridService.getSessionSettingsSelectedAll();
  }

  onRowSelect(params) {
    if (this.meterUnitsTypeGridService.getSessionSettingsSelectedAll()) {
      this.meterUnitsTypeGridService.setSessionSettingsExcludedRows(params.node);
    } else {
      this.meterUnitsTypeGridService.setSessionSettingsSelectedRows(params.node);
    }
  }

  // select rows on load grid from session
  selectRows(api: any) {
    this.programmaticallySelectRow = true;
    const selectedAll = this.meterUnitsTypeGridService.getSessionSettingsSelectedAll();
    const selectedRows = this.meterUnitsTypeGridService.getSessionSettingsSelectedRows();
    api.forEachNode(node => {
      if (selectedAll) {
        const startRow = api.getFirstDisplayedRow();
        const endRow = api.getLastDisplayedRow();
        const excludedRows = this.meterUnitsTypeGridService.getSessionSettingsExcludedRows();
        api.forEachNode(node2 => {
          if (node2.rowIndex >= startRow && node2.rowIndex <= endRow && !_.find(excludedRows, x => x.deviceId === node2.data.deviceId)) {
            node2.setSelected(true);
          }
        });
      } else if (
        node.data !== undefined &&
        selectedRows !== undefined &&
        selectedRows.length > 0 &&
        !selectedAll &&
        _.find(selectedRows, x => x.deviceId === node.data.deviceId) !== undefined
      ) {
        node.setSelected(true);
      } else {
        node.setSelected(false);
      }
    });

    this.programmaticallySelectRow = false;
  }

  // form actions

  // click on the link "select all"
  selectAll() {
    this.meterUnitsTypeGridService.setSessionSettingsClearExcludedRows();
    this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(true);
    this.eventService.selectDeselectAll(true);
    this.eventService.setIsSelectedAll(true);
  }

  // click on the link "deselect all"
  deselectAll() {
    this.meterUnitsTypeGridService.setSessionSettingsClearExcludedRows();
    this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
    this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(false);
    this.eventService.selectDeselectAll(false);
    this.eventService.setIsSelectedAll(false);
  }

  // tsg button click
  onTag() {
    //
  }

  // --> Operations action click (bulk or selected row)
  onBreakerStatus(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.breakerStatus,
      params,
      selectedGuid && selectedGuid.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onActivateUpgrade(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.activateUpgrade,
      params,
      selectedGuid && selectedGuid.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onConnect(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.connect,
      params,
      selectedGuid && selectedGuid.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onDisconnect(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.disconnect,
      params,
      selectedGuid && selectedGuid.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onCiiState(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.ciiState,
      params,
      selectedGuid && selectedGuid.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onCiiActivate(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.ciiActivate,
      params,
      selectedGuid && selectedGuid.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onCiiDeactivate(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.ciiDeactivate,
      params,
      selectedGuid && selectedGuid.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onClearFF(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.clearFF,
      params,
      selectedGuid && selectedGuid.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  // delete button click
  // TODO missing BE api !!
  onDelete(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.delete,
      params,
      selectedGuid && selectedGuid.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  // popup
  onScheduleReadJobs(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onScheduleReadJobs(params);
  }

  // popup
  onTou(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onTou(params);
  }

  // popup
  onUpgrade(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onUpgrade(params);
  }

  // popup
  onSetMonitor(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onSetMonitor(params);
  }

  // popup
  onSetLimiter(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onSetLimiter(params);
  }

  // popup
  onBreakerMode(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onBreakerMode(params);
  }
  // <-- end Operations action click (bulk or selected row)

  // --> for checking long bulk action finished
  deleteAllRequests() {
    const requestIds = this.meterUnitsTypeGridService.getAllMyGridLinkRequestIds();
    if (requestIds && requestIds.length > 0) {
      requestIds.map(requestId => this.meterUnitsTypeGridService.removeMyGridLinkRequestId(requestId));
    }
  }

  refresh() {
    // if (this.authService.isTokenAvailable()) {
    const requestIds = this.meterUnitsTypeGridService.getAllMyGridLinkRequestIds();
    // console.log(`refresh `, requestIds);
    if (requestIds && requestIds.length > 0) {
      requestIds.map(requestId =>
        this.service.getMyGridLastStatus(requestId).subscribe(results => {
          const okRequest = _.find(results, x => x.status === this.taskStatusOK && x.isFinished);
          if (okRequest !== undefined) {
            const badRequest = _.find(results, x => x.status !== this.taskStatusOK);
            if (badRequest === undefined) {
              // no devices with unsuccessful status, we can delete requestId from session
              this.meterUnitsTypeGridService.removeMyGridLinkRequestId(requestId);
              const breakerStateRequests = this.meterUnitsTypeGridService.getAllMyGridLink_BreakerState_RequestIds();
              const isBreakerState = _.find(breakerStateRequests, x => x === requestId);

              // 3th step for breaker state
              if (isBreakerState) {
                this.service.getOnDemandDataProcessing(requestId).subscribe(resultsBreakerState => {
                  // console.log(`getOnDemandDataProcessing = `, resultsBreakerState);
                  if (resultsBreakerState) {
                    this.meterUnitsTypeService.updateReaderState(resultsBreakerState).subscribe(() => this.refreshGrid());
                  }
                  this.meterUnitsTypeGridService.removeMyGridLink_BreakerState_RequestId(requestId);
                });
              }

              const ciiStateRequests = this.meterUnitsTypeGridService.getAllMyGridLink_CiiState_RequestIds();
              const isCiiState = _.find(ciiStateRequests, x => x === requestId);
              // 3th step for CII state
              if (isCiiState) {
                this.service.getOnDemandDataProcessing(requestId).subscribe(resultsCiiState => {
                  // // console.log(`getOnDemandDataProcessing = `, resultsBreakerState);
                  // if (resultsCiiState) {
                  //   this.meterUnitsTypeService.updateReaderState(resultsBreakerState).subscribe(() => this.refreshGrid());
                  // }
                  this.meterUnitsTypeGridService.removeMyGridLink_CiiState_RequestId(requestId);
                });
              }

              this.toast.successToast(this.messageDataRefreshed);
            }
          } else {
            const badRequest = _.find(results, x => x.status !== this.taskStatusOK && x.isFinished);
            if (badRequest !== undefined) {
              this.toast.errorToast(this.messageActionFailed);
              this.meterUnitsTypeGridService.removeMyGridLinkRequestId(requestId);
              this.meterUnitsTypeGridService.removeMyGridLink_BreakerState_RequestId(requestId);
            }
          }
        })
      );
      this.refreshGrid();
    }
    /* } else {
      this.service.getMyGridIdentityToken().subscribe(
        value => {
          this.authService.setAuthTokenMyGridLink(value);
        },
        e => {
          this.toast.errorToast(this.messageServerError);
        }
      );
    }*/
  }
  // <-- end for checking long bulk action finished

  // isFilterSet(): boolean {
  //   // const tmpFilter: DcuLayout = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;
  //   // return (tmpFilter.name !== '' && tmpFilter.name !== undefined)||
  //   //   (tmpFilter.statusesFilter && tmpFilter.statusesFilter.length > 0) ||
  //   //   (tmpFilter.readStatusFilter && tmpFilter.readStatusFilter.operation && tmpFilter.readStatusFilter.operation.id.length > 0) ||
  //   //   (tmpFilter.typesFilter && tmpFilter.typesFilter.length > 0) ||
  //   //   tmpFilter.vendorFilter ||
  //   //   (tmpFilter.tagsFilter && tmpFilter.tagsFilter.length > 0)
  // }

  // clearFilter() {

  // }

  getSelectedCount(): number {
    if (this.checkSelectedAll()) {
      const excludedRowsLength = this.meterUnitsTypeGridService.getSessionSettingsExcludedRows().length;
      return this.totalCount - excludedRowsLength;
    } else {
      return this.meterUnitsTypeGridService.getSessionSettingsSelectedRows().length;
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

  showRegisters(deviceId: string) {
    this.router.navigate(['/meterUnits/registers', deviceId]);
  }

  showItem(deviceId: string) {
    this.router.navigate(['/meterUnits/details', deviceId]);
  }

  toggleFilter() {
    this.hideFilter = !this.hideFilter;

    setTimeout(() => {
      this.gridApi.sizeColumnsToFit();
    }, 50);

    window.onresize = () => {
      this.gridApi.sizeColumnsToFit();
    };
  }
}
