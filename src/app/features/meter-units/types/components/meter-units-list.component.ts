import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GridColumnShowHideService } from 'src/app/core/ag-grid-helpers/services/grid-column-show-hide.service';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { SettingsStoreEmitterService } from 'src/app/core/repository/services/settings-store/settings-store-emitter.service';
import { SettingsStoreService } from 'src/app/core/repository/services/settings-store/settings-store.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { GridLayoutSessionStoreService } from 'src/app/core/utils/services/grid-layout-session-store.service';
import { JobsSelectGridService } from 'src/app/features/jobs/jobs-select/services/jobs-select-grid.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { enumSearchFilterOperators, gridRefreshInterval } from 'src/environments/config';
import { ConcentratorService } from '../../../../core/repository/services/concentrator/concentrator.service';
import { MeterUnitsTypeGridLayoutStore } from '../interfaces/meter-units-type-grid-layout.store';
import { MeterUnitsPlcActionsService } from '../services/meter-units-plc-actions.service';
import { MeterUnitsTypeGridService } from '../services/meter-units-type-grid.service';
import { MeterUnitsTypeStaticTextService } from '../services/meter-units-type-static-text.service';
import {
  ColumnVisibilityChangedEvent,
  GridColumn,
  GridColumnType,
  GridRowAction,
  LinkClickedEvent,
  PageChangedEvent
} from '../../../../shared/data-table/data-table.component';
import { MeterUnitsList } from '../../../../core/repository/interfaces/meter-units/meter-units-list.interface';
import { GridResponse } from '../../../../core/repository/interfaces/helpers/grid-response.interface';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddMeterUnitFormComponent } from '../../common/components/add-mu-form/add-meter-unit-form.component';
import { gridSysNameColumnsEnum } from '../../../global/enums/meter-units-global.enum';
import { EventManagerService } from '../../../../core/services/event-manager.service';
import { MeterUnitsLayout } from '../../../../core/repository/interfaces/meter-units/meter-units-layout.interface';
import { FiltersInfo } from '../../../../shared/forms/interfaces/filters-info.interface';
import { PermissionEnumerator } from '../../../../core/permissions/enumerators/permission-enumerator.model';
import { SelectionEvent } from '@progress/kendo-angular-grid/dist/es2015/selection/types';

