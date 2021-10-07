import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { AddMuFormComponent } from './../../common/components/add-mu-form/add-mu-form.component';
import { GridUtils } from 'src/app/features/global/grid.utils';
import { SidebarToggleService } from './../../../../shared/base-template/components/services/sidebar.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MeterUnitsTypeGridService } from '../services/meter-units-type-grid.service';
import { MeterUnitsTypeStaticTextService } from '../services/meter-units-type-static-text.service';
import { GridSettingsCookieStoreService } from 'src/app/core/utils/services/grid-settings-cookie-store.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MeterUnitsTypeGridEventEmitterService } from '../services/meter-units-type-grid-event-emitter.service';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { GridRequestParams, GridSortParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
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
import { AgGridSharedFunctionsService } from 'src/app/shared/ag-grid/services/ag-grid-shared-functions.service';
import { GridColumnShowHideService } from 'src/app/core/ag-grid-helpers/services/grid-column-show-hide.service';
import { MeterUnitsPlcActionsService } from '../services/meter-units-plc-actions.service';
import { FiltersInfo } from 'src/app/shared/forms/interfaces/filters-info.interface';
import { SettingsStoreService } from 'src/app/core/repository/services/settings-store/settings-store.service';
import { SettingsStoreEmitterService } from 'src/app/core/repository/services/settings-store/settings-store-emitter.service';
import { MeterUnitsTypeGridLayoutStore } from '../interfaces/meter-units-type-grid-layout.store';
import { JobsSelectGridService } from 'src/app/features/jobs/jobs-select/services/jobs-select-grid.service';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ConcentratorService } from '../../../../core/repository/services/concentrator/concentrator.service';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-meter-units',
  templateUrl: './meter-units-list.component.html'
})
export class MeterUnitsListComponent implements OnInit, OnDestroy {
  id = 0;
  sessionNameForGridFilter = 'grdLayoutMUT';
  // taskStatusOK = 'TASK_PREREQ_FAILURE'; // TODO: ONLY FOR DEBUG !!!
  taskStatusOK = 'TASK_SUCCESS';
  refreshInterval = gridRefreshInterval;
  // grid variables
  columns = [];
  totalCount = 0;
  filtersInfo: FiltersInfo;
  // N/A
  notAvailableText = this.staticTextService.notAvailableTekst;
  overlayNoRowsTemplate = this.staticTextService.noRecordsFound;
  overlayLoadingTemplate = this.staticTextService.loadingData;
  noData = false;
  public hideFilter = true;
  // ---------------------- ag-grid ------------------
  agGridSettings = configAgGrid;
  public modules: Module[] = AllModules;
  public gridOptions: Partial<GridOptions>;
  public gridApi;
  public icons;
  public frameworkComponents;
  public sideBar;
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
      // vendors: [{ id: 0, value: '' }],
      readStatus: {
        operation: { id: '', value: '' },
        value1: 0,
        value2: null
      },
      firmware: [{ id: 0, value: '' }],
      disconnectorState: [{ id: 0, value: '' }],
      ciiState: [{ id: 0, value: '' }],
      showChildInfoMBus: false,
      showWithoutTemplate: false,
      showOptionFilter: [{ id: 0, value: '' }]
    }
  };
  requestId = '';
  dataResult = '';
  public localeText;
  messageDataRefreshed = this.translate.instant('COMMON.DATA-REFRESHED') + '!';
  messageActionFailed = this.translate.instant('COMMON.ACTION-FAILED') + '!';
  meterUnitsTypeGridLayoutStoreKey = 'mu-type-grid-layout';
  meterUnitsTypeGridLayoutStore: MeterUnitsTypeGridLayoutStore;
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
  isSearchByParent = false;
  gridData: any;
  private paramsSub: Subscription;
  private subscription: Subscription;
  private layoutChangeSubscription: Subscription;
  private gridColumnApi;

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
    private sidebarToggleService: SidebarToggleService,
    private settingsStoreService: SettingsStoreService,
    private settingsStoreEmitterService: SettingsStoreEmitterService,
    private jobsSelectGridService: JobsSelectGridService,
    private modalService: ModalService,
    private concentratorService: ConcentratorService,
    private translate: TranslateService
  ) {
    this.filtersInfo = {
      isSet: false,
      count: 0,
      text: staticTextService.noFilterAppliedTekst
    };

    this.breadcrumbService.setPageName('');

    // this.paramsSub = route.params.subscribe((params) => {
    // this.id = params.id;
    meterUnitsTypeGridService.meterUnitsTypeId = null;
    this.sessionNameForGridFilter = this.sessionNameForGridFilter.includes('grdLayoutMUT') ? this.sessionNameForGridFilter : 'grdLayoutMUT';

    if (this.gridApi) {
      this.gridApi.purgeServerSideCache([]);
    }

    if (this.gridColumnApi) {
      const dataFromCookie = this.meterUnitsTypeGridService.getCookieData(); // saved columns settings
      if (dataFromCookie) {
        this.gridColumnApi.setColumnState(dataFromCookie);
      }
    }

    this.frameworkComponents = meterUnitsTypeGridService.setFrameworkComponents();
    this.gridOptions = this.meterUnitsTypeGridService.setGridOptions(this);
    this.layoutChangeSubscription = this.eventService.eventEmitterLayoutChange.subscribe({
      next: (event: MeterUnitsLayout) => {
        if (event !== null) {
          this.requestModel.filterModel.statuses = event.statusesFilter;
          this.requestModel.filterModel.vendors = event.vendorsFilter;
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
          this.requestModel.filterModel.protocol = event.protocolFilter;
          this.requestModel.filterModel.medium = event.mediumFilter;

          this.gridColumnApi.setColumnState(event.gridLayout);
          this.meterUnitsTypeGridService.setSessionSettingsPageIndex(0);
          this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
          this.meterUnitsTypeGridService.setSessionSettingsExcludedRows([]);
          this.requestModel.filterModel.showOptionFilter = event.showOptionFilter;
        }
        this.gridApi.onFilterChanged();
        this.setFilterInfo();
      }
    });

    this.eventService.eventEmitterDevicesDeleted.subscribe({
      next: () => {
        this.deselectAll();
        if (this.gridApi) {
          this.gridApi.purgeServerSideCache([]);
        }
      }
    });

    // subscribe to changes of columns visibility from other components
    this.subscription = gridColumnShowHideService.listOfColumnsVisibilityChanged$.subscribe((listOfVisibleColumns) => {
      gridColumnShowHideService.refreshGridWithColumnsVisibility(this.gridColumnApi, listOfVisibleColumns);
    });

    this.form = this.createForm(this.pageSizes[0]);
  }

  // permission rights
  get permissionMuManage() {
    return PermissionEnumerator.Manage_Meters;
  }

  get permissionManageJobs() {
    return PermissionEnumerator.Manage_Jobs;
  }

  get permissionManageAutoTemplates() {
    return PermissionEnumerator.Manage_Auto_Template_Rules;
  }

  get permissionFwUpgrade() {
    return PermissionEnumerator.Meter_FW_Upgrade;
  }

  get permissionDisconnectorConnect() {
    return PermissionEnumerator.Disconnector_Connect;
  }

  get permissionDisconnectorDisconnect() {
    return PermissionEnumerator.Disconnector_Disconnect;
  }

  get permissionDisconnectorGetState() {
    return PermissionEnumerator.Disconnector_Get_State;
  }

  get permissionDisconnectorSetMode() {
    return PermissionEnumerator.Disconnector_Set_Mode;
  }

  get permissionCiiActivate() {
    return PermissionEnumerator.CII_Activate;
  }

  get permissionCiiDeactivate() {
    return PermissionEnumerator.CII_Deactivate;
  }

  get permissionCiiState() {
    return PermissionEnumerator.CII_Get_State;
  }

  get permissionRelaysConnect() {
    return PermissionEnumerator.Relay_Connect;
  }

  get permissionRelaysDisconnect() {
    return PermissionEnumerator.Relay_Disconnect;
  }

  get permissionRelaysState() {
    return PermissionEnumerator.Relay_Get_State;
  }

  get permissionRelaysSetMode() {
    return PermissionEnumerator.Relay_Set_Mode;
  }

  get permissionTouUpload() {
    return PermissionEnumerator.TOU_Upload;
  }

  get permissionSetLimiter() {
    return PermissionEnumerator.Set_Limiter;
  }

  get permissionSetMonitor() {
    return PermissionEnumerator.Set_Monitor;
  }

  get permissionClearFF() {
    return PermissionEnumerator.Clear_FF;
  }

  get permissionSetDisplay() {
    return PermissionEnumerator.Set_Display;
  }

  get permissionClearAlarms() {
    return PermissionEnumerator.Clear_Alarms;
  }

  get permissionAssignTemplates() {
    return PermissionEnumerator.Assign_Templates;
  }

  get permissionSecurityActivateHls() {
    return PermissionEnumerator.Activate_HLS;
  }

  get permissionSecurityRekey() {
    return PermissionEnumerator.Rekey;
  }

  get permissionSecurityChangePassword() {
    return PermissionEnumerator.Change_Password;
  }

  get permissionReadMeter() {
    return PermissionEnumerator.Read_Meter;
  }

  get permissionSyncTime() {
    return PermissionEnumerator.Sync_Time;
  }

  // checking if at least one row on the grid is selected
  get selectedAtLeastOneRowOnGrid() {
    if (this.gridApi) {
      const selectedRows = this.meterUnitsTypeGridService.getSessionSettingsSelectedRows();
      return selectedRows && selectedRows.length > 0;
    }
    return false;
  }

  get pageSizeProperty() {
    return 'pageSize';
  }

  ngOnInit() {
    // set grid columns
    this.columns = this.meterUnitsTypeGridService.setGridDefaultColumns(false);
    // set right sidebar on the grid
    // this.sideBar = this.meterUnitsTypeGridService.setSideBar(); // no sidebar anymore

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

    this.deleteAllRequests();
  }

  // ag-grid

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

  // search string changed call get data
  searchData($event: string) {
    if (this.isGridLoaded && this.areSettingsLoaded) {
      if ($event !== this.meterUnitsTypeGridService.getSessionSettingsSearchedText()) {
        this.deselectAll();
        this.meterUnitsTypeGridService.setSessionSettingsSearchedText($event);

        const useWildcards = this.meterUnitsTypeGridService.getSessionSettingsSearchedWildcards();
        this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event, useWildcards }];

        this.meterUnitsTypeGridService.setSessionSettingsPageIndex(0);
        this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
        this.meterUnitsTypeGridService.setSessionSettingsExcludedRows([]);
        this.setGridDataSource();
        this.gridApi.onFilterChanged();
      }
    }
  }

  // ----------------------- ag-grid set DATASOURCE ------------------------------
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.agGridSharedFunctionsService.addSelectDeselectAllText();

    this.getMeterUnitsLayoutGridLayoutStore();
  }

  // ----------------------- ag-grid sets DATASOURCE end --------------------------

  onFirstDataRendered(params) {}

  // ag-grid change visibillity of columns
  onColumnVisible(params) {
    this.meterUnitsTypeGridService.onColumnVisibility(params);

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
    const search = this.meterUnitsTypeGridService.getSessionSettingsSearchedText();

    let useWildcards = this.meterUnitsTypeGridService.getSessionSettingsSearchedWildcards();
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
      !this.meterUnitsTypeGridService.checkIfFilterModelAndCookieAreSame(
        this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter),
        this.requestModel.filterModel
      )
    ) {
      this.setFilterInfo();
      const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;

      this.requestModel.filterModel.statuses = filterDCU.statusesFilter;
      this.requestModel.filterModel.tags = filterDCU.tagsFilter;
      this.requestModel.filterModel.readStatus = {
        operation: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.operation : { id: '', value: '' },
        value1: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value1 : 0,
        value2: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value2 : 0
      };
      this.requestModel.filterModel.firmware = filterDCU.firmwareFilter;
      this.requestModel.filterModel.disconnectorState = filterDCU.breakerStateFilter;
      this.requestModel.filterModel.ciiState = filterDCU.ciiStateFilter;
      this.requestModel.filterModel.showOptionFilter = filterDCU.showOptionFilter;
      this.requestModel.filterModel.showChildInfoMBus = filterDCU.showOnlyMeterUnitsWithMBusInfoFilter;
      this.requestModel.filterModel.showWithoutTemplate = filterDCU.showMeterUnitsWithoutTemplateFilter;
      this.requestModel.filterModel.readyForActivation = filterDCU.showOnlyImageReadyForActivationFilter;
      this.requestModel.filterModel.vendors = filterDCU.vendorsFilter;
      this.requestModel.filterModel.protocol = filterDCU.protocolFilter;
      this.requestModel.filterModel.medium = filterDCU.mediumFilter;
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
      filterInfo.vendorsFilter && filterInfo.vendorsFilter.length > 0 ? true : false,
      filterInfo.tagsFilter && filterInfo.tagsFilter.length > 0,
      filterInfo.readStatusFilter && filterInfo.readStatusFilter.operation && filterInfo.readStatusFilter.operation.id.length > 0
        ? true
        : false,
      filterInfo.firmwareFilter && filterInfo.firmwareFilter.length > 0,
      filterInfo.breakerStateFilter && filterInfo.breakerStateFilter.length > 0,
      filterInfo.ciiStateFilter && filterInfo.ciiStateFilter.length > 0,
      filterInfo.showOptionFilter && filterInfo.showOptionFilter.length > 0,
      filterInfo.protocolFilter && filterInfo.protocolFilter.length > 0,
      filterInfo.mediumFilter && filterInfo.mediumFilter.length > 0
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
    const currentSessionPage = this.meterUnitsTypeGridService.getSessionSettingsPageIndex();

    if (currentApiPage !== currentSessionPage) {
      if (this.isGridLoaded && this.areSettingsLoaded) {
        if (params.newPage) {
          this.meterUnitsTypeGridService.setSessionSettingsPageIndex(currentApiPage);
        }
      } else {
        // params.api.paginationGoToPage(currentSessionPage);
      }
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
    api.forEachNode((node) => {
      if (selectedAll) {
        const startRow = api.getFirstDisplayedRow();
        const endRow = api.getLastDisplayedRow();
        const excludedRows = this.meterUnitsTypeGridService.getSessionSettingsExcludedRows();
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

  // form actions

  // tsg button click
  onTag() {
    //
  }

  // --> Operations action click (bulk or selected row)
  onDisconnectorStatus(selectedGuid: string) {
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.breakerStatus,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onActivateUpgrade(selectedGuid: string) {
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.activateUpgrade,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onConnect(selectedGuid: string) {
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.connect,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onDisconnect(selectedGuid: string) {
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.disconnect,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onCiiState(selectedGuid: string) {
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.ciiState,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onCiiActivate(selectedGuid: string) {
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.ciiActivate,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onCiiDeactivate(selectedGuid: string) {
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.ciiDeactivate,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onClearFF(selectedGuid: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.clearFF,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  // TODO missing BE api !!
  onDelete(selectedGuid: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );

    this.plcActionsService.onDelete(params, selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount());
  }

  onAdd() {
    this.jobsSelectGridService.clearSessionSettingsSelectedRows();
    const options: NgbModalOptions = {
      size: 'lg'
    };
    const modalRef = this.modalService.open(AddMuFormComponent, options);
    modalRef.result
      .then((result) => {
        this.refreshGrid();
      })
      .catch(() => {});
  }

  // delete button click

  // popup
  onScheduleReadJobs(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onScheduleReadJobs(params, selectedGuid?.length > 0 ? 1 : this.getSelectedCount());
  }

  onJobsAssignExisting(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onJobsAssignExisting(params, selectedGuid?.length > 0 ? 1 : this.getSelectedCount());
  }

  onJobsTemplates(selectedGuid: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.onJobsTemplates(params, selectedGuid?.length > 0 ? 1 : this.getSelectedCount());
  }

  // popup
  onTou(selectedGuid: string) {
    const actionName = this.translate.instant('PLC-METER.TOU-UPLOAD');
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.onTou(params, selectedGuid?.length > 0 ? 1 : this.getSelectedCount(), actionName);
  }

  // popup
  onUpgrade(selectedGuid: string) {
    const actionName = this.translate.instant('PLC-METER.UPLOAD-IMAGE');
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.onUpgrade(params, selectedGuid?.length > 0 ? 1 : this.getSelectedCount(), actionName);
  }

  // popup
  onSetMonitor(selectedGuid: string) {
    const actionName = this.translate.instant('PLC-METER.SET-MONITOR');
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onSetMonitor(params, selectedGuid?.length > 0 ? 1 : this.getSelectedCount(), actionName);
  }

  // popup
  onSetLimiter(selectedGuid: string) {
    const actionName = this.translate.instant('PLC-METER.SET-LIMITER');
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onSetLimiter(params, selectedGuid?.length > 0 ? 1 : this.getSelectedCount(), actionName);
  }

  // popup
  onReadLimiterThreshold(selectedGuid: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.readThresholdsLimiter,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  onReadMonitorThreshold(selectedGuid: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.readThresholdsMonitor,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  // popup
  onRelaysConnect(selectedGuid: string) {
    const actionName = this.translate.instant('PLC-METER.RELAY-CONNECT');
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onRelaysConnect(params, paramsLegacy, selectedGuid?.length > 0 ? 1 : this.getSelectedCount(), actionName);
  }

  // popup
  onRelaysDisconnect(selectedGuid: string) {
    const actionName = this.translate.instant('PLC-METER.RELAY-DISCONNECT');
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onRelaysDisconnect(params, paramsLegacy, selectedGuid?.length > 0 ? 1 : this.getSelectedCount(), actionName);
  }

  // popup
  onRelaysState(selectedGuid: string) {
    const actionName = this.translate.instant('PLC-METER.RELAY-STATE');
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onRelaysState(params, paramsLegacy, selectedGuid?.length > 0 ? 1 : this.getSelectedCount(), actionName);
  }

  // popup
  onRelaysSetMode(selectedGuid: string) {
    const actionName = this.translate.instant('PLC-METER.RELAY-MODE');
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    const paramsLegacy = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.onRelaysSetMode(params, paramsLegacy, selectedGuid?.length > 0 ? 1 : this.getSelectedCount(), actionName);
  }

  // popup
  onDisconnectorMode(selectedGuid: string) {
    const actionName = this.translate.instant('PLC-METER.BREAKER-MODE');
    // const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.onDisconnectorMode(params, selectedGuid?.length > 0 ? 1 : this.getSelectedCount(), actionName);
  }

  // popup
  onSetDisplaySettings(selectedGuid: string) {
    const actionName = this.translate.instant('PLC-METER.SET-DISPLAY-SETTINGS');
    const paramsOld = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );

    this.plcActionsService.onSetDisplaySettings(paramsOld, params, selectedGuid?.length > 0 ? 1 : this.getSelectedCount(), actionName);
  }

  // on clear alarms
  onClearAlarms(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.clearAlarms,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount()
    );
  }

  // popup
  onReadMeter(selectedGuid?: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );
    this.plcActionsService.onReadRegisters(params, selectedGuid?.length > 0 ? 1 : this.getSelectedCount());
  }

  // --> for checking long bulk action finished
  deleteAllRequests() {
    const requestIds = this.meterUnitsTypeGridService.getAllMyGridLinkRequestIds();
    if (requestIds && requestIds.length > 0) {
      requestIds.map((requestId) => this.meterUnitsTypeGridService.removeMyGridLinkRequestId(requestId));
    }
  }

  refresh() {
    const requestIds = this.meterUnitsTypeGridService.getAllMyGridLinkRequestIds();
    if (requestIds && requestIds.length > 0) {
      requestIds.map((requestId) =>
        this.service.getMyGridLastStatus(requestId).subscribe((results) => {
          const okRequest = _.find(results, (x) => x.status === this.taskStatusOK && x.isFinished);
          if (okRequest !== undefined) {
            const badRequest = _.find(results, (x) => x.status !== this.taskStatusOK);
            if (badRequest === undefined) {
              // no devices with unsuccessful status, we can delete requestId from session
              this.meterUnitsTypeGridService.removeMyGridLinkRequestId(requestId);
              const breakerStateRequests = this.meterUnitsTypeGridService.getAllMyGridLink_BreakerState_RequestIds();
              const isBreakerState = _.find(breakerStateRequests, (x) => x === requestId);

              // 3th step for breaker state
              if (isBreakerState) {
                this.service.getOnDemandDataProcessing(requestId).subscribe((resultsBreakerState) => {
                  if (resultsBreakerState) {
                    this.meterUnitsTypeService.updateReaderState(resultsBreakerState).subscribe(() => this.refreshGrid());
                  }
                  this.meterUnitsTypeGridService.removeMyGridLink_BreakerState_RequestId(requestId);
                });
              }

              // 4th step for CII state
              const ciiStateRequests = this.meterUnitsTypeGridService.getAllMyGridLink_CiiState_RequestIds();
              const isCiiState = _.find(ciiStateRequests, (x) => x === requestId);
              if (isCiiState) {
                this.service.getOnDemandDataProcessing(requestId).subscribe((resultsCiiState) => {
                  this.meterUnitsTypeGridService.removeMyGridLink_CiiState_RequestId(requestId);
                });
              }

              // 5th step for relays state
              const isRelaysState = _.find(ciiStateRequests, (x) => x === requestId);
              if (isRelaysState) {
                this.service.getOnDemandDataProcessing(requestId).subscribe((resultsRelaysState) => {
                  this.meterUnitsTypeGridService.removeMyGridLink_RelaysState_RequestId(requestId);
                });
              }

              this.toast.successToast(this.messageDataRefreshed);
            }
          } else {
            const badRequest = _.find(results, (x) => x.status !== this.taskStatusOK && x.isFinished);
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
  }

  // <-- end Operations action click (bulk or selected row)

  onSecurityActivateHls(selectedGuid: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );

    this.plcActionsService.onSecurityActivateHls(params, selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount());
  }

  onSecurityRekey(selectedGuid: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );

    this.plcActionsService.onSecurityRekey(params, selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount());
  }

  // --> start Security action click (bulk or selected row)

  onSecurityChangePassword(selectedGuid: string) {
    const params = this.plcActionsService.getOperationRequestParam(
      selectedGuid,
      this.requestModel,
      this.getSelectedCount(),
      this.getSearchColumnNames()
    );

    this.plcActionsService.onSecurityChangePassword(params, selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount());
  }

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
        return selectedCount + this.translate.instant('GRID.OF') + this.totalCount;
      }
    } else {
      return `${selectedCount}`;
    }
  }

  // <-- end  Security action click (bulk or selected row)

  showRegisters(deviceId: string) {
    this.router.navigate(['/meterUnits/registers', deviceId]);
  }

  showItem(deviceId: string) {
    this.router.navigate(['/meterUnits/details', deviceId]);
  }

  toggleFilter() {
    if (this.areSettingsLoaded) {
      this.hideFilter = !this.hideFilter;
      this.saveSettingsStore(this.requestModel.sortModel);
    }
  }

  filterChanged() {
    this.reloadGrid();
    this.deselectAll();
  }

  gridSizeChanged() {
    this.resizeColumns();
  }

  getAllDisplayedColumnsNames(): string[] {
    const columns = this.gridApi.columnController.getAllDisplayedColumns();
    return columns.map((c) => c.colId);
  }

  getSearchColumnNames(): string[] {
    const parentColumnName = 'parent';
    const displayedColumns = this.getAllDisplayedColumnsNames();

    if (this.isSearchByParent && displayedColumns.lastIndexOf(parentColumnName) < 0) {
      displayedColumns.push(parentColumnName);
    }

    return displayedColumns;
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

        const displayedColumnsNames = that.getSearchColumnNames();

        that.requestModel.typeId = that.id; // type of meter units
        that.requestModel.startRow = that.meterUnitsTypeGridService.getCurrentRowIndex(that.selectedPageSize.id).startRow;
        that.requestModel.endRow = that.meterUnitsTypeGridService.getCurrentRowIndex(that.selectedPageSize.id).endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;

        that.requestModel.filterModel = that.setFilter();
        that.requestModel.searchModel = that.setSearch();

        if (that.isGridLoaded) {
          that.saveSettingsStore(that.requestModel.sortModel);
        }

        that.meterUnitsTypeService
          .getGridMeterUnitsForm(that.requestModel, that.meterUnitsTypeGridService.getSessionSettingsPageIndex(), displayedColumnsNames)
          .subscribe((data) => {
            that.gridData = data;
            const deviceIds = data.data.map((gridData) => gridData.deviceId);

            that.gridApi.hideOverlay();

            if (data.totalCount === 0) {
              that.totalCount = 0;
              // that.noData = true;
              that.gridApi.showNoRowsOverlay();
            } else {
              that.totalCount = data.totalCount;
              // that.noData = false;
            }

            paramsRow.successCallback(data ? data.data : [], that.totalCount);

            that.gridApi.paginationGoToPage(that.meterUnitsTypeGridService.getSessionSettingsPageIndex());

            that.selectRows(that.gridApi);
            // that.eventService.setIsSelectedAll(that.meterUnitsTypeGridService.getSessionSettingsSelectedAll());
            // params.failCallback();

            that.isGridLoaded = true;
            that.resizeColumns();
            that.getAdditionalData(deviceIds);
          });
        // }
      }
    };
    that.gridApi.setServerSideDatasource(that.datasource);
  }

  getMeterUnitsLayoutGridLayoutStore() {
    this.settingsStoreService.getCurrentUserSettings(this.meterUnitsTypeGridLayoutStoreKey).subscribe(
      (settings) => {
        this.meterUnitsTypeGridLayoutStore = settings as MeterUnitsTypeGridLayoutStore;
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

  addSettingsToSession(settings: MeterUnitsTypeGridLayoutStore) {
    if (settings) {
      if (settings.currentPageIndex) {
        this.meterUnitsTypeGridService.setSessionSettingsPageIndex(settings.currentPageIndex);
      }

      if (settings.meterUnitsLayout) {
        this.gridFilterSessionStoreService.setGridLayout(this.sessionNameForGridFilter, settings.meterUnitsLayout);
      }

      if (settings.sortModel && this.gridColumnApi) {
        this.requestModel.sortModel = settings.sortModel;
        this.gridColumnApi.applyColumnState({ state: settings.sortModel });
      }

      const querySearch = this.route.snapshot.queryParams.search;
      if (querySearch && querySearch.length > 0) {
        this.meterUnitsTypeGridService.setSessionSettingsSearchedText(querySearch);
        this.meterUnitsTypeGridService.setSessionSettingsSearchedWildcards(true);
        this.saveSettingsStore(this.requestModel.sortModel);
        this.isSearchByParent = true;
      } else {
        if (settings.searchText) {
          this.meterUnitsTypeGridService.setSessionSettingsSearchedText(settings.searchText);
        }

        if (settings.searchWildcards) {
          this.meterUnitsTypeGridService.setSessionSettingsSearchedWildcards(settings.searchWildcards);
        }
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
    const store: MeterUnitsTypeGridLayoutStore = {
      currentPageIndex: this.meterUnitsTypeGridService.getSessionSettingsPageIndex(),
      meterUnitsLayout: this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout,
      sortModel: sortModel ? sortModel : this.meterUnitsTypeGridLayoutStore.sortModel,
      searchText: this.meterUnitsTypeGridService.getSessionSettingsSearchedText(),
      searchWildcards: this.meterUnitsTypeGridService.getSessionSettingsSearchedWildcards(),
      visibleColumns: this.getAllDisplayedColumnsNames(),
      pageSize: this.selectedPageSize,
      hideFilter: this.hideFilter
    };

    if (
      !this.meterUnitsTypeGridLayoutStore ||
      store.currentPageIndex !== this.meterUnitsTypeGridLayoutStore.currentPageIndex ||
      JSON.stringify(store.meterUnitsLayout) !== JSON.stringify(this.meterUnitsTypeGridLayoutStore.meterUnitsLayout) ||
      JSON.stringify(store.sortModel) !== JSON.stringify(this.meterUnitsTypeGridLayoutStore.sortModel) ||
      store.searchText !== this.meterUnitsTypeGridLayoutStore.searchText ||
      store.searchWildcards !== this.meterUnitsTypeGridLayoutStore.searchWildcards ||
      JSON.stringify(store.visibleColumns) !== JSON.stringify(this.meterUnitsTypeGridLayoutStore.visibleColumns) ||
      JSON.stringify(store.pageSize) !== JSON.stringify(this.meterUnitsTypeGridLayoutStore.pageSize) ||
      store.hideFilter !== this.meterUnitsTypeGridLayoutStore.hideFilter
    ) {
      this.settingsStoreService.saveCurrentUserSettings(this.meterUnitsTypeGridLayoutStoreKey, store);
      this.meterUnitsTypeGridLayoutStore = store;
    }
  }

  createForm(pageSize: Codelist<number>): FormGroup {
    return this.fb.group({
      [this.pageSizeProperty]: pageSize
    });
  }

  pageSizeChanged(selectedValue: any) {
    if (this.isGridLoaded && this.areSettingsLoaded) {
      this.meterUnitsTypeGridService.setSessionSettingsPageIndex(0);
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
      if ($event !== this.meterUnitsTypeGridService.getSessionSettingsSearchedWildcards()) {
        this.meterUnitsTypeGridService.setSessionSettingsSearchedWildcards($event);

        if (this.meterUnitsTypeGridService.getSessionSettingsSearchedText()) {
          this.deselectAll();
          // const value = this.dataConcentratorUnitsGridService.getSessionSettingsSearchedText();
          // this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value, useWildcards: $event  }];

          this.meterUnitsTypeGridService.setSessionSettingsPageIndex(0);
          this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
          this.meterUnitsTypeGridService.setSessionSettingsExcludedRows([]);
          this.gridApi.onFilterChanged();
        } else {
          this.saveSettingsStore(this.requestModel.sortModel);
        }
      }
    }
  }

  getAdditionalData(deviceIds: any) {
    // merge 2 request
    // get Jobs and Get Thresholds
    const jobSummeryPromise = this.concentratorService.getJobSummaryPost(deviceIds).toPromise();
    const readThresholdsPromise = this.concentratorService.getThresholdValuesPost(deviceIds).toPromise();

    Promise.all([jobSummeryPromise, readThresholdsPromise]).then((responses) => {
      const statusJobsData = responses[0];
      const thresholdData = responses[1];

      this.gridData.data.forEach((gridData) => {
        const item = statusJobsData.find((el) => el.deviceId === gridData.deviceId);
        if (item) {
          gridData.jobStatus = item.state;
        }
        thresholdData.forEach((device) => {
          if (gridData.deviceId === device.deviceId) {
            device.registers?.forEach((reg) => {
              gridData[reg.registerId.toLowerCase()] = reg.registerData;
            });
          }
        });
      });
      this.gridApi.refreshCells();
    });
  }

  // popup
  onSyncTime(selectedGuid: string) {
    const params = this.plcActionsService.getRequestFilterParam(selectedGuid, this.requestModel);
    this.plcActionsService.bulkOperation(
      MeterUnitsTypeEnum.syncTime,
      params,
      selectedGuid && selectedGuid?.length > 0 ? 1 : this.getSelectedCount()
    );
  }
}
