import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
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
import { AgGridSharedFunctionsService } from 'src/app/shared/ag-grid/services/ag-grid-shared-functions.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
// consts
import { enumSearchFilterOperators, gridRefreshInterval } from 'src/environments/config';
import { SettingsStoreEmitterService } from '../../../core/repository/services/settings-store/settings-store-emitter.service';
import { SidebarToggleService } from '../../../shared/base-template/components/services/sidebar.service';
import { FiltersInfo } from '../../../shared/forms/interfaces/filters-info.interface';
import { JobsSelectGridService } from '../../jobs/jobs-select/services/jobs-select-grid.service';
import { DcuUnitsGridLayoutStore } from '../interfaces/dcu-units-grid-layout.store';
import { DataConcentratorUnitsGridEventEmitterService } from '../services/data-concentrator-units-grid-event-emitter.service';
import { DataConcentratorUnitsGridService } from '../services/data-concentrator-units-grid.service';
import { DataConcentratorUnitsStaticTextService } from '../services/data-concentrator-units-static-text.service';
import { DcOperationsService } from '../services/dc-operations.service';
import { AddDcuFormComponent } from './add-dcu-form/add-dcu-form.component';
import { DeleteDcuFormComponent } from './delete-dcu-form/delete-dcu-form.component';
import { OperationType } from './operations/dc-operations.component';
import { EventManagerService } from '../../../core/services/event-manager.service';
import {
  ColumnVisibilityChangedEvent,
  GridColumn,
  GridRowAction,
  LinkClickedEvent,
  PageChangedEvent
} from '../../../shared/data-table/data-table.component';
import { GridResponse } from '../../../core/repository/interfaces/helpers/grid-response.interface';
import { Router } from '@angular/router';
import { SelectionEvent } from '@progress/kendo-angular-grid/dist/es2015/selection/types';
import { SortDescriptor } from '@progress/kendo-data-query';

@Component({
  selector: 'app-data-concentrator-units',
  templateUrl: './data-concentrator-units-list.component.html'
})
export class DataConcentratorUnitsListComponent implements OnInit, OnDestroy {
  sessionNameForGridState = 'grdStateDCU';
  sessionNameForGridFilter = 'grdLayoutDCU';

  dcuUnitsGridLayoutStoreKey = 'dcu-units-grid-layout';
  dcuUnitsGridLayoutStore: DcuUnitsGridLayoutStore;
  defaultSort: GridSortParams = { colId: 'slaSuccessPercentage', sort: 'asc' };
  // grid variables
  filtersInfo: FiltersInfo;
  requestModel: GridRequestParams = {
    excludeIds: [],
    deviceIds: [],
    requestId: null,
    startRow: 0,
    endRow: 0,
    sortModel: [this.defaultSort],
    searchModel: [],
    filterModel: {}
  };
  pageSizes: Codelist<number>[] = [
    { id: 20, value: '20' },
    { id: 50, value: '50' },
    { id: 100, value: '100' }
  ];
  selectedPageSize: Codelist<number> = this.pageSizes[0];
  areSettingsLoaded = false;
  messageDataFwUpgraded = this.translate.instant('DCU.FW-UPGRADE-SUCCESSFUL');
  messageActionFailed = this.translate.instant('DCU.FW-UPGRADE-FAILED');
  taskStatusOK = 'TASK_SUCCESS';
  taskStatusFailure = 'TASK_FAILURE';
  refreshInterval = gridRefreshInterval;
  componentType = OperationType;
  filtersOpened = false;
  // kendo UI grid settings
  gridData: GridResponse<DataConcentratorUnitsList>;
  pageNumber = 1;
  pageSize = 20;
  totalCount = 0;
  loading = false;
  wildCardsSearch = false;
  searchText = '';
  selectedRowsIds = [];
  selectAllEnabled = false;
  concentratorsColumns: Array<GridColumn> = [];
  concentratorsRowActionConfiguration: Array<GridRowAction> = [];
  private layoutChangeSubscription: Subscription;
  private dcuAddedSubscription: Subscription;
  private subscription: Subscription;
  private listSubscription: Subscription;

