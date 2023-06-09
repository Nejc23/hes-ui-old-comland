import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GridColumnShowHideService } from 'src/app/core/ag-grid-helpers/services/grid-column-show-hide.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { GridRequestParams, GridSortParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { SettingsStoreEmitterService } from 'src/app/core/repository/services/settings-store/settings-store-emitter.service';
import { SettingsStoreService } from 'src/app/core/repository/services/settings-store/settings-store.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { JobsSelectGridService } from 'src/app/features/jobs/jobs-select/services/jobs-select-grid.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { enumSearchFilterOperators } from 'src/environments/config';
import { ConcentratorService } from '../../../../core/repository/services/concentrator/concentrator.service';
import { MeterUnitsTypeGridLayoutStore } from '../interfaces/meter-units-type-grid-layout.store';
import { MeterUnitsPlcActionsService } from '../services/meter-units-plc-actions.service';
import { MeterUnitsTypeGridService } from '../services/meter-units-type-grid.service';
import { MeterUnitsTypeStaticTextService } from '../services/meter-units-type-static-text.service';
import {
  ColumnVisibilityChangedEvent,
  GridColumn,
  GridRowAction,
  LinkClickedEvent,
  PageChangedEvent
} from '../../../../shared/data-table/data-table.component';
import { MeterUnitsList } from '../../../../core/repository/interfaces/meter-units/meter-units-list.interface';
import { GridResponse } from '../../../../core/repository/interfaces/helpers/grid-response.interface';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddMeterUnitFormComponent } from '../../common/components/add-mu-form/add-meter-unit-form.component';
import { EventManagerService } from '../../../../core/services/event-manager.service';
import { MeterUnitsLayout } from '../../../../core/repository/interfaces/meter-units/meter-units-layout.interface';
import { PermissionEnumerator } from '../../../../core/permissions/enumerators/permission-enumerator.model';
import { SelectionEvent } from '@progress/kendo-angular-grid/dist/es2015/selection/types';
import { gridSysNameColumnsEnum } from 'src/app/features/global/enums/meter-units-global.enum';
import { Subscription } from 'rxjs';
import { SortDescriptor } from '@progress/kendo-data-query';
import { AppConfigService } from '../../../../core/configuration/services/app-config.service';

@Component({
  selector: 'app-meter-units',
  templateUrl: './meter-units-list.component.html'
})
export class MeterUnitsListComponent implements OnInit, OnDestroy {
  // new grid
  gridData: GridResponse<MeterUnitsList>;
  pageNumber = 1;
  pageSize = 20;
  totalCount = 0;
  selectedRowsIds = [];
  loading = false;
  filtersOpened = false;
  appliedFiltersFromUser = false;
  selectAllEnabled = false;
  searchText = '';
  searchFromQueryParams = '';
  // filters
  sessionNameForGridFilter = 'grdLayoutMUT';
  metersFiltersConfiguration = [];
  statesCodeList = [];
  protocolsCodeList = [];
  appliedFilters;
  metersColumns: Array<GridColumn> = [];
  metersRowActionConfiguration: Array<GridRowAction> = [];
  meterIdsFilterApplied = false;
  //
  wildCardsSearch = false;
  defaultSort: GridSortParams = { colId: 'slaSuccessPercentage', sort: 'asc' };
  requestModel: GridRequestParams = {
    deviceIds: [],
    excludeIds: [],
    requestId: null,
    startRow: 0,
    endRow: 0,
    sortModel: [this.defaultSort],
    searchModel: [{ colId: 'all', type: enumSearchFilterOperators.like, value: '', useWildcards: false }],
    filterModel: {
      states: [],
      tags: [],
      vendors: [],
      applicationFirmware: [],
      moduleFirmware: [],
      metrologyFirmware: [],
      disconnectorState: [],
      ciiState: [],
      showChildInfoMBus: false,
      showWithoutTemplate: false,
      showOptionFilter: []
    }
  };

  id = 0;
  meterUnitsTypeGridLayoutStoreKey = 'mu-type-grid-layout';
  meterUnitsTypeGridLayoutStore: MeterUnitsTypeGridLayoutStore = {
    currentPageIndex: 1,
    sortModel: [
      {
        colId: 'name',
        sort: 'asc'
      }
    ],
    pageSize: { id: this.pageSize, value: this.pageSize.toString() },
    searchText: this.searchText,
    visibleColumns: [],
    searchWildcards: this.wildCardsSearch
  };