@Component({
  selector: 'app-meter-units',
  templateUrl: './meter-units-list.component.html'
})
export class MeterUnitsListComponent implements OnInit {
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
  metersColumns: Array<GridColumn> = [
    {
      field: 'icons',
      translationKey: '',
      width: 95,
      sortingDisabled: true,
      class: 'no-padding',
      type: GridColumnType.ICONS,
      iconsData: [
        {
          field: gridSysNameColumnsEnum.templateId,
          iconName: 'warning-red-icon',
          popoverText: 'GRID.MISSING-TEMPLATE'
        },
        {
          field: gridSysNameColumnsEnum.readyForActivation,
          iconName: 'hourglass-icon',
          popoverText: 'GRID.READY-FOR-ACTIVATION'
        },
        {
          field: gridSysNameColumnsEnum.isHls,
          iconName: 'lock-icon',
          popoverText: 'GRID.HIGH-LEVEL-SECURITY'
        },
        {
          field: gridSysNameColumnsEnum.hasActiveJobs,
          iconName: 'clock-icon',
          popoverText: 'GRID.ACTIVE-JOBS'
        }
      ]
    },
    {
      field: gridSysNameColumnsEnum.jobStatus,
      translationKey: 'GRID.JOB-STATUS',
      width: 100,
      type: GridColumnType.JOB_STATUS
    },
    {
      field: gridSysNameColumnsEnum.state,
      translationKey: 'GRID.STATE',
      width: 120,
      type: GridColumnType.BOLD_TEXT
    },
    {
      field: gridSysNameColumnsEnum.protocolType,
      translationKey: 'GRID.PROTOCOL',
      width: 80
    },
    {
      field: gridSysNameColumnsEnum.name,
      translationKey: 'GRID.NAME',
      width: 200,
      type: GridColumnType.LINK
    },
    {
      field: gridSysNameColumnsEnum.serialNumber,
      translationKey: 'GRID.SERIAL-NUMBER',
      width: 200
    },
    {
      field: gridSysNameColumnsEnum.logicalDeviceName,
      translationKey: 'GRID.LOGICAL-DEVICE-NAME',
      width: 200
    },
    {
      field: gridSysNameColumnsEnum.moduleId,
      translationKey: 'GRID.MODULE-ID',
      width: 150
    },
    {
      field: gridSysNameColumnsEnum.parent,
      translationKey: 'GRID.PARENT',
      width: 200,
      type: GridColumnType.LINK
    },
    {
      field: gridSysNameColumnsEnum.parametrisationId,
      translationKey: 'GRID.PARAM-ID',
      width: 150
    },
    {
      field: gridSysNameColumnsEnum.timeOfUseId,
      translationKey: 'GRID.TIME-OF-USE-ID',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.vendor,
      translationKey: 'GRID.VENDOR',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.medium,
      translationKey: 'GRID.MEDIUM',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.firmware,
      translationKey: 'GRID.FIRMWARE',
      width: 140
    },
    {
      field: gridSysNameColumnsEnum.id1,
      translationKey: 'GRID.ID1',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.id2,
      translationKey: 'GRID.ID2',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.id3,
      translationKey: 'GRID.ID3',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.id4,
      translationKey: 'GRID.ID4',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.id5,
      translationKey: 'GRID.ID5',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.id6,
      translationKey: 'GRID.ID6',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.configurationId,
      translationKey: 'GRID.ID-CONFIGURATION',
      width: 200
    },
    {
      field: gridSysNameColumnsEnum.disconnectorState,
      translationKey: 'GRID.DISCONNECTOR-STATE',
      width: 200,
      type: GridColumnType.COLORED_ENUM,
      coloredValues: [
        {
          enumValue: 'connected',
          color: 'green'
        },
        {
          enumValue: 'readyforreconnection',
          color: 'blue'
        },
        {
          enumValue: 'disconnected',
          color: 'red'
        }
      ]
    },
    {
      field: gridSysNameColumnsEnum.instantValues,
      translationKey: 'GRID.RELAY',
      width: 100,
      type: GridColumnType.INSTANT_VALUES
    },
    {
      field: gridSysNameColumnsEnum.ciiState,
      translationKey: 'GRID.CII-STATE',
      width: 100,
      type: GridColumnType.COLORED_ENUM,
      coloredValues: [
        {
          enumValue: 'on',
          color: 'green'
        },
        {
          enumValue: 'off',
          color: 'red'
        }
      ]
    },
    // {
    //   field: gridSysNameColumnsEnum.tags,
    //   translationKey: 'GRID.TAGS',
    //   width: 100
    // },
    {
      field: gridSysNameColumnsEnum.readStatusTimeStamp,
      translationKey: 'GRID.READ-STATUS',
      width: 120
    },
    {
      field: gridSysNameColumnsEnum.limiter1Normal.toLowerCase(),
      translationKey: 'GRID.LIMITER-1-NORMAL',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    },
    {
      field: gridSysNameColumnsEnum.limiter1Emergency.toLowerCase(),
      translationKey: 'GRID.LIMITER-1-EMERGENCY',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    },
    {
      field: gridSysNameColumnsEnum.limiter2Normal.toLowerCase(),
      translationKey: 'GRID.LIMITER-2-NORMAL',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    },
    {
      field: gridSysNameColumnsEnum.limiter2Emergency.toLowerCase(),
      translationKey: 'GRID.LIMITER-2-EMERGENCY',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    },
    {
      field: gridSysNameColumnsEnum.currentL1.toLowerCase(),
      translationKey: 'GRID.CURRENT-L1',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    },
    {
      field: gridSysNameColumnsEnum.currentL2.toLowerCase(),
      translationKey: 'GRID.CURRENT-L2',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    },
    {
      field: gridSysNameColumnsEnum.currentL3.toLowerCase(),
      translationKey: 'GRID.CURRENT-L3',
      width: 180,
      type: GridColumnType.UNIT_WITH_VALUE
    }
  ];

  metersRowActionConfiguration: Array<GridRowAction> = [
    {
      actionName: 'details',
      iconName: 'eye-icon'
    },
    {
      actionName: 'registers',
      iconName: 'chart-icon'
    }
  ];
  searchText = '';
  searchFromQueryParams = '';
  // filters
  sessionNameForGridFilter = 'grdLayoutMUT';
  metersFiltersConfiguration = [];
  statesCodeList = [];
  protocolsCodeList = [];
  appliedFilters;
  //

  wildCardsSearch = false;
  refreshInterval = gridRefreshInterval;
  // save to BE
  requestModel: GridRequestParams = {
    requestId: null,
    startRow: 0,
    endRow: 0,
    sortModel: [],
    searchModel: [{ colId: 'all', type: enumSearchFilterOperators.like, value: '', useWildcards: false }],
    filterModel: {
      states: [],
      tags: [],
      vendors: [],
      firmware: [],
      disconnectorState: [],
      ciiState: [],
      showChildInfoMBus: false,
      showWithoutTemplate: false,
      showOptionFilter: []
    }
  };

  id = 0;

  meterUnitsTypeGridLayoutStoreKey = 'mu-type-grid-layout';

