import { PermissionService } from './../../../../core/permissions/services/permission.service';
import { PermissionEnumerator } from './../../../../core/permissions/enumerators/permission-enumerator.model';
import { JobTypeEnumeration } from './../../enums/job-type.enum';
import { GridUtils } from 'src/app/features/global/grid.utils';
import { Codelist } from './../../../../shared/repository/interfaces/codelists/codelist.interface';
import { SidebarToggleService } from './../../../../shared/base-template/components/services/sidebar.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AllModules, Module, GridOptions } from '@ag-grid-enterprise/all-modules';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';
import { SchedulerJobsListGridService } from '../../services/scheduler-jobs-list-grid.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { JobsStaticTextService } from '../../services/jobs-static-text.service';
import { enumSearchFilterOperators } from 'src/environments/config';
import { GridRequestParams, GridSortParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { SchedulerJobsEventEmitterService } from '../../services/scheduler-jobs-event-emitter.service';
import { SchedulerJobComponent } from '../scheduler-job/scheduler-job.component';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { SchedulerJobsListGridLayoutStore } from '../../interfaces/scheduler-jobs-list-grid-layout-store.interface';
import { SettingsStoreService } from 'src/app/core/repository/services/settings-store/settings-store.service';
import { SettingsStoreEmitterService } from 'src/app/core/repository/services/settings-store/settings-store-emitter.service';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';

@Component({
  selector: 'app-scheduler-jobs-list',
  templateUrl: './scheduler-jobs-list.component.html'
})
export class SchedulerJobsListComponent implements OnInit, OnDestroy {
  selectedId = 1;
  totalCount = 0;
  searchTextEmpty = true;

  rowData$: Observable<SchedulerJobsList[]>;
  rowData: SchedulerJobsList[];
  allRowData: SchedulerJobsList[];
  headerTitle = this.staticTextService.jobsTitle;

  // N/A
  notAvailableText = this.staticTextService.notAvailableTekst;
  overlayNoRowsTemplate = this.staticTextService.noRecordsFound;
  overlayLoadingTemplate = this.staticTextService.loadingData;
  noData = false;

  // ag-grid
  public modules: Module[] = AllModules;
  public gridOptions: Partial<GridOptions>;
  public gridApi;
  public frameworkComponents;
  requestModel: GridRequestParams = {
    requestId: null,
    startRow: 0,
    endRow: 0,
    sortModel: [],
    searchModel: []
  };
  columnDefs = [];

  public localeText;

  private refreshSubscription: Subscription;

  schedulerJobsListGridLayoutStoreKey = 'scheduler-jobs-list-grid-layout';
  schedulerJobsListGridLayoutStore: SchedulerJobsListGridLayoutStore;

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

  gridColumnApi;

  public useWildcards = false;

  constructor(
    private schedulerJobsService: JobsService,
    private schedulerJobsListGridService: SchedulerJobsListGridService,
    public fb: FormBuilder,
    public staticTextService: JobsStaticTextService,
    private eventService: SchedulerJobsEventEmitterService,
    private modalService: ModalService,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private sidebarToggleService: SidebarToggleService,
    private codelistService: CodelistRepositoryService,
    private settingsStoreService: SettingsStoreService,
    private settingsStoreEmitterService: SettingsStoreEmitterService,
    private codelistMeterUnitsRepositoryService: CodelistMeterUnitsRepositoryService,
    private permissionService: PermissionService
  ) {
    if (this.gridApi) {
      this.gridApi.purgeServerSideCache([]);
    }

    this.frameworkComponents = schedulerJobsListGridService.setFrameworkComponents();
    this.gridOptions = this.schedulerJobsListGridService.setGridOptions();

    this.refreshSubscription = this.eventService.eventEmitterRefresh.subscribe({
      next: (event: boolean) => {
        if (event) {
          setTimeout(() => {
            this.refreshGrid();
          }, 500);
        }
      }
    });

    this.form = this.createForm(this.pageSizes[0]);
  }

  private noSearch() {
    if (this.requestModel.searchModel == null || this.requestModel.searchModel.length === 0) {
      return true;
    }
    return false;
  }

  setSearch() {
    const search = this.schedulerJobsListGridService.getSessionSettingsSearchedText();

    let useWildcards = this.schedulerJobsListGridService.getSessionSettingsSearchedWildcards();
    if (!useWildcards) {
      useWildcards = false;
    }

    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search, useWildcards }]);
    }
    return [];
  }

  loadData(instance: SchedulerJobsListComponent, paramsRow: any) {
    const displayedColumnsNames = instance.getAllDisplayedColumnsNames();

    instance.schedulerJobsService
      .getSchedulerJobsListForm(
        instance.requestModel,
        instance.schedulerJobsListGridService.getSessionSettingsPageIndex(),
        displayedColumnsNames
      )
      .subscribe((data) => {
        instance.gridApi.hideOverlay();

        if (data === undefined || data == null || data.totalCount === 0) {
          instance.totalCount = 0;
          instance.noData = true;
          instance.gridApi.showNoRowsOverlay();
        } else {
          instance.totalCount = data.totalCount;
          instance.noData = false;
        }

        paramsRow.successCallback(data ? data.data : [], instance.totalCount);

        instance.gridApi.paginationGoToPage(instance.schedulerJobsListGridService.getSessionSettingsPageIndex());
        this.isGridLoaded = true;

        this.resizeColumns();
      });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    this.getSchedulerJobsListGridLayoutStore();
  }

  ngOnInit() {
    this.columnDefs = this.schedulerJobsListGridService.setGridDefaultColumns();

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

    this.breadcrumbService.setPageName(this.headerTitle);
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  refreshGrid() {
    this.gridApi.purgeServerSideCache([]);
  }

  searchData($event: string) {
    if (this.isGridLoaded && this.areSettingsLoaded) {
      if ($event !== this.schedulerJobsListGridService.getSessionSettingsSearchedText()) {
        this.schedulerJobsListGridService.setSessionSettingsSearchedText($event);

        const useWildcards = this.schedulerJobsListGridService.getSessionSettingsSearchedWildcards();
        this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event, useWildcards }];

        this.schedulerJobsListGridService.setSessionSettingsPageIndex(0);
        this.gridApi.onFilterChanged();
      }
    }
  }

  onFirstDataRendered(params) {
    // params.api.sizeColumnsToFit();
    // params.api.showLoadingOverlay();
  }

  // on change page in the grid
  onPaginationChange(params) {
    const currentApiPage = params.api.paginationGetCurrentPage();
    const currentSessionPage = this.schedulerJobsListGridService.getSessionSettingsPageIndex();

    if (currentApiPage !== currentSessionPage) {
      if (this.isGridLoaded && this.areSettingsLoaded) {
        if (params.newPage) {
          this.schedulerJobsListGridService.setSessionSettingsPageIndex(currentApiPage);
        }
      } else {
      }
    }
  }

  addJob() {
    const options: NgbModalOptions = {
      size: 'xl'
    };

    const modalRef = this.modalService.open(SchedulerJobComponent, options);

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        this.refreshGrid();
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  setGridDataSource() {
    const that = this;
    that.datasource = {
      getRows(paramsRow) {
        if (!that.areSettingsLoaded) {
          return;
        }

        that.requestModel.startRow = that.schedulerJobsListGridService.getCurrentRowIndex(that.selectedPageSize.id).startRow;
        that.requestModel.endRow = that.schedulerJobsListGridService.getCurrentRowIndex(that.selectedPageSize.id).endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;
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
        //       that.loadData(that, paramsRow);
        //     })
        //     .catch((err) => {
        //       if (err.message === 'login_required') {
        //         that.authService.login().catch((err2) => console.log(err2));
        //       }
        //     });
        // } else {
        that.loadData(that, paramsRow);
        // }
      }
    };
    this.gridApi.setServerSideDatasource(that.datasource);
  }

  getSchedulerJobsListGridLayoutStore() {
    this.settingsStoreService.getCurrentUserSettings(this.schedulerJobsListGridLayoutStoreKey).subscribe(
      (settings) => {
        this.schedulerJobsListGridLayoutStore = settings as SchedulerJobsListGridLayoutStore;
        this.addSettingsToSession(settings);
        this.areSettingsLoaded = true;
        this.setGridDataSource();
      },
      (error) => {
        this.areSettingsLoaded = true;
        this.setGridDataSource();
      }
    );
  }

  addSettingsToSession(settings: SchedulerJobsListGridLayoutStore) {
    if (settings) {
      if (settings.currentPageIndex) {
        this.schedulerJobsListGridService.setSessionSettingsPageIndex(settings.currentPageIndex);
      }

      if (settings.sortModel && this.gridColumnApi) {
        this.requestModel.sortModel = settings.sortModel;
        this.gridColumnApi.applyColumnState({ state: settings.sortModel });
      }

      if (settings.searchText) {
        this.schedulerJobsListGridService.setSessionSettingsSearchedText(settings.searchText);
      }

      if (settings.searchWildcards) {
        this.schedulerJobsListGridService.setSessionSettingsSearchedWildcards(settings.searchWildcards);
        this.useWildcards = settings.searchWildcards;
      }

      if (settings.pageSize) {
        this.selectedPageSize = settings.pageSize;
        this.form.get(this.pageSizeProperty).setValue(this.selectedPageSize);
        this.setGridPageSize();
      }

      this.settingsStoreEmitterService.settingsLoaded();
      // send to subscribers the visibility of columns
    }
  }

  saveSettingsStore(sortModel?: GridSortParams[]) {
    const store: SchedulerJobsListGridLayoutStore = {
      currentPageIndex: this.schedulerJobsListGridService.getSessionSettingsPageIndex(),
      sortModel: sortModel ? sortModel : this.schedulerJobsListGridLayoutStore.sortModel,
      searchText: this.schedulerJobsListGridService.getSessionSettingsSearchedText(),
      searchWildcards: this.schedulerJobsListGridService.getSessionSettingsSearchedWildcards(),
      pageSize: this.selectedPageSize
    };

    if (
      !this.schedulerJobsListGridLayoutStore ||
      store.currentPageIndex !== this.schedulerJobsListGridLayoutStore.currentPageIndex ||
      JSON.stringify(store.sortModel) !== JSON.stringify(this.schedulerJobsListGridLayoutStore.sortModel) ||
      store.searchText !== this.schedulerJobsListGridLayoutStore.searchText ||
      store.searchWildcards !== this.schedulerJobsListGridLayoutStore.searchWildcards ||
      JSON.stringify(store.pageSize) !== JSON.stringify(this.schedulerJobsListGridLayoutStore.pageSize)
    ) {
      this.settingsStoreService.saveCurrentUserSettings(this.schedulerJobsListGridLayoutStoreKey, store);
      this.schedulerJobsListGridLayoutStore = store;
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
      this.schedulerJobsListGridService.setSessionSettingsPageIndex(0);
      this.selectedPageSize = selectedValue;
      this.setGridPageSize();
    }
  }

  setGridPageSize() {
    const api: any = this.gridApi;
    api.gridOptionsWrapper.setProperty('cacheBlockSize', this.selectedPageSize.id);
    this.gridApi.setServerSideDatasource(this.datasource);
  }

  gridSizeChanged() {
    this.resizeColumns();
  }

  resizeColumns() {
    GridUtils.resizeColumns(this.gridColumnApi, this.gridOptions);
  }

  toggleWildcards($event: boolean) {
    if (this.isGridLoaded && this.areSettingsLoaded) {
      if ($event !== this.schedulerJobsListGridService.getSessionSettingsSearchedWildcards()) {
        this.schedulerJobsListGridService.setSessionSettingsSearchedWildcards($event);

        if (this.schedulerJobsListGridService.getSessionSettingsSearchedText()) {
          // const value = this.schedulerJobsListGridService.getSessionSettingsSearchedText();
          // this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value, useWildcards: $event  }];

          this.schedulerJobsListGridService.setSessionSettingsPageIndex(0);
          this.gridApi.onFilterChanged();
        } else {
          this.saveSettingsStore(this.requestModel.sortModel);
        }
      }
    }
  }

  getAllDisplayedColumnsNames(): string[] {
    if (this.gridColumnApi) {
      const columns = this.gridColumnApi.getAllDisplayedColumns();
      return columns.map((c) => c.colId);
    }
    return;
  }

  hasUserAddPermissions(): boolean {
    if (!this.permissionService.hasAccess(PermissionEnumerator.Manage_Jobs)) {
      return false;
    }

    return (
      this.permissionService.hasAccess(PermissionEnumerator.Manage_Meters) ||
      this.permissionService.hasAccess(PermissionEnumerator.Manage_Concentrators) ||
      this.permissionService.hasAccess(PermissionEnumerator.Manage_Meters)
    );
  }

  get permissionJobsManage() {
    return PermissionEnumerator.Manage_Jobs;
  }

  get permissionMetersManage() {
    return PermissionEnumerator.Manage_Meters;
  }

  get permissionConcentratorsManage() {
    return PermissionEnumerator.Manage_Concentrators;
  }

  get permissionAlarmsManage() {
    return PermissionEnumerator.Manage_Alarms;
  }
}