  subscriptions: Array<Subscription> = [];

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private meterUnitsTypeGridService: MeterUnitsTypeGridService,
    private staticTextService: MeterUnitsTypeStaticTextService,
    private meterUnitsTypeService: MeterUnitsService,
    private gridFilterSessionStoreService: GridLayoutSessionStoreService,
    private codelistMeterUnitsService: CodelistMeterUnitsRepositoryService,
    private service: MyGridLinkService,
    private authService: AuthService,
    private toast: ToastNotificationService,
    private gridColumnShowHideService: GridColumnShowHideService,
    private breadcrumbService: BreadcrumbService,
    private router: Router,
    private plcActionsService: MeterUnitsPlcActionsService,
    private settingsStoreService: SettingsStoreService,
    private settingsStoreEmitterService: SettingsStoreEmitterService,
    private jobsSelectGridService: JobsSelectGridService,
    private modalService: ModalService,
    private concentratorService: ConcentratorService,
    private translate: TranslateService,
    private elRef: ElementRef,
    private codelistService: CodelistMeterUnitsRepositoryService,
    private eventManager: EventManagerService,
    private appConfigService: AppConfigService
  ) {
    route.queryParams.subscribe((params) => {
      if (params['search']) {
        this.searchFromQueryParams = params['search'];
        this.clearSessionStorage();
      }
    });
    this.breadcrumbService.setPageName('');
    this.subscriptions.push(
      this.eventManager.getCustom('RefreshMeterUnitsListEvent').subscribe((event) => {
        if (event.deselectRows) {
          this.clearSessionStorage();
        }
        if (event.refresh) {
          this.getMetersListData(true);
        }
      })
    );

    this.subscriptions.push(
      this.eventManager.getCustom('ApplyMeterIdsFilter').subscribe((event) => {
        const ids = event.ids;
        // convert ids from excel array<number>
        if (!ids.some(isNaN)) {
          ids.toString();
        }
        this.requestModel.searchModel = [
          {
            colId: event.field,
            type: enumSearchFilterOperators.like,
            value: null,
            valuesFromFile: ids.flat(),
            useWildcards: false
          }
        ];
        this.meterIdsFilterApplied = true;
        this.selectedRowsIds = [];
        this.getMetersListData(true);
      })
    );

    this.subscriptions.push(
      this.eventManager.getCustom('ClearMeterIdsFilter').subscribe(() => {
        this.clearMeterIdsFilter();
        this.getMetersListData(true);
      })
    );
  }

  get permissionMuManage() {
    return PermissionEnumerator.Manage_Meters;
  }

  ngOnInit() {
    this.metersColumns = this.meterUnitsTypeGridService.metersColumns;
    // last communication feature flag -> default is enabled
    const lastCommunicationDisabled = this.appConfigService.isFeatureEnabled('SkipLastCommunicationPublishing');
    if (lastCommunicationDisabled) {
      this.metersColumns = this.metersColumns.filter((column) => column.field !== 'lastCommunication');
    }

    this.metersRowActionConfiguration = this.meterUnitsTypeGridService.metersRowActionConfiguration;
    this.meterUnitsTypeGridLayoutStore.visibleColumns = this.metersColumns.map((column) => column.field);
    // all visible by default
    this.selectedRowsIds = JSON.parse(localStorage.getItem('selectedRowsIds')) ?? [];
    if (this.selectedRowsIds.length > 0) {
      this.requestModel.deviceIds = this.selectedRowsIds;
    }
    this.metersColumns
      .filter((column) => column.field !== 'icons')
      .filter((column) => column.field !== 'rowActions')
      .map((columns) => (columns.hidden = false));
    this.selectAllEnabled = this.meterUnitsTypeGridService.getSessionSettingsSelectedAll();
    // currently, we save to session storage since we clear localStorage in authService in saveTokenAndSetUserRights2
    // get layout and load data
    this.getMeterUnitsLayoutGridLayoutStore();

    this.codelistService.meterUnitStatusCodelist(this.id).subscribe((res) => {
      this.metersFiltersConfiguration.push({
        field: 'state',
        values: res.map((item) => item.value),
        label: 'FORM.STATE'
      });
      this.statesCodeList = res;
    });
    this.codelistService.meterUnitProtocolTypeCodelist().subscribe((res) => {
      this.metersFiltersConfiguration.push({
        field: 'protocol',
        values: res.map((item) => item.value),
        label: 'FORM.PROTOCOL'
      });
      this.protocolsCodeList = res;
    });
  }

  // get Data from API
  getMetersListData(refreshGrid: boolean = false) {
    this.loading = true;
    if (this.pageNumber === 0) {
      this.pageNumber++;
    }
    this.meterUnitsTypeService
      .getGridMeterUnitsForm(this.requestModel, this.pageNumber, this.pageSize, this.getAllDisplayedColumnsNames())
      .subscribe((data) => {
        this.loading = false;
        this.gridData = data;
        this.gridData.data.map((meterUnit) => {
          meterUnit.protocolType = this.translate.instant('PROTOCOL.' + meterUnit.protocolType?.toUpperCase());
          meterUnit.medium = meterUnit.medium ? this.translate.instant('M-BUS-TYPE.' + meterUnit.medium?.toUpperCase()) : '';
        });
        this.gridData.data.map((meterUnit) => {
          const errorList = [];
          let lifecycleError = [];
          if (meterUnit[gridSysNameColumnsEnum.lifecycleActions]?.find((item) => item.toLowerCase() !== 'rekeyed')) {
            lifecycleError.push(this.translate.instant('GRID.RE-KEY-METER'));
          }
          if (meterUnit[gridSysNameColumnsEnum.lifecycleActions]?.find((item) => item.toLowerCase() === 'rekeyed_failed')) {
            lifecycleError = [];
            lifecycleError.push(this.translate.instant('GRID.RE-KEY-METER-FAILED'));
          }
          if (!meterUnit[gridSysNameColumnsEnum.templateId]) {
            errorList.push(this.translate.instant('GRID.MISSING-TEMPLATE'));
          }
          if (meterUnit[gridSysNameColumnsEnum.serialMismatch]) {
            errorList.push(this.translate.instant('GRID.SERIAL-MISMATCH'));
          }
          if (meterUnit[gridSysNameColumnsEnum.timeDeviation]) {
            errorList.push(this.translate.instant('GRID.TIME-DEVIATION'));
          }

          meterUnit.hasConfigurationErrors = errorList.length > 0;
          meterUnit.errorList = errorList.join(' | ');

          meterUnit.hasLifecycleErrors = lifecycleError.length > 0;
          meterUnit.lifecycleError = lifecycleError.join(' | ');
        });
        this.totalCount = data.totalCount;
        if (this.totalCount === 0) {
          this.pageNumber = 0;
        }

        if (refreshGrid) {
          this.gridData.data = [...this.gridData.data]; //  KendoUI change detection for grid rerender
        }
        // get additional data job summary and threshold values
        this.getAdditionalData(this.gridData.data.map((rowItem) => rowItem.deviceId));
      });
  }

  // page changed on grid
  loadMoreData(event: PageChangedEvent) {
    this.pageNumber = event.pageNumber;
    if (event.rowsPerPage && event.rowsPerPage !== this.pageSize) {
      this.pageNumber = 1; // init page number after page size increased
      this.pageSize = event.rowsPerPage;
    }
    this.getMetersListData(true);
    this.saveUserSettings();
  }

  calculateHeight() {
    return window.innerHeight - 220;
  }

  // todo remove addWidth when base layout is refactored
  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }

  getSelectedCount(): number {
    if (this.selectAllEnabled) {
      return this.totalCount - (this.requestModel?.excludeIds?.length ?? 0);
    } else {
      return this.selectedRowsIds?.length ?? 0;
    }
  }

  rowActionsClicked(event: any) {
    if (event.actionName === 'details') {
      this.router.navigate([`/meterUnits/details/${event.rowData.deviceId}`]);
    }
    if (event.actionName === 'registers') {
      this.router.navigate([`/meterUnits/registers/${event.rowData.deviceId}`]);
    }
  }

  columnVisibilityChanged(event: ColumnVisibilityChangedEvent) {
    this.metersColumns.find((column) => column.field === event.field).hidden = event.hidden;
    this.saveUserSettings();
  }

  saveUserSettings() {
    // set grid layout data
    this.meterUnitsTypeGridLayoutStore.pageSize = { id: this.pageSize, value: this.pageSize.toString() };
    this.meterUnitsTypeGridLayoutStore.searchWildcards = this.wildCardsSearch;
    this.meterUnitsTypeGridLayoutStore.searchText = this.searchText;
    this.meterUnitsTypeGridLayoutStore.sortModel[0] = this.defaultSort;
    this.meterUnitsTypeGridLayoutStore.meterUnitsLayout = this.gridFilterSessionStoreService.getGridLayout(
      this.sessionNameForGridFilter
    ) as MeterUnitsLayout; //

    // set visible columns
    this.meterUnitsTypeGridLayoutStore.visibleColumns = this.metersColumns
      .filter((column) => column.hidden != true)
      .filter((column) => column.field !== 'icons')
      .filter((column) => column.field !== 'rowActions')
      .map((item) => item.field);

    this.settingsStoreService.saveCurrentUserSettings(this.meterUnitsTypeGridLayoutStoreKey, this.meterUnitsTypeGridLayoutStore);
    sessionStorage.setItem('metersGridLayout', JSON.stringify(this.meterUnitsTypeGridLayoutStore));
  }

  searchData($event: string) {
    this.searchText = $event;
    this.meterUnitsTypeGridService.setSessionSettingsSearchedText($event);
    this.selectAllEnabled = false;
    this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(this.selectAllEnabled);
    this.meterUnitsTypeGridService.setSessionSettingsPageIndex(0);
    this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
    this.meterUnitsTypeGridService.setSessionSettingsExcludedRows([]);
    this.clearSessionStorage();

    this.selectedRowsIds = [];
    this.requestModel.excludeIds = [];
    this.requestModel.searchModel = [
      {
        colId: 'all',
        type: enumSearchFilterOperators.like,
        value: $event,
        useWildcards: this.wildCardsSearch
      }
    ];
    this.getMetersListData(true);
    // save search to user settings
    this.saveUserSettings();
  }

  selectedRows(event: any) {
    this.selectedRowsIds = event;
    sessionStorage.setItem('selectedRowsIds', JSON.stringify(this.selectedRowsIds));
    this.requestModel.deviceIds = this.selectedRowsIds;
  }

  onAdd() {
    this.jobsSelectGridService.clearSessionSettingsSelectedRows();
    const options: NgbModalOptions = {
      size: 'lg'
    };
    const modalRef = this.modalService.open(AddMeterUnitFormComponent, options);
    modalRef.result
      .then(() => {
        this.getMetersListData(true);
      })
      .catch(() => {});
  }

  getSearchColumnNames(): string[] {
    return this.getAllDisplayedColumnsNames();
  }

  showRegisters(deviceId: string) {
    this.router.navigate(['/meterUnits/registers', deviceId]);
  }

  openDetailsPage(event: LinkClickedEvent) {
    const protocols = ['WiredMultiUtilityParent', 'WirelessMultiUtilityParent'];

    if (event.field === 'name') {
      this.router.navigate(['/meterUnits/details', event.id]);
    }
    if (event.field === 'parent') {
      if (protocols.find((val) => val.toLowerCase() === event.rowData.driver?.toLowerCase())) {
        this.router.navigate([`/meterUnits/details/${event.rowData.parentId}`]);
      } else {
        this.router.navigate([`/dataConcentratorUnits/${event.rowData.concentratorId}`]);
      }
    }
  }

  getAllDisplayedColumnsNames(): string[] {
    return this.meterIdsFilterApplied ? [this.requestModel.searchModel[0].colId] : this.metersColumns.map((column) => column.field);
  }

  toggleWildcards(event: boolean) {
    this.wildCardsSearch = event;
    this.requestModel.searchModel[0].useWildcards = this.wildCardsSearch;
    this.getMetersListData(true);
    this.saveUserSettings();
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
      this.gridData.data = [...this.gridData.data];
    });
  }

  getMeterUnitsLayoutGridLayoutStore() {
    if (sessionStorage.getItem('metersGridLayout')) {
      this.setGridSettingsAndFilters(JSON.parse(sessionStorage.getItem('metersGridLayout')));
    } else {
      this.settingsStoreService.getCurrentUserSettings(this.meterUnitsTypeGridLayoutStoreKey).subscribe((settings) => {
        // set grid settings
        if (settings) {
          this.setGridSettingsAndFilters(settings);
        } else {
          // no user settings in DB
          if (this.searchFromQueryParams) {
            this.searchText = this.searchFromQueryParams;
            this.wildCardsSearch = true;
            this.requestModel.searchModel = [
              {
                colId: 'all',
                type: enumSearchFilterOperators.like,
                value: this.searchText,
                useWildcards: this.wildCardsSearch
              }
            ];
            this.applyFilters(true);
          } else {
            this.getMetersListData();
          }
          this.appliedFiltersFromUser = true;
        }
      });
    }
  }

  setGridSettingsAndFilters(settings: any) {
    this.meterUnitsTypeGridLayoutStore = settings;
    // search fom query params
    if (this.searchFromQueryParams) {
      this.searchText = this.searchFromQueryParams;
      this.wildCardsSearch = true;
      this.saveUserSettings();
    } else {
      this.searchText = settings.searchText;
    }
    this.wildCardsSearch = settings.searchWildcards ?? false; // todo check
    this.selectedRowsIds = JSON.parse(sessionStorage.getItem('selectedRowsIds')) ?? [];

    if (settings.sortModel.length > 0) {
      this.defaultSort = settings.sortModel[0];
      this.requestModel.sortModel = [this.defaultSort];
    }
    if (this.searchText) {
      this.requestModel.searchModel = [
        {
          colId: 'all',
          type: enumSearchFilterOperators.like,
          value: this.searchText,
          useWildcards: this.wildCardsSearch
        }
      ];
    }
    this.pageSize = settings.pageSize.id;
    // this.meterUnitsLayout
    this.gridFilterSessionStoreService.setGridLayout(this.sessionNameForGridFilter, this.meterUnitsTypeGridLayoutStore.meterUnitsLayout);
    if (this.meterUnitsTypeGridLayoutStore.visibleColumns.length > 0) {
      this.metersColumns.map((column) => (column.hidden = true));
      // apply visible columns from
      this.meterUnitsTypeGridLayoutStore.visibleColumns.forEach((columnName) => {
        const existingColumn: GridColumn = this.metersColumns.find((column) => column.field.toLowerCase() === columnName.toLowerCase());
        if (existingColumn) {
          existingColumn.hidden = false;
        }
      });
      // set visible columns icons and rowActions are always visible
      this.metersColumns
        .filter((item) => item.field === 'icons')
        .filter((item) => item.field === '"rowActions"')
        .map((column) => (column.hidden = false));
    }
    this.applyFilters(false);
  }

  closeSlideOut() {
    this.filtersOpened = false;
  }

  applyFilters(saveUserSettings = true) {
    if (saveUserSettings) {
      // filter changed. clear selection
      this.clearSessionStorage();
      // save filters to user settings
      this.saveUserSettings();
    }
    this.pageNumber = 1;
    const filter = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
    console.log(filter);
    this.requestModel.filterModel.states = filter.statesFilter ?? [];
    this.requestModel.filterModel.readStatus = {
      operation: filter.readStatusFilter ? filter.readStatusFilter.operation : { id: '', value: '' },
      value1: filter.readStatusFilter ? filter.readStatusFilter.value1 : 0,
      value2: filter.readStatusFilter ? filter.readStatusFilter.value2 : 0
    };
    this.requestModel.filterModel.applicationFirmware = filter.appFirmwareFilter ?? [];
    this.requestModel.filterModel.metrologyFirmware = filter.metrologyFirmwareFilter ?? [];
    this.requestModel.filterModel.moduleFirmware = filter.moduleFirmwareFilter ?? [];
    this.requestModel.filterModel.disconnectorState = filter.breakerStateFilter ?? [];
    this.requestModel.filterModel.ciiState = filter.ciiStateFilter ?? [];
    this.requestModel.filterModel.showOptionFilter = filter.showOptionFilter ?? [];
    this.requestModel.filterModel.showChildInfoMBus = filter.showOnlyMeterUnitsWithMBusInfoFilter ?? false;
    this.requestModel.filterModel.showWithoutTemplate = filter.showMeterUnitsWithoutTemplateFilter ?? false;
    this.requestModel.filterModel.readyForActivation = filter.showOnlyImageReadyForActivationFilter ?? false;
    this.requestModel.filterModel.vendors = filter.vendorsFilter ?? [];
    this.requestModel.filterModel.protocol = filter.protocolFilter ?? [];
    this.requestModel.filterModel.medium = filter.mediumFilter ?? [];
    this.requestModel.filterModel.sla = filter.slaFilter ?? null;
    this.requestModel.filterModel.lastCommunicationFilter = filter.lastCommunicationFilter ?? null;

    this.getFilterCount();
    this.selectAllEnabled = this.meterUnitsTypeGridService.getSessionSettingsSelectedAll();

    if (!this.selectAllEnabled) {
      this.requestModel.deviceIds = this.selectedRowsIds;
    } else {
      this.selectedRowsIds = [];
    }

    if (this.selectAllEnabled && sessionStorage.getItem('excludedIds')) {
      this.requestModel.excludeIds = JSON.parse(sessionStorage.getItem('excludedIds'));
      this.requestModel.deviceIds = [];
    }
    this.appliedFiltersFromUser = true;
    this.getMetersListData(true);
  }

  // fill text in header - about selected filters copied from existing ag-grid
  getFilterCount() {
    let count: number;
    const filterInfo = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
    count = this.staticTextService.getFiltersInfo(
      filterInfo.name,
      filterInfo.statesFilter && filterInfo.statesFilter.length > 0,
      filterInfo.vendorsFilter && filterInfo.vendorsFilter.length > 0,
      filterInfo.tagsFilter && filterInfo.tagsFilter.length > 0,
      filterInfo.readStatusFilter && filterInfo.readStatusFilter.operation && filterInfo.readStatusFilter.operation.id.length > 0,
      filterInfo.appFirmwareFilter && filterInfo.appFirmwareFilter.length > 0,
      filterInfo.moduleFirmwareFilter && filterInfo.moduleFirmwareFilter.length > 0,
      filterInfo.metrologyFirmwareFilter && filterInfo.metrologyFirmwareFilter.length > 0,
      filterInfo.breakerStateFilter && filterInfo.breakerStateFilter.length > 0,
      filterInfo.ciiStateFilter && filterInfo.ciiStateFilter.length > 0,
      filterInfo.showOptionFilter && filterInfo.showOptionFilter.length > 0,
      filterInfo.protocolFilter && filterInfo.protocolFilter.length > 0,
      filterInfo.mediumFilter && filterInfo.mediumFilter.length > 0,
      filterInfo.slaFilter && true
    ).count;
    if (this.meterIdsFilterApplied) {
      count++;
    }
    return count;
  }

  filterIconClicked(event: boolean) {
    if (event) {
      this.filtersOpened = !this.filtersOpened;
    }
  }

  selectAll(event: boolean) {
    if (event) {
      this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(true);
      this.selectAllEnabled = true;
      this.requestModel.deviceIds = [];
      this.requestModel.excludeIds = [];
      sessionStorage.setItem('selectedRowsIds', JSON.stringify(this.selectedRowsIds));
      sessionStorage.setItem('excludedIds', JSON.stringify(this.requestModel.excludeIds));
    }
  }

  deSelectAll(event: boolean) {
    if (event) {
      this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(false);
      this.selectAllEnabled = false;
      this.selectedRowsIds = [];
      sessionStorage.setItem('selectedRowsIds', JSON.stringify(this.selectedRowsIds));
    }
  }

  excludedIdsFromSelectAll(event: SelectionEvent) {
    if (event.deselectedRows.length > 0) {
      event.deselectedRows.forEach((row) => {
        this.requestModel.excludeIds.push(row.dataItem.deviceId);
      });
    }
    if (event.selectedRows.length > 0) {
      event.selectedRows.forEach((row) => {
        this.requestModel.excludeIds = this.requestModel.excludeIds.filter((id) => id !== row.dataItem.deviceId);
      });
    }
    if (this.selectAllEnabled) {
      sessionStorage.setItem('excludedIds', JSON.stringify(this.requestModel?.excludeIds));
    }
    console.log(this.requestModel.excludeIds);
  }

  clearMeterIdsFilter() {
    this.meterIdsFilterApplied = false;
    this.requestModel.searchModel = [
      {
        colId: 'all',
        type: enumSearchFilterOperators.like,
        value: this.searchText,
        useWildcards: this.wildCardsSearch
      }
    ];
  }

  clearFilters(event: boolean) {
    // clear search
    if (this.meterIdsFilterApplied) {
      this.clearMeterIdsFilter();
    }
    this.searchText = '';
    this.clearSessionStorage();
    // clear and apply filters
    this.gridFilterSessionStoreService.clearGridLayout();
    this.eventManager.emitCustom('ClearFilter', true);
  }

  clearSessionStorage() {
    this.requestModel.deviceIds = [];
    this.requestModel.excludeIds = [];
    this.selectedRowsIds = [];
    this.selectAllEnabled = false;
    sessionStorage.setItem('selectedRowsIds', JSON.stringify(this.selectedRowsIds));
    sessionStorage.setItem('excludedIds', JSON.stringify(this.requestModel.excludeIds));
    this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(false);
  }

  sortingChanged(event: SortDescriptor[]) {
    this.loading = true;
    this.requestModel.sortModel = [];
    this.defaultSort = {
      colId: event[0].field,
      sort: event[0].dir
    };
    this.requestModel.sortModel.push(this.defaultSort);
    this.getMetersListData(true);
    this.saveUserSettings();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
