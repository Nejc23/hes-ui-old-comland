import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { gridRefreshInterval, configAgGrid, enumSearchFilterOperators } from 'src/environments/config';
import { MeterUnitsTypeStaticTextService } from '../types/services/meter-units-type-static-text.service';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { GridOptions, Module } from '@ag-grid-community/core';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { MeterUnitsAllGridService } from '../types/services/meter-units-all-grid-service';
import { MeterUnitsAllStaticTextService } from '../types/services/meter-units-all-static-text-service';
import { MeterUnitsTypeGridService } from '../types/services/meter-units-type-grid.service';
import { AgGridSharedFunctionsService } from 'src/app/shared/ag-grid/services/ag-grid-shared-functions.service';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import * as _ from 'lodash';
import { MeterUnitsTypeGridEventEmitterService } from '../types/services/meter-units-type-grid-event-emitter.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { ActionEnumerator } from 'src/app/core/permissions/enumerators/action-enumerator.model';

@Component({
  selector: 'app-meter-units-type',
  templateUrl: './meter-units-all.component.html'
})
export class MeterUnitsAllComponent implements OnInit, OnDestroy {
  meterTypes$: Codelist<number>[] = [];
  public scheduleId: string;

  id = 0;
  private paramsSub: Subscription;
  sessionNameForGridFilter = 'grdLayoutMUT-typeId-';
  headerTitle = 'Meter';
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
      breakerState: [{ id: 0, value: '' }],
      showChildInfoMBus: false,
      showDeleted: false,
      showWithoutTemplate: false
    }
  };

  requestId = '';
  dataResult = '';
  dataStatusResponse = '';
  dataResult2 = '';
  public localeText;

  messageActionInProgress = this.i18n(`Action in progress!`);
  messageServerError = this.i18n(`Server error!`);
  messageDataRefreshed = this.i18n(`Data refreshed!`);
  messageActionFailed = this.i18n(`Action failed!`);

  constructor(
    private route: ActivatedRoute,
    private meterUnitsAllGridService: MeterUnitsAllGridService,
    private sidebarService: SidebarService,
    private i18n: I18n,
    private staticTextService: MeterUnitsAllStaticTextService,
    private agGridSharedFunctionsService: AgGridSharedFunctionsService,
    private service: MyGridLinkService,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    private meterUnitsTypeService: MeterUnitsService,
    private toast: ToastNotificationService,
    private eventService: MeterUnitsTypeGridEventEmitterService,
    private authService: AuthService,
    private codelistMeterUnitsService: CodelistMeterUnitsRepositoryService
  ) {
    this.paramsSub = route.params.subscribe(params => {
      this.id = params.id;
      meterUnitsAllGridService.meterUnitsAllId = params.id;
      this.sessionNameForGridFilter = this.sessionNameForGridFilter.includes('grdLayoutMUT-typeId-' + params.id)
        ? this.sessionNameForGridFilter
        : 'grdLayoutMUT-typeId-' + params.id;

      if (this.gridApi) {
        this.gridApi.purgeServerSideCache([]);
      }

      if (this.gridColumnApi) {
        const dataFromCookie = this.meterUnitsAllGridService.getCookieData(); // saved columns settings
        if (dataFromCookie) {
          this.gridColumnApi.setColumnState(dataFromCookie);
        }
      }

      if (this.gridApi) {
        const cookieSort = this.meterUnitsAllGridService.getCookieDataSortModel();
        if (cookieSort !== undefined && cookieSort !== null) {
          this.gridApi.setSortModel(cookieSort);
        }
      }

      // set title by selected meter unit type
      if (this.meterTypes$.length === 0) {
        this.codelistMeterUnitsService.meterUnitTypeCodelist().subscribe(data => {
          this.meterTypes$ = data;
          this.setTitle();
        });
      } else {
        this.setTitle();
      }
    });

    this.filters = staticTextService.noFilterAppliedTekst;
    this.frameworkComponents = meterUnitsAllGridService.setFrameworkComponents();
    this.gridOptions = this.meterUnitsAllGridService.setGridOptions();
    this.layoutChangeSubscription = this.eventService.eventEmitterLayoutChange.subscribe({
      next: (event: MeterUnitsLayout) => {
        console.log('test 1');
        if (event !== null) {
          this.requestModel.filterModel.statuses = event.statusesFilter;
          this.requestModel.filterModel.vendor = event.vendorFilter;
          this.requestModel.filterModel.tags = event.tagsFilter;
          this.requestModel.filterModel.readStatus.operation = event.readStatusFilter.operation;
          this.requestModel.filterModel.readStatus.value1 = event.readStatusFilter.value1;
          this.requestModel.filterModel.readStatus.value2 = event.readStatusFilter.value2;
          this.requestModel.filterModel.firmware = event.firmwareFilter;
          this.requestModel.filterModel.breakerState = event.breakerStateFilter;
          this.requestModel.filterModel.showChildInfoMBus = event.showOnlyMeterUnitsWithMBusInfoFilter;
          this.requestModel.filterModel.showDeleted = event.showDeletedMeterUnitsFilter;
          this.requestModel.filterModel.showWithoutTemplate = event.showMeterUnitsWithoutTemplateFilter;
          this.requestModel.filterModel.readyForActivation = event.showOnlyImageReadyForActivationFilter;
          this.gridColumnApi.setColumnState(event.gridLayout);
          this.meterUnitsAllGridService.setSessionSettingsPageIndex(0);
          this.meterUnitsAllGridService.setSessionSettingsSelectedRows([]);
        }
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    });
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
    this.route.queryParams.subscribe(params => {
      this.scheduleId = params.scheduleId;
    });

    // set grid columns
    this.columns = this.meterUnitsAllGridService.setGridDefaultColumns(false);
    // set right sidebar on the grid
    this.sideBar = this.meterUnitsAllGridService.setSideBar();

    this.localeText = {
      // for side panel
      columns: this.i18n('Columns'),
      filters: this.i18n('Filters'),

      // for filter panel
      page: this.i18n('page'),
      more: this.i18n('more'),
      to: this.i18n('to'),
      of: this.i18n('of'),
      next: this.i18n('next'),
      last: this.i18n('last'),
      first: this.i18n('first'),
      previous: this.i18n('previous'),
      loadingOoo: this.i18n('loading...')
    };

    this.deleteAllRequests();
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }

    if (this.layoutChangeSubscription) {
      this.layoutChangeSubscription.unsubscribe();
    }
  }

  deleteAllRequests() {
    const requestIds = this.meterUnitsAllGridService.getAllMyGridLinkRequestIds();
    if (requestIds && requestIds.length > 0) {
      console.log(`deleteing requests `, requestIds);
      requestIds.map(requestId => this.meterUnitsAllGridService.removeMyGridLinkRequestId(requestId));
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
      (filterInfo.vendorFilter && filterInfo.vendorFilter.value !== undefined && filterInfo.vendorFilter.value !== '') ||
      (filterInfo.readStatusFilter && filterInfo.readStatusFilter.operation && filterInfo.readStatusFilter.operation.id.length > 0) ||
      (filterInfo.firmwareFilter && filterInfo.firmwareFilter.length > 0) ||
      (filterInfo.breakerStateFilter && filterInfo.breakerStateFilter.length > 0) ||
      filterInfo.showOnlyMeterUnitsWithMBusInfoFilter ||
      filterInfo.showDeletedMeterUnitsFilter ||
      filterInfo.showMeterUnitsWithoutTemplateFilter ||
      filterInfo.showOnlyImageReadyForActivationFilter
    );
  }

  checkSelectedAll() {
    return this.meterUnitsAllGridService.getSessionSettingsSelectedAll();
  }

  clearFilter() {
    this.gridFilterSessionStoreService.clearGridLayout();
    this.refreshGrid();
  }

  // ag-grid
  // button click refresh grid
  refreshGrid() {
    this.gridApi.purgeServerSideCache([]);
  }

  // ag-grid
  // search string changed call get data
  searchData($event: string) {
    if ($event !== this.meterUnitsAllGridService.getSessionSettingsSearchedText()) {
      this.meterUnitsAllGridService.setSessionSettingsSearchedText($event);
      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event }];

      this.meterUnitsAllGridService.setSessionSettingsPageIndex(0);
      this.meterUnitsAllGridService.setSessionSettingsSelectedRows([]);
      this.gridApi.onFilterChanged();
    }
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

  // click on the link "select all"
  selectAll() {
    this.meterUnitsAllGridService.setSessionSettingsSelectedAll(true);
    this.eventService.selectDeselectAll(true);
    this.eventService.setIsSelectedAll(true);
  }

  // click on the link "deselect all"
  deselectAll() {
    this.meterUnitsAllGridService.setSessionSettingsSelectedRows([]);
    this.meterUnitsAllGridService.setSessionSettingsSelectedAll(false);
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
        that.requestModel.startRow = that.meterUnitsAllGridService.getCurrentRowIndex().startRow;
        that.requestModel.endRow = that.meterUnitsAllGridService.getCurrentRowIndex().endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;
        console.log(`requestModel = `, that.requestModel);
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

                that.gridApi.paginationGoToPage(that.meterUnitsAllGridService.getSessionSettingsPageIndex());
                paramsRow.successCallback(data.data, data.totalCount);
                that.selectRows(that.gridApi);
                that.eventService.setIsSelectedAll(that.meterUnitsAllGridService.getSessionSettingsSelectedAll());
                // params.failCallback();
              });
            })
            .catch(err => {
              if (err.message === 'login_required') {
                that.authService.login().catch(errDetail => console.log(errDetail));
              }
            });
        } else {
          console.log(`requestModel = `, this.requestModel);
          that.meterUnitsTypeService.getGridMeterUnits(that.requestModel).subscribe(data => {
            that.gridApi.hideOverlay();
            that.totalCount = data.totalCount;
            if ((data === undefined || data == null || data.totalCount === 0) && that.noSearch() && that.noFilters()) {
              that.noData = true;
            } else if (data.totalCount === 0) {
              that.gridApi.showNoRowsOverlay();
            }

            that.gridApi.paginationGoToPage(that.meterUnitsAllGridService.getSessionSettingsPageIndex());
            paramsRow.successCallback(data.data, data.totalCount);
            that.selectRows(that.gridApi);
            that.eventService.setIsSelectedAll(that.meterUnitsAllGridService.getSessionSettingsSelectedAll());
            // params.failCallback();
          });
        }
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }
  // ----------------------- ag-grid set DATASOURCE end --------------------------

  // ag-grid change visibillity of columns
  onColumnVisible(params) {
    this.meterUnitsAllGridService.onColumnVisibility(params);
  }

  // on close tool panel reload filter model
  toolPanelChanged(params) {
    if (params.source === undefined) {
      if (
        !this.meterUnitsAllGridService.checkIfFilterModelAndCookieAreSame(
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
        this.requestModel.filterModel.showDeleted = filterDCU.showDeletedMeterUnitsFilter;
        this.requestModel.filterModel.showWithoutTemplate = filterDCU.showMeterUnitsWithoutTemplateFilter;
        this.requestModel.filterModel.readyForActivation = filterDCU.showOnlyImageReadyForActivationFilter;

        this.meterUnitsAllGridService.setSessionSettingsPageIndex(0);
        this.meterUnitsAllGridService.setSessionSettingsSelectedAll(false);
        this.meterUnitsAllGridService.setSessionSettingsSelectedRows([]);
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
      this.meterUnitsAllGridService.setSessionSettingsPageIndex(params.api.paginationGetCurrentPage());
    } else if (!params.newPage && params.keepRenderedRows && this.loadGrid) {
      this.loadGrid = false;
      params.api.paginationGoToPage(this.meterUnitsAllGridService.getSessionSettingsPageIndex());
    }
  }

  // if selected-all clicked, than disable deselection of the rows
  onRowSelect(params) {
    this.meterUnitsAllGridService.setSessionSettingsSelectedRows(params.node);
    if (this.meterUnitsAllGridService.getSessionSettingsSelectedAll()) {
      // && !this.programmaticallySelectRow) {
      params.node.setSelected(true);
    }
  }

  onFirstDataRendered(params) {}

  refresh() {
    // if (this.authService.isTokenAvailable()) {
    const requestIds = this.meterUnitsAllGridService.getAllMyGridLinkRequestIds();
    // console.log(`refresh `, requestIds);
    if (requestIds && requestIds.length > 0) {
      requestIds.map(requestId =>
        this.service.getMyGridLastStatus(requestId).subscribe(results => {
          const okRequest = _.find(results, x => x.status === this.taskStatusOK && x.isFinished);
          if (okRequest !== undefined) {
            const badRequest = _.find(results, x => x.status !== this.taskStatusOK);
            if (badRequest === undefined) {
              // no devices with unsuccessful status, we can delete requestId from session
              this.meterUnitsAllGridService.removeMyGridLinkRequestId(requestId);
              const breakerStateRequests = this.meterUnitsAllGridService.getAllMyGridLink_BreakerState_RequestIds();
              const isBreakerState = _.find(breakerStateRequests, x => x === requestId);
              // 3th step for breaker state
              if (isBreakerState) {
                this.service.getOnDemandDataProcessing(requestId).subscribe(resultsBreakerState => {
                  // console.log(`getOnDemandDataProcessing = `, resultsBreakerState);
                  if (resultsBreakerState) {
                    this.meterUnitsTypeService.updateReaderState(resultsBreakerState).subscribe(() => this.refreshGrid());
                  }
                  this.meterUnitsAllGridService.removeMyGridLink_BreakerState_RequestId(requestId);
                });
              }
              this.toast.successToast(this.messageDataRefreshed);
            }
          } else {
            const badRequest = _.find(results, x => x.status !== this.taskStatusOK && x.isFinished);
            if (badRequest !== undefined) {
              this.toast.errorToast(this.messageActionFailed);
              this.meterUnitsAllGridService.removeMyGridLinkRequestId(requestId);
              this.meterUnitsAllGridService.removeMyGridLink_BreakerState_RequestId(requestId);
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

  // set filter in request model
  setFilter() {
    if (
      !this.meterUnitsAllGridService.checkIfFilterModelAndCookieAreSame(
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
      this.requestModel.filterModel.breakerState = filterDCU.breakerStateFilter;
      this.requestModel.filterModel.showChildInfoMBus = filterDCU.showOnlyMeterUnitsWithMBusInfoFilter;
      this.requestModel.filterModel.showDeleted = filterDCU.showDeletedMeterUnitsFilter;
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
      filterInfo.vendorFilter ? true : false,
      filterInfo.tagsFilter && filterInfo.tagsFilter.length > 0,
      filterInfo.readStatusFilter && filterInfo.readStatusFilter.operation && filterInfo.readStatusFilter.operation.id.length > 0
        ? true
        : false,
      filterInfo.firmwareFilter && filterInfo.firmwareFilter.length > 0,
      filterInfo.breakerStateFilter && filterInfo.breakerStateFilter.length > 0,
      filterInfo.showOnlyMeterUnitsWithMBusInfoFilter,
      filterInfo.showDeletedMeterUnitsFilter,
      filterInfo.showMeterUnitsWithoutTemplateFilter,
      filterInfo.showOnlyImageReadyForActivationFilter
    );
  }

  setSearch() {
    const search = this.meterUnitsAllGridService.getSessionSettingsSearchedText();
    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search }]);
    }
    return [];
  }

  // select rows on load grid from session
  selectRows(api: any) {
    this.programmaticallySelectRow = true;
    const selectedAll = this.meterUnitsAllGridService.getSessionSettingsSelectedAll();
    const selectedRows = this.meterUnitsAllGridService.getSessionSettingsSelectedRows();
    api.forEachNode(node => {
      if (selectedAll) {
        const startRow = api.getFirstDisplayedRow();
        const endRow = api.getLastDisplayedRow();
        api.forEachNode(node2 => {
          if (node2.rowIndex >= startRow && node2.rowIndex <= endRow) {
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
        (!this.requestModel.filterModel.breakerState ||
          this.requestModel.filterModel.breakerState.length === 0 ||
          this.requestModel.filterModel.breakerState[0].id === 0) &&
        !this.requestModel.filterModel.showChildInfoMBus &&
        !this.requestModel.filterModel.showDeleted &&
        !this.requestModel.filterModel.showWithoutTemplate &&
        !this.requestModel.filterModel.readyForActivation)
    ) {
      return true;
    }
    return false;
  }

  // set form title by selected meter unit type
  private setTitle() {
    // const selectedType = this.meterTypes$.find(x => x.id === id);
    // if (selectedType !== undefined && selectedType != null) {
    //   this.headerTitle = selectedType.value + ' ' + this.staticTextService.headerTitleMeterUnitsAll;
    // }
    this.headerTitle = this.staticTextService.headerTitleMeterUnitsAll;
  }

  onRemoveFromJob() {}
}