  constructor(
    private dataConcentratorUnitsGridService: DataConcentratorUnitsGridService,
    private staticTextService: DataConcentratorUnitsStaticTextService,
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
    private dcuOperationsService: DataConcentratorUnitsOperationsService,
    private toast: ToastNotificationService,
    private jobsSelectGridService: JobsSelectGridService,
    private translate: TranslateService,
    private eventsService: EventManagerService,
    private elRef: ElementRef,
    private router: Router
  ) {
    // grid columns and row actions configuration
    this.concentratorsColumns = this.dataConcentratorUnitsGridService.concentratorsColumns;
    this.concentratorsRowActionConfiguration = this.dataConcentratorUnitsGridService.concentratorsRowActionConfiguration;

    this.listSubscription = this.eventsService.getCustom('RefreshConcentratorEvent').subscribe(() => {
      this.getData();
    });

    this.layoutChangeSubscription = this.eventService.eventEmitterLayoutChange.subscribe({
      next: (event: DcuLayout) => {
        if (event !== null) {
          this.requestModel.filterModel.states = event.statesFilter ?? [];
          this.requestModel.filterModel.readStatus.operation = event.readStatusFilter.operation;
          this.requestModel.filterModel.readStatus.value1 = event.readStatusFilter.value1;
          this.requestModel.filterModel.readStatus.value2 = event.readStatusFilter.value2;
          this.requestModel.filterModel.vendors = event.vendorsFilter;
          this.requestModel.filterModel.types = event.typesFilter.map((t) => t.id);
          this.requestModel.filterModel.tags = event.tagsFilter;
          this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
          this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
          this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
        }
        this.setFilterInfo();
      }
    });

    this.dcuAddedSubscription = this.eventService.eventEmitterDcuAdded.subscribe({
      next: (dcu: DataConcentratorUnitsList) => {
        if (dcu) {
          this.dataConcentratorUnitsService.dcuSync();
          this.getData();
        }
      }
    });

    this.eventService.eventEmitterConcentratorDeleted.subscribe((x) => {
      this.deSelectAll(true);
      this.getData();
    });
  }

  get permissionAdd() {
    return PermissionEnumerator.Manage_Concentrators;
  }

  ngOnInit() {
    this.bredcrumbService.setPageName('');
    this.selectedRowsIds = JSON.parse(localStorage.getItem('concentratorsSelectedRowsIds')) ?? [];
    this.selectAllEnabled = JSON.parse(localStorage.getItem('concentratorsSelectAllEnabled')) ?? false;
    this.requestModel.excludeIds = JSON.parse(localStorage.getItem('concentratorsExcludedIds')) ?? [];

    this.concentratorsColumns
      .filter((item) => item.field !== 'icons')
      .filter((item) => item.field !== 'rowActions')
      .map((columns) => (columns.hidden = false));

    this.getDcuUnitsGridLayoutStore();
  }

  getData() {
    this.loading = true;
    if (this.pageNumber === 0) {
      this.pageNumber++;
    }
    this.dataConcentratorUnitsService
      .getGridDcuForm(
        this.requestModel,
        this.pageNumber,
        this.concentratorsColumns.map((column) => column.field),
        this.pageSize
      )
      .subscribe(
        (data) => {
          this.loading = false;
          this.gridData = data;
          this.gridData.data = [...data.data];
          this.totalCount = this.gridData.totalCount;
          if (this.totalCount === 0) {
            this.pageNumber = 0;
          }
        },
        (error) => {
          console.log(error);
          this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
          this.loading = false;
        }
      );
  }

  ngOnDestroy(): void {
    if (this.dcuAddedSubscription) {
      this.dcuAddedSubscription.unsubscribe();
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.listSubscription) {
      this.listSubscription.unsubscribe();
    }
  }

  searchData($event: string) {
    if ($event !== this.dataConcentratorUnitsGridService.getSessionSettingsSearchedText()) {
      this.dataConcentratorUnitsGridService.setSessionSettingsSearchedText($event);

      const useWildcards = this.wildCardsSearch;

      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event, useWildcards }];

      this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
      this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
      this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
      this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(false);
      this.selectedRowsIds = [];
      this.requestModel.excludeIds = [];
      this.selectAllEnabled = false;

      localStorage.setItem('concentratorsExcludedIds', JSON.stringify(this.requestModel?.excludeIds));
      localStorage.setItem('concentratorsSelectedRowsIds', JSON.stringify(this.selectedRowsIds));
      localStorage.setItem('concentratorsSelectAllEnabled', JSON.stringify(this.selectAllEnabled));

