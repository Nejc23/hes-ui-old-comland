import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
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
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { FunctionalityEnumerator } from 'src/app/core/permissions/enumerators/functionality-enumerator.model';
import { ActionEnumerator } from 'src/app/core/permissions/enumerators/action-enumerator.model';
import { AgGridSharedFunctionsService } from 'src/app/shared/ag-grid/services/ag-grid-shared-functions.service';
import { AllForJobStaticTextService } from '../services/meter-units-for-job-static-text.service';
import { AllForJobGridEventEmitterService } from '../services/meter-units-for-job-grid-event-emitter.service';
import { RequestMeterUnitsForJob } from 'src/app/core/repository/interfaces/meter-units/meter-units-for-job.interface';
import { AllForJobGridService } from '../services/meter-units-for-job-grid.service';

@Component({
  // selector: 'app-meter-units-all-for-job',
  templateUrl: './meter-units-for-job.component.html'
})
export class AllForJobComponent implements OnInit, OnDestroy {
  meterTypes$: Codelist<number>[] = [];

  scheduleId = '';
  private paramsSub: Subscription;
  sessionNameForGridFilter = 'grdLayoutMUT-typeId-';
  headerTitle = '';
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
      vendor: null,
      readStatus: null,
      breakerState: null,
      showChildInfoMBus: false,
      showDeleted: true,
      showWithoutTemplate: true
    }
  };

  requestId = '';
  dataResult = '';
  dataStatusResponse = '';
  dataResult2 = '';
  public localeText;

  // messageActionInProgress = this.i18n(`Action in progress!`);
  messageServerError = this.i18n(`Server error!`);
  messageDataRefreshed = this.i18n(`Data refreshed!`);
  messageActionFailed = this.i18n(`Action failed!`);

  constructor(
    private route: ActivatedRoute,
    private allForJobGridService: AllForJobGridService,
    private sidebarService: SidebarService,
    private staticTextService: AllForJobStaticTextService,
    private i18n: I18n,
    private agGridSharedFunctionsService: AgGridSharedFunctionsService,
    private service: MyGridLinkService,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    private meterUnitsTypeService: MeterUnitsService,
    private toast: ToastNotificationService,
    private eventService: AllForJobGridEventEmitterService,
    private authService: AuthService,
    private codelistMeterUnitsService: CodelistMeterUnitsRepositoryService,
    private modalService: ModalService,
    private jobsService: JobsService
  ) {
    this.paramsSub = route.params.subscribe(params => {
      this.scheduleId = params.scheduleId;
      allForJobGridService.meterUnitsAllId = params.id;
      this.sessionNameForGridFilter = this.sessionNameForGridFilter.includes('grdLayoutMUT-typeId-' + params.id)
        ? this.sessionNameForGridFilter
        : 'grdLayoutMUT-typeId-' + params.id;

      if (this.gridApi) {
        this.gridApi.purgeServerSideCache([]);
      }

      if (this.gridColumnApi) {
        const dataFromCookie = this.allForJobGridService.getCookieData(); // saved columns settings
        if (dataFromCookie) {
          this.gridColumnApi.setColumnState(dataFromCookie);
        }
      }

      if (this.gridApi) {
        const cookieSort = this.allForJobGridService.getCookieDataSortModel();
        if (cookieSort !== undefined && cookieSort !== null) {
          this.gridApi.setSortModel(cookieSort);
        }
      }
    });

    // this.filters = staticTextService.noFilterAppliedTekst;
    this.frameworkComponents = allForJobGridService.setFrameworkComponents();
    this.gridOptions = this.allForJobGridService.setGridOptions();
    // this.layoutChangeSubscription = this.eventService.eventEmitterLayoutChange.subscribe({
    //   next: (event: MeterUnitsLayout) => {
    //     console.log('test 1');
    //     if (event !== null) {
    //       this.requestModel.filterModel.statuses = event.statusesFilter;
    //       this.requestModel.filterModel.vendor = event.vendorFilter;
    //       this.requestModel.filterModel.tags = event.tagsFilter;
    //       this.requestModel.filterModel.readStatus.operation = event.readStatusFilter.operation;
    //       this.requestModel.filterModel.readStatus.value1 = event.readStatusFilter.value1;
    //       this.requestModel.filterModel.readStatus.value2 = event.readStatusFilter.value2;
    //       this.requestModel.filterModel.firmware = event.firmwareFilter;
    //       this.requestModel.filterModel.breakerState = event.breakerStateFilter;
    //       this.requestModel.filterModel.showChildInfoMBus = event.showOnlyMeterUnitsWithMBusInfoFilter;
    //       this.requestModel.filterModel.showDeleted = event.showDeletedMeterUnitsFilter;
    //       this.requestModel.filterModel.showWithoutTemplate = event.showMeterUnitsWithoutTemplateFilter;
    //       this.requestModel.filterModel.readyForActivation = event.showOnlyImageReadyForActivationFilter;
    //       this.gridColumnApi.setColumnState(event.gridLayout);
    //       this.allForJobGridService.setSessionSettingsPageIndex(0);
    //       this.allForJobGridService.setSessionSettingsSelectedRows([]);
    //     }
    //     this.gridApi.onFilterChanged();
    //     this.setFilterInfo();
    //   }
    // });
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
      this.requestModel.scheduleId = params.scheduleId;
    });

    // set grid columns
    this.columns = this.allForJobGridService.setGridDefaultColumns(false);
    // set right sidebar on the grid
    this.sideBar = this.allForJobGridService.setSideBar();

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

  // deleteAllRequests() {
  //   const requestIds = this.allForJobGridService.getAllMyGridLinkRequestIds();
  //   if (requestIds && requestIds.length > 0) {
  //     console.log(`deleteing requests `, requestIds);
  //     requestIds.map(requestId => this.allForJobGridService.removeMyGridLinkRequestId(requestId));
  //   }
  // }

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
    return this.allForJobGridService.getSessionSettingsSelectedAll();
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
    if ($event !== this.allForJobGridService.getSessionSettingsSearchedText()) {
      this.allForJobGridService.setSessionSettingsSearchedText($event);
      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event }];

      this.allForJobGridService.setSessionSettingsPageIndex(0);
      this.allForJobGridService.setSessionSettingsSelectedRows([]);
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
    this.allForJobGridService.setSessionSettingsSelectedAll(true);
    this.eventService.selectDeselectAll(true);
    this.eventService.setIsSelectedAll(true);
  }

  // click on the link "deselect all"
  deselectAll() {
    this.allForJobGridService.setSessionSettingsSelectedRows([]);
    this.allForJobGridService.setSessionSettingsSelectedAll(false);
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
        that.requestModel.scheduleId = that.scheduleId; // type of meter units
        that.requestModel.startRow = that.allForJobGridService.getCurrentRowIndex().startRow;
        that.requestModel.endRow = that.allForJobGridService.getCurrentRowIndex().endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;
        // console.log(`requestModel = `, that.requestModel);
        // that.requestModel.filterModel = that.setFilter();
        that.requestModel.searchModel = that.setSearch();
        if (that.authService.isRefreshNeeded2()) {
          that.authService
            .renewToken()
            .then(value => {
              that.authService.user = value;
              that.authService.saveTokenAndSetUserRights2(value, '');

              that.meterUnitsTypeService.getGridMeterUnitsForJob(that.requestModel).subscribe(response => {
                that.gridApi.hideOverlay();

                that.totalCount = 0;
                that.setTitle(response.jobDescription);

                if ((response === undefined || response == null || response.grid.totalCount === 0) && that.noSearch() && that.noFilters()) {
                  that.noData = true;
                } else if (response.grid.totalCount === 0) {
                  that.gridApi.showNoRowsOverlay();
                }

                that.totalCount = response.grid.totalCount;
                that.gridApi.paginationGoToPage(that.allForJobGridService.getSessionSettingsPageIndex());
                paramsRow.successCallback(response.grid.data, response.grid.totalCount);
                that.selectRows(that.gridApi);
                that.eventService.setIsSelectedAll(that.allForJobGridService.getSessionSettingsSelectedAll());
                // params.failCallback();
              });
            })
            .catch(err => {
              if (err.message === 'login_required') {
                that.authService.login().catch(errDetail => console.log(errDetail));
              }
            });
        } else {
          console.log(`requestModel = `, that.requestModel);
          that.meterUnitsTypeService.getGridMeterUnitsForJob(that.requestModel).subscribe(response => {
            that.gridApi.hideOverlay();
            that.totalCount = 0;
            that.setTitle(response.jobDescription);

            if ((response === undefined || response == null || response.grid.totalCount === 0) && that.noSearch() && that.noFilters()) {
              that.noData = true;
            } else if (response.grid.totalCount === 0) {
              that.gridApi.showNoRowsOverlay();
            }

            that.totalCount = response.grid.totalCount;
            that.gridApi.paginationGoToPage(that.allForJobGridService.getSessionSettingsPageIndex());
            paramsRow.successCallback(response.grid.data, response.grid.totalCount);
            that.selectRows(that.gridApi);
            that.eventService.setIsSelectedAll(that.allForJobGridService.getSessionSettingsSelectedAll());
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
    this.allForJobGridService.onColumnVisibility(params);
  }

  // on close tool panel reload filter model
  toolPanelChanged(params) {
    if (params.source === undefined) {
      if (
        !this.allForJobGridService.checkIfFilterModelAndCookieAreSame(
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

        this.allForJobGridService.setSessionSettingsPageIndex(0);
        this.allForJobGridService.setSessionSettingsSelectedAll(false);
        this.allForJobGridService.setSessionSettingsSelectedRows([]);
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
      this.allForJobGridService.setSessionSettingsPageIndex(params.api.paginationGetCurrentPage());
    } else if (!params.newPage && params.keepRenderedRows && this.loadGrid) {
      this.loadGrid = false;
      params.api.paginationGoToPage(this.allForJobGridService.getSessionSettingsPageIndex());
    }
  }

  // if selected-all clicked, than disable deselection of the rows
  onRowSelect(params) {
    this.allForJobGridService.setSessionSettingsSelectedRows(params.node);
    if (this.allForJobGridService.getSessionSettingsSelectedAll()) {
      // && !this.programmaticallySelectRow) {
      params.node.setSelected(true);
    }
  }

  onFirstDataRendered(params) {}

  refresh() {
    // if (this.authService.isTokenAvailable()) {
    // const requestIds = this.allForJobGridService.getAllMyGridLinkRequestIds();
    // // console.log(`refresh `, requestIds);
    // if (requestIds && requestIds.length > 0) {
    //   requestIds.map(requestId =>
    //     this.service.getMyGridLastStatus(requestId).subscribe(results => {
    //       const okRequest = _.find(results, x => x.status === this.taskStatusOK && x.isFinished);
    //       if (okRequest !== undefined) {
    //         const badRequest = _.find(results, x => x.status !== this.taskStatusOK);
    //         if (badRequest === undefined) {
    //           // no devices with unsuccessful status, we can delete requestId from session
    //           this.allForJobGridService.removeMyGridLinkRequestId(requestId);
    //           const breakerStateRequests = this.allForJobGridService.getAllMyGridLink_BreakerState_RequestIds();
    //           const isBreakerState = _.find(breakerStateRequests, x => x === requestId);
    //           // 3th step for breaker state
    //           if (isBreakerState) {
    //             this.service.getOnDemandDataProcessing(requestId).subscribe(resultsBreakerState => {
    //               // console.log(`getOnDemandDataProcessing = `, resultsBreakerState);
    //               if (resultsBreakerState) {
    //                 this.meterUnitsTypeService.updateReaderState(resultsBreakerState).subscribe(() => this.refreshGrid());
    //               }
    //               this.allForJobGridService.removeMyGridLink_BreakerState_RequestId(requestId);
    //             });
    //           }
    //           this.toast.successToast(this.messageDataRefreshed);
    //         }
    //       } else {
    //         const badRequest = _.find(results, x => x.status !== this.taskStatusOK && x.isFinished);
    //         if (badRequest !== undefined) {
    //           this.toast.errorToast(this.messageActionFailed);
    //           this.allForJobGridService.removeMyGridLinkRequestId(requestId);
    //           this.allForJobGridService.removeMyGridLink_BreakerState_RequestId(requestId);
    //         }
    //       }
    //     })
    //   );

    this.refreshGrid();
    this.deselectAll();

    // }
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
      !this.allForJobGridService.checkIfFilterModelAndCookieAreSame(
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
    const search = this.allForJobGridService.getSessionSettingsSearchedText();
    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search }]);
    }
    return [];
  }

  // select rows on load grid from session
  selectRows(api: any) {
    this.programmaticallySelectRow = true;
    const selectedAll = this.allForJobGridService.getSessionSettingsSelectedAll();
    const selectedRows = this.allForJobGridService.getSessionSettingsSelectedRows();
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
  public setTitle(jobDescription?: string) {
    // const selectedType = this.meterTypes$.find(x => x.id === id);
    // if (selectedType !== undefined && selectedType != null) {
    //   this.headerTitle = selectedType.value + ' ' + this.staticTextService.headerTitleMeterUnitsAll;
    // }
    if (jobDescription === undefined || jobDescription.trim().length === 0) {
      jobDescription = this.staticTextService.notAvailableTekst;
    }

    this.headerTitle = `${this.staticTextService.headerTitleMeterUnitsAll} ${jobDescription}`;
  }

  onRemoveFromJob() {
    const selectedRows = this.gridApi.getSelectedRows();
    const deviceIdsParam = [];

    console.log('selectedRows', selectedRows);

    let selectedDeviceCount = this.totalCount;

    const selectedAll = this.allForJobGridService.getSessionSettingsSelectedAll();
    if (!selectedAll && selectedRows && selectedRows.length > 0) {
      selectedRows.map(row => deviceIdsParam.push(row.deviceId));
      console.log(`RemoveScheduleDevicesFromJob deviceIdsParam = ${JSON.stringify(deviceIdsParam)}`);
      selectedDeviceCount = deviceIdsParam.length;
    }

    const selectedText = `${selectedDeviceCount}`;
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.btnConfirmText = this.i18n('Confirm');
    let response: Observable<any> = new Observable();

    const request: RequestMeterUnitsForJob = {
      requestId: null,
      scheduleId: this.requestModel.scheduleId,
      startRow: 0,
      endRow: 0,
      sortModel: [],
      searchModel: this.requestModel.searchModel,
      filterModel: this.requestModel.filterModel,
      deviceIds: deviceIdsParam
    };

    console.log('removeMeterUnits.request', request);
    response = this.meterUnitsTypeService.removeMeterUnitsFromJob(request);

    component.btnConfirmText = this.i18n('Remove');
    component.modalTitle = this.i18n('Confirm bulk operation');
    component.modalBody = this.i18n(`Remove ${selectedText} Meter Unit(s) from Job?`);

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        // this.toast.successToast(this.messageActionInProgress);
        response.subscribe(
          value => {
            // this.allForJobGridService.saveMyGridLinkRequestId(value.requestId);
            this.toast.successToast(this.i18n('Selected Meter Units removed successfully.'));
            this.refresh();
          },
          e => {
            this.toast.errorToast(this.messageServerError);
          }
        );
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }

  // bulkOperation(operation: MeterUnitsTypeEnum) {
  //   // if (this.authService.isTokenAvailable()) {
  //   const selectedRows = this.gridApi.getSelectedRows();
  //   const deviceIdsParam = [];
  //   if (selectedRows && selectedRows.length > 0) {
  //     selectedRows.map(row => deviceIdsParam.push(row.deviceId));
  //     console.log(`deviceIdsParam = ${JSON.stringify(deviceIdsParam)}`);
  //   }
  //   let selectedText = `${deviceIdsParam.length} rows `;
  //   const modalRef = this.modalService.open(ModalConfirmComponent);
  //   const component: ModalConfirmComponent = modalRef.componentInstance;
  //   component.btnConfirmText = this.i18n('Confirm');
  //   let response: Observable<any> = new Observable();

  //   // TODO: ONLY FOR TESTING !!!
  //   // deviceIdsParam = [];
  //   // deviceIdsParam.push('221A39C5-6C84-4F6E-889C-96326862D771');
  //   // deviceIdsParam.push('23a8c3e2-b493-475f-a234-aa7491eed2de');

  //   const params: RequestConnectDisconnectData = { deviceIds: deviceIdsParam };
  //   let operationName = '';
  //   switch (operation) {
  //     case MeterUnitsTypeEnum.breakerStatus:
  //       response = this.service.getDisconnectorState(params);
  //       operationName = this.i18n('Get breaker status');
  //       selectedText = `${this.i18n('for')} ${selectedText}`;
  //       break;
  //     case MeterUnitsTypeEnum.connect:
  //       response = this.service.postMyGridConnectDevice(params);
  //       operationName = this.i18n('Connect');
  //       break;
  //     case MeterUnitsTypeEnum.disconnect:
  //       response = this.service.postMyGridDisconnectDevice(params);
  //       operationName = this.i18n('Disconnect');
  //       break;
  //     case MeterUnitsTypeEnum.touConfig:
  //       const paramsConf: RequestTOUData = { deviceIds: deviceIdsParam, timeOfUseId: '1' }; // TODO: timeOfUseId read form store?
  //       response = this.service.postMyGridTOUDevice(paramsConf);
  //       operationName = this.i18n('Configure TOU');
  //       selectedText = `${this.i18n('for')} ${selectedText}`;
  //   }
  //   component.btnConfirmText = operationName;
  //   component.modalTitle = this.i18n('Confirm bulk operation');
  //   component.modalBody = this.i18n(`${operationName} ${selectedText} selected meter unit(s)?`);

  //   modalRef.result.then(
  //     data => {
  //       // on close (CONFIRM)
  //       this.toast.successToast(this.messageActionInProgress);
  //       response.subscribe(
  //         value => {
  //           this.meterUnitsTypeGridService.saveMyGridLinkRequestId(value.requestId);
  //           if (operation === MeterUnitsTypeEnum.breakerStatus) {
  //             this.meterUnitsTypeGridService.saveMyGridLink_BreakerState_RequestId(value.requestId);
  //           }
  //         },
  //         e => {
  //           this.toast.errorToast(this.messageServerError);
  //         }
  //       );
  //     },
  //     reason => {
  //       // on dismiss (CLOSE)
  //     }
  //   );
  //   /* } else {
  //     this.service.getMyGridIdentityToken().subscribe(
  //       value => {
  //         this.authService.setAuthTokenMyGridLink(value);
  //         this.bulkOperation(operation);
  //       },
  //       e => {
  //         this.toast.errorToast(this.messageServerError);
  //       }
  //     );
  //   }*/
  // }
}