  // save to be
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
    visibleColumns: this.metersColumns.map((column) => column.field),
    searchWildcards: this.wildCardsSearch
  };

  filtersInfo: FiltersInfo;

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
    private eventManager: EventManagerService
  ) {
    route.queryParams.subscribe((params) => {
      if (params['search']) {
        this.searchFromQueryParams = params['search'];
      }
    });
    this.breadcrumbService.setPageName('');
    this.eventManager.getCustom('RefreshMeterUnitsListEvent').subscribe((event) => {
      if (event.refresh) {
        this.getMetersListData(true);
        if (event.deselectRows) {
          this.selectedRowsIds = [];
        }
      }
    });
  }

  get permissionMuManage() {
    return PermissionEnumerator.Manage_Meters;
  }

  ngOnInit() {
    // all visible by default
    this.selectedRowsIds = JSON.parse(localStorage.getItem('selectedRowsIds')) ?? [];
    this.metersColumns.map((columns) => (columns.hidden = false));
    // currently we save to session storage since we clear localStorage in authService in saveTokenAndSetUserRights2
    // get layout and load data
    this.getMeterUnitsLayoutGridLayoutStore();
    this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(false);

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

    this.meterUnitsTypeService
      .getGridMeterUnitsForm(
        this.requestModel,
        this.pageNumber,
        this.pageSize,
        this.metersColumns.map((column) => column.field)
      )
      .subscribe((data) => {
        this.loading = false;
        this.gridData = data;
        this.gridData.data.map((data) => (data.protocolType = this.translate.instant('PROTOCOL.' + data.protocolType?.toUpperCase())));
        this.totalCount = data.totalCount;

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

  // filterChanged(event: FilterChangedEvent) {
  //   this.pageNumber = 1;
  //   if (event.field === 'state') {
  //     const selectedCodeList = this.statesCodeList.find((item) => item.value === event.value);
  //     if (selectedCodeList) {
  //       this.requestModel.filterModel = { states: [selectedCodeList] };
  //     } else {
  //       this.requestModel.filterModel = { states: [] };
  //     }
  //     this.getMetersListData(true);
  //   }
  //
  //   if (event.field === 'protocol') {
  //     const selectedProtocol = this.protocolsCodeList.find((item) => item.value === event.value);
  //     if (selectedProtocol) {
  //       this.requestModel.filterModel = { protocol: [selectedProtocol] };
  //     } else {
  //       this.requestModel.filterModel = { protocol: [] };
  //     }
  //     this.getMetersListData(true);
  //   }
  // }

  // clearFiltersAndSearch(event: boolean) {
  //   if (event) {
  //     this.requestModel.filterModel = { states: [] };
  //     this.requestModel.filterModel = { protocol: [] };
  //     this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: '', useWildcards: false }];
  //     // TODO this.saveUserSettings();
  //   }
  //   this.getMetersListData(true);
  // }

  columnVisibilityChanged(event: ColumnVisibilityChangedEvent) {
    this.metersColumns.find((column) => column.field === event.field).hidden = event.hidden;
    this.saveUserSettings();
  }

  saveUserSettings() {
    // set grid layout data
    this.meterUnitsTypeGridLayoutStore.pageSize = { id: this.pageSize, value: this.pageSize.toString() };
    this.meterUnitsTypeGridLayoutStore.searchWildcards = this.wildCardsSearch;
    this.meterUnitsTypeGridLayoutStore.searchText = this.searchText;
    this.meterUnitsTypeGridLayoutStore.meterUnitsLayout = this.gridFilterSessionStoreService.getGridLayout(
      this.sessionNameForGridFilter
    ) as MeterUnitsLayout; //

    // set visible columns
    this.meterUnitsTypeGridLayoutStore.visibleColumns = this.metersColumns
      .filter((column) => column.hidden != true)
      .map((item) => item.field);

    console.log(this.meterUnitsTypeGridLayoutStore);
    this.settingsStoreService.saveCurrentUserSettings(this.meterUnitsTypeGridLayoutStoreKey, this.meterUnitsTypeGridLayoutStore);
    sessionStorage.setItem('metersGridLayout', JSON.stringify(this.meterUnitsTypeGridLayoutStore));
  }

  searchData($event: string) {
    this.searchText = $event;
    this.meterUnitsTypeGridService.setSessionSettingsSearchedText($event);

    this.meterUnitsTypeGridService.setSessionSettingsPageIndex(0);
    this.meterUnitsTypeGridService.setSessionSettingsSelectedRows([]);
    this.meterUnitsTypeGridService.setSessionSettingsExcludedRows([]);

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
    localStorage.setItem('selectedRowsIds', JSON.stringify(this.selectedRowsIds));
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
    const protocols = ['multiUtilityParent'];

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
    return this.metersColumns.map((c) => c.field);
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
          // no user settings
          this.appliedFiltersFromUser = true;
          this.getMetersListData();
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

    this.applyFilters(false);

    // set visible columns icons and rowActions are always visible
    if (this.meterUnitsTypeGridLayoutStore.visibleColumns.length > 0) {
      this.metersColumns
        .filter((item) => item.field !== 'icons')
        .filter((item) => item.field !== '"rowActions"')
        .map((column) => (column.hidden = true));

      this.meterUnitsTypeGridLayoutStore.visibleColumns.forEach((columnName) => {
        const existingColumn: GridColumn = this.metersColumns.find((column) => column.field.toLowerCase() === columnName.toLowerCase());
        if (existingColumn) {
          existingColumn.hidden = false;
        }
      });
    }
  }

  closeSlideOut() {
    this.filtersOpened = false;
  }

  applyFilters(saveUserSettings = true) {
    const filter = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
    console.log(filter);
    this.requestModel.filterModel.states = filter.statesFilter ?? [];
    this.requestModel.filterModel.readStatus = {
      operation: filter.readStatusFilter ? filter.readStatusFilter.operation : { id: '', value: '' },
      value1: filter.readStatusFilter ? filter.readStatusFilter.value1 : 0,
      value2: filter.readStatusFilter ? filter.readStatusFilter.value2 : 0
    };
    this.requestModel.filterModel.firmware = filter.firmwareFilter ?? [];
    this.requestModel.filterModel.disconnectorState = filter.breakerStateFilter ?? [];
    this.requestModel.filterModel.ciiState = filter.ciiStateFilter ?? [];
    this.requestModel.filterModel.showOptionFilter = filter.showOptionFilter ?? [];
    this.requestModel.filterModel.showChildInfoMBus = filter.showOnlyMeterUnitsWithMBusInfoFilter ?? false;
    this.requestModel.filterModel.showWithoutTemplate = filter.showMeterUnitsWithoutTemplateFilter ?? false;
    this.requestModel.filterModel.readyForActivation = filter.showOnlyImageReadyForActivationFilter ?? false;
    this.requestModel.filterModel.vendors = filter.vendorsFilter ?? [];
    this.requestModel.filterModel.protocol = filter.protocolFilter ?? [];
    this.requestModel.filterModel.medium = filter.mediumFilter ?? [];
    this.getFilterInfo();
    this.appliedFiltersFromUser = true;
    // save filters to user settings
    if (saveUserSettings) {
      this.saveUserSettings();
    }
    this.selectAllEnabled = JSON.parse(localStorage.getItem('selectAllEnabled')) ?? false;
    if (this.selectAllEnabled && localStorage.getItem('excludedIds')) {
      this.requestModel.excludeIds = JSON.parse(localStorage.getItem('excludedIds'));
      this.requestModel.deviceIds = [];
    }
    this.getMetersListData(true);
  }

  // fill text in header - about selected filters copied from existing ag-grid
  getFilterInfo() {
    const filterInfo = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as MeterUnitsLayout;
    return this.staticTextService.getFiltersInfo(
      filterInfo.name,
      filterInfo.statesFilter && filterInfo.statesFilter.length > 0,
      filterInfo.vendorsFilter && filterInfo.vendorsFilter.length > 0,
      filterInfo.tagsFilter && filterInfo.tagsFilter.length > 0,
      filterInfo.readStatusFilter && filterInfo.readStatusFilter.operation && filterInfo.readStatusFilter.operation.id.length > 0,
      filterInfo.firmwareFilter && filterInfo.firmwareFilter.length > 0,
      filterInfo.breakerStateFilter && filterInfo.breakerStateFilter.length > 0,
      filterInfo.ciiStateFilter && filterInfo.ciiStateFilter.length > 0,
      filterInfo.showOptionFilter && filterInfo.showOptionFilter.length > 0,
      filterInfo.protocolFilter && filterInfo.protocolFilter.length > 0,
      filterInfo.mediumFilter && filterInfo.mediumFilter.length > 0
    );
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
      localStorage.setItem('selectedRowsIds', JSON.stringify(this.selectedRowsIds));
      localStorage.setItem('selectAllEnabled', JSON.stringify(this.selectAllEnabled));
      this.requestModel.deviceIds = [];
      this.requestModel.excludeIds = [];
      //this.selectedRowsIds = this.gridData.
    }
  }

  deSelectAll(event: boolean) {
    if (event) {
      this.meterUnitsTypeGridService.setSessionSettingsSelectedAll(false);
      this.selectAllEnabled = false;
      this.selectedRowsIds = [];
      localStorage.setItem('selectedRowsIds', JSON.stringify(this.selectedRowsIds));
      localStorage.setItem('selectAllEnabled', JSON.stringify(this.selectAllEnabled));
      // this.requestModel.deviceIds = null;
      // this.requestModel.excludeIds = [];
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
      localStorage.setItem('excludedIds', JSON.stringify(this.requestModel?.excludeIds));
    }
    console.log(this.requestModel.excludeIds);
  }
}