      this.getData();
      this.saveSettingsStore();
    }
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
  setFilter(saveUserDataToApi = true) {
    this.pageNumber = 1;
    this.setFilterInfo();
    const filterDCU = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;
    this.requestModel.filterModel.states = filterDCU?.statesFilter ?? [];
    this.requestModel.filterModel.readStatus = {
      operation: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.operation : { id: '', value: '' },
      value1: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value1 : 0,
      value2: filterDCU.readStatusFilter ? filterDCU.readStatusFilter.value2 : 0
    };

    this.requestModel.filterModel.types = filterDCU.typesFilter?.map((t) => t.id);
    this.requestModel.filterModel.tags = filterDCU.tagsFilter;
    this.requestModel.searchModel = this.setSearch();
    this.requestModel.filterModel.vendors = filterDCU.vendorsFilter;
    this.requestModel.filterModel.sla = filterDCU.slaFilter;
    this.requestModel.filterModel.lastCommunicationFilter = filterDCU.lastCommunicationFilter;
    if (saveUserDataToApi) {
      this.saveSettingsStore();
    }
    return this.requestModel.filterModel;
  }

  applyFilters() {
    this.requestModel.filterModel = this.setFilter();
    this.getData();
  }

  // fill text in header - about selected filters
  setFilterInfo() {
    const filter = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;

    this.filtersInfo = this.staticTextService.getFiltersInfo(
      filter.name,
      filter.statesFilter && filter.statesFilter.length > 0,
      filter.readStatusFilter && filter.readStatusFilter.operation && filter.readStatusFilter.operation.id.length > 0,
      filter.typesFilter && filter.typesFilter.length > 0,
      filter.vendorsFilter && filter.vendorsFilter.length > 0,
      filter.tagsFilter && filter.tagsFilter.length > 0,
      filter.slaFilter && true,
      filter.lastCommunicationFilter && true
    );
  }

  getFilterInfo(): number {
    const filterInfo: DcuLayout = this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout;
    return this.staticTextService.getFiltersInfo(
      filterInfo.name,
      filterInfo.statesFilter && filterInfo.statesFilter.length > 0,
      filterInfo.readStatusFilter && filterInfo.readStatusFilter.operation && filterInfo.readStatusFilter.operation.id.length > 0,
      filterInfo.typesFilter && filterInfo.typesFilter.length > 0,
      filterInfo.vendorsFilter && filterInfo.vendorsFilter.length > 0,
      filterInfo.tagsFilter && filterInfo.tagsFilter.length > 0,
      filterInfo.slaFilter && true,
      filterInfo.lastCommunicationFilter && true
    ).count;
  }

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

  getSelectedCount(): number {
    if (this.selectAllEnabled) {
      return this.totalCount - (this.requestModel?.excludeIds?.length ?? 0);
    } else {
      return this.selectedRowsIds?.length ?? 0;
    }
  }

  rowActionsClicked(event: any) {
    if (event.actionName === 'details') {
      this.openDetailsPage(event.rowData.concentratorId);
    }
  }

  openDetailsPage(id: string) {
    this.router.navigate([`/dataConcentratorUnits/${id}`]);
  }

  addDcu() {
    this.jobsSelectGridService.clearSessionSettingsSelectedRows();
    const options: NgbModalOptions = {
      size: 'lg'
    };
    const modalRef = this.modalService.open(AddDcuFormComponent, options);
    modalRef.result.then(() => {}).catch(() => {});
  }

  getAllDisplayedColumnsNames(): string[] {
    return this.concentratorsColumns?.filter((column) => column.hidden !== true).map((column) => column.field);
  }

  getDcuUnitsGridLayoutStore() {
    this.settingsStoreService.getCurrentUserSettings(this.dcuUnitsGridLayoutStoreKey).subscribe(
      (settings) => {
        this.dcuUnitsGridLayoutStore = settings as DcuUnitsGridLayoutStore;
        if (settings) {
          this.addSettingsToSession(settings);
          this.searchText = settings.searchText;
          this.setFilter(false);

          if (settings.sortModel?.length > 0) {
            this.defaultSort = settings.sortModel[0];
            this.requestModel.sortModel[0] = this.defaultSort;
          }
        }
        this.areSettingsLoaded = true;
        this.getData();
      },
      () => {
        this.areSettingsLoaded = true;
        this.getData();
      }
    );
  }

  addSettingsToSession(settings: DcuUnitsGridLayoutStore) {
    if (settings) {
      if (settings.currentPageIndex) {
        this.pageNumber = settings.currentPageIndex + 1;
        this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(settings.currentPageIndex);
      }

      if (settings.dcuLayout) {
        this.gridFilterSessionStoreService.setGridLayout(this.sessionNameForGridFilter, settings.dcuLayout);
      }

      if (settings.searchText) {
        this.dataConcentratorUnitsGridService.setSessionSettingsSearchedText(settings.searchText);
      }

      if (settings.sortModel) {
        this.dataConcentratorUnitsGridService.setSessionSettingsGridSort(settings.sortModel[0]);
      }

      if (settings.visibleColumns) {
        this.concentratorsColumns
          .filter((item) => item.field !== 'icons')
          .filter((item) => item.field !== 'rowActions')
          .map((column) => (column.hidden = true));

        this.concentratorsColumns.forEach((column) => {
          if (settings.visibleColumns.includes(column.field)) {
            column.hidden = false;
          }
        });
      }

      if (settings.searchText) {
        this.searchText = settings.searchText;
        this.setSearch();
      }

      if (settings.searchWildcards) {
        this.wildCardsSearch = true;
        this.dataConcentratorUnitsGridService.setSessionSettingsSearchedWildcards(settings.searchWildcards);
        this.setSearch();
      }

      if (settings.pageSize) {
        this.pageSize = settings.pageSize.id;
      }
    }
  }

  saveSettingsStore(sortModel?: GridSortParams[], saveData = true) {
    const store: DcuUnitsGridLayoutStore = {
      currentPageIndex: this.dataConcentratorUnitsGridService?.getSessionSettingsPageIndex() ?? 0,
      dcuLayout: (this.gridFilterSessionStoreService.getGridLayout(this.sessionNameForGridFilter) as DcuLayout) ?? null,
      searchText: this.dataConcentratorUnitsGridService?.getSessionSettingsSearchedText() ?? '',
      searchWildcards: this.dataConcentratorUnitsGridService?.getSessionSettingsSearchedWildcards() ?? false,
      visibleColumns: this.getAllDisplayedColumnsNames(),
      sortModel: sortModel ? sortModel : [{ colId: 'slaSuccessPercentage', sort: 'asc' }],
      pageSize: this.pageSizes.find((pageSize) => pageSize.id === this.pageSize),
      hideFilter: true
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
      if (saveData) {
        this.settingsStoreService.saveCurrentUserSettings(this.dcuUnitsGridLayoutStoreKey, store);
      }
      this.dcuUnitsGridLayoutStore = store;
    }

    if (sortModel) {
      store.sortModel[0] = sortModel[0];
      this.settingsStoreService.saveCurrentUserSettings(this.dcuUnitsGridLayoutStoreKey, store);
    }
  }

  toggleWildcards(event: boolean) {
    this.wildCardsSearch = event;
    this.dataConcentratorUnitsGridService.setSessionSettingsSearchedWildcards(event);
    this.dataConcentratorUnitsGridService.setSessionSettingsPageIndex(0);
    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
    this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
    this.requestModel.searchModel = this.setSearch();
    this.selectedRowsIds = JSON.parse(localStorage.getItem('concentratorsSelectedRowsIds')) ?? [];
    this.selectAllEnabled = JSON.parse(localStorage.getItem('selectAllEnabled')) ?? false;
    this.requestModel.excludeIds = JSON.parse(localStorage.getItem('concentratorsExcludedIds')) ?? [];
    this.getData();
    this.saveSettingsStore(this.requestModel.sortModel);
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
      this.getData();
    }
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }

  calculateHeight() {
    return window.innerHeight - 220;
  }

  columnVisibilityChanged(event: ColumnVisibilityChangedEvent) {
    this.concentratorsColumns.find((column) => column.field === event.field).hidden = event.hidden;
    this.saveSettingsStore();
  }

  selectedRows(event: any) {
    this.selectedRowsIds = event;
    localStorage.setItem('concentratorsSelectedRowsIds', JSON.stringify(this.selectedRowsIds));
    const rowsData = this.gridData.data.filter((item) => this.selectedRowsIds.includes(item.concentratorId));

    this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows(rowsData);
    this.requestModel.deviceIds = this.selectedRowsIds;
  }

  excludedIdsFromSelectAll(event: SelectionEvent) {
    if (event.deselectedRows.length > 0) {
      event.deselectedRows.forEach((row) => {
        this.requestModel.excludeIds.push(row.dataItem.concentratorId);
      });
    }
    if (event.selectedRows.length > 0) {
      event.selectedRows.forEach((row) => {
        this.requestModel.excludeIds = this.requestModel.excludeIds.filter((id) => id !== row.dataItem.concentratorId);
      });
    }
    if (this.selectAllEnabled) {
      this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(true);
      const rowsData = this.gridData.data.filter((item) => this.requestModel.excludeIds.includes(item.concentratorId));
      this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows(rowsData);
      localStorage.setItem('concentratorsExcludedIds', JSON.stringify(this.requestModel?.excludeIds));
    }
    console.log(this.requestModel.excludeIds);
  }

  selectAll(event: boolean) {
    if (event) {
      this.dataConcentratorUnitsGridService.setSessionSettingsClearExcludedRows();
      this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(true);

      this.selectAllEnabled = true;
      this.requestModel.deviceIds = [];
      this.requestModel.excludeIds = [];
      this.selectedRowsIds = [];
      localStorage.setItem('concentratorsSelectedRowsIds', JSON.stringify(this.selectedRowsIds));
      localStorage.setItem('concentratorsSelectAllEnabled', JSON.stringify(this.selectAllEnabled));
      localStorage.setItem('concentratorsExcludedIds', JSON.stringify(this.requestModel.excludeIds));
    }
  }

  deSelectAll(event: boolean) {
    if (event) {
      this.dataConcentratorUnitsGridService.setSessionSettingsClearExcludedRows();
      this.dataConcentratorUnitsGridService.setSessionSettingsSelectedRows([]);
      this.dataConcentratorUnitsGridService.setSessionSettingsExcludedRows([]);
      this.dataConcentratorUnitsGridService.setSessionSettingsSelectedAll(false);

      this.selectAllEnabled = false;
      this.selectedRowsIds = [];
      this.requestModel.excludeIds = [];
      localStorage.setItem('concentratorsSelectedRowsIds', JSON.stringify(this.selectedRowsIds));
      localStorage.setItem('concentratorsSelectAllEnabled', JSON.stringify(this.selectAllEnabled));
      localStorage.setItem('concentratorsSelectedRowsIds', JSON.stringify(this.selectedRowsIds));
    }
  }

  linkClicked(event: LinkClickedEvent) {
    if (event.field === 'name') {
      this.openDetailsPage(event.id);
    }
    if (event.field === 'hostname') {
      window.open(`https://${event.rowData.hostname}`, '_blank');
    }
    if (event.field === 'meters') {
      this.router.navigate(['/meterUnits'], { queryParams: { search: event.rowData.name } });
    }
  }

  filterIconClicked(event: boolean) {
    if (event) {
      this.filtersOpened = !this.filtersOpened;
    }
  }

  closeSlideOut() {
    this.filtersOpened = false;
  }

  // page changed on grid
  loadMoreData(event: PageChangedEvent) {
    this.pageNumber = event.pageNumber;
    if (event.rowsPerPage && event.rowsPerPage !== this.pageSize) {
      this.pageNumber = 1; // init page number after page size increased
      this.pageSize = event.rowsPerPage;
    }
    this.getData();
    this.saveSettingsStore();
  }

  clearFilters(event: boolean) {
    // clear and apply filters
    this.searchText = '';
    this.dataConcentratorUnitsGridService.setSessionSettingsSearchedText(this.searchText);
    this.gridFilterSessionStoreService.clearGridLayout();
    this.eventsService.emitCustom('ClearDcFilter', true);
  }

  sortingChanged(event: SortDescriptor[]) {
    this.loading = true;
    this.requestModel.sortModel = [];
    this.defaultSort = {
      colId: event[0].field,
      sort: event[0].dir
    };
    this.requestModel.sortModel.push(this.defaultSort);
    this.getData();
    this.saveSettingsStore(this.requestModel.sortModel);
  }
}
