import { SidebarToggleService } from './../../../../shared/base-template/components/services/sidebar.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AllModules, Module, GridOptions } from '@ag-grid-enterprise/all-modules';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { FormBuilder } from '@angular/forms';
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
import { SchedulerDiscoveryJobComponent } from '../scheduler-discovery-job/scheduler-discovery-job.component';
import { SchedulerDcTimeSyncJobComponent } from '../dc-time-sync/scheduler-dc-time-sync-job.component';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { SchedulerJobsListGridLayoutStore } from '../../interfaces/scheduler-jobs-list-grid-layout-store.interface';
import { SettingsStoreService } from 'src/app/core/repository/services/settings-store/settings-store.service';
import { SettingsStoreEmitterService } from 'src/app/core/repository/services/settings-store/settings-store-emitter.service';

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
  loadGrid = true;
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
    private settingsStoreEmitterService: SettingsStoreEmitterService
  ) {
    if (this.gridApi) {
      this.gridApi.purgeServerSideCache([]);
    }

    this.frameworkComponents = schedulerJobsListGridService.setFrameworkComponents();
    this.gridOptions = this.schedulerJobsListGridService.setGridOptions();

    this.refreshSubscription = this.eventService.eventEmitterRefresh.subscribe({
      next: (event: boolean) => {
        if (event) {
          this.refreshGrid();
        }
      }
    });
  }

  private noSearch() {
    if (this.requestModel.searchModel == null || this.requestModel.searchModel.length === 0) {
      return true;
    }
    return false;
  }

  setSearch() {
    const search = this.schedulerJobsListGridService.getSessionSettingsSearchedText();
    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search }]);
    }
    return [];
  }

  loadData(instance: SchedulerJobsListComponent, paramsRow: any) {
    instance.schedulerJobsService.getSchedulerJobsList(instance.requestModel).subscribe(data => {
      instance.gridApi.hideOverlay();
      instance.totalCount = data.totalCount;
      if ((data === undefined || data == null || data.totalCount === 0) && instance.noSearch()) {
        instance.noData = true;
      } else if (data.totalCount === 0) {
        instance.gridApi.showNoRowsOverlay();
      }

      instance.gridApi.paginationGoToPage(instance.schedulerJobsListGridService.getSessionSettingsPageIndex());
      paramsRow.successCallback(data.data, data.totalCount);
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    window.onresize = () => {
      this.gridApi.sizeColumnsToFit();
    };

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

    this.sidebarToggleService.eventEmitterToggleMenu.subscribe(() => {
      setTimeout(() => {
        this.gridApi.sizeColumnsToFit();
      }, 320);
    });
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
    if ($event !== this.schedulerJobsListGridService.getSessionSettingsSearchedText()) {
      this.schedulerJobsListGridService.setSessionSettingsSearchedText($event);
      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event }];

      this.schedulerJobsListGridService.setSessionSettingsPageIndex(0);
      this.gridApi.onFilterChanged();
    }
  }

  onFirstDataRendered(params) {
    // params.api.sizeColumnsToFit();
    // params.api.showLoadingOverlay();
  }

  // on change page in the grid
  onPaginationChange(params) {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }

    if (params.newPage && !this.loadGrid) {
      this.schedulerJobsListGridService.setSessionSettingsPageIndex(params.api.paginationGetCurrentPage());
    } else if (!params.newPage && params.keepRenderedRows && this.loadGrid) {
      this.loadGrid = false;
      params.api.paginationGoToPage(this.schedulerJobsListGridService.getSessionSettingsPageIndex());
    }
  }

  addJob() {
    const options: NgbModalOptions = {
      size: 'xl'
    };

    this.codelistService.timeUnitCodeslist().subscribe(units => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormAddNew(units);

      modalRef.result.then(
        data => {
          // on close (CONFIRM)
          this.refreshGrid();
        },
        reason => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  addDiscoveryJob() {
    const options: NgbModalOptions = {
      size: 'xl'
    };

    const modalRef = this.modalService.open(SchedulerDiscoveryJobComponent, options);
    const component: SchedulerDiscoveryJobComponent = modalRef.componentInstance;
    component.setFormAddNew();

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        this.refreshGrid();
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }

  addDcTimeSyncJob() {
    const options: NgbModalOptions = {
      size: 'xl'
    };

    const modalRef = this.modalService.open(SchedulerDcTimeSyncJobComponent, options);
    const component: SchedulerDcTimeSyncJobComponent = modalRef.componentInstance;
    component.setFormAddNew();

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        this.refreshGrid();
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }

  setGridDataSource() {
    const that = this;
    const datasource = {
      getRows(paramsRow) {
        that.requestModel.startRow = that.schedulerJobsListGridService.getCurrentRowIndex().startRow;
        that.requestModel.endRow = that.schedulerJobsListGridService.getCurrentRowIndex().endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;
        that.requestModel.searchModel = that.setSearch();

        that.saveSettingsStore(that.requestModel.sortModel);

        if (that.authService.isRefreshNeeded2()) {
          that.authService
            .renewToken()
            .then(value => {
              that.authService.user = value;
              that.authService.saveTokenAndSetUserRights2(value, '');
              that.loadData(that, paramsRow);
            })
            .catch(err => {
              if (err.message === 'login_required') {
                that.authService.login().catch(err2 => console.log(err2));
              }
            });
        } else {
          that.loadData(that, paramsRow);
        }
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  getSchedulerJobsListGridLayoutStore() {
    this.settingsStoreService.getCurrentUserSettings(this.schedulerJobsListGridLayoutStoreKey).subscribe(
      settings => {
        this.schedulerJobsListGridLayoutStore = settings as SchedulerJobsListGridLayoutStore;
        this.addSettingsToSession(settings);
        this.setGridDataSource();
      },
      error => {
        this.setGridDataSource();
      }
    );
  }

  addSettingsToSession(settings: SchedulerJobsListGridLayoutStore) {
    if (settings) {
      if (settings.currentPageIndex) {
        this.schedulerJobsListGridService.setSessionSettingsPageIndex(settings.currentPageIndex);
      }

      if (settings.sortModel) {
        this.requestModel.sortModel = settings.sortModel;
        this.gridApi.setSortModel(settings.sortModel);
      }

      if (settings.searchText) {
        this.schedulerJobsListGridService.setSessionSettingsSearchedText(settings.searchText);
      }

      this.settingsStoreEmitterService.settingsLoaded();
      // send to subscribers the visibility of columns
    }
  }

  saveSettingsStore(sortModel: GridSortParams[]) {
    const store: SchedulerJobsListGridLayoutStore = {
      currentPageIndex: this.schedulerJobsListGridService.getSessionSettingsPageIndex(),
      sortModel,
      searchText: this.schedulerJobsListGridService.getSessionSettingsSearchedText()
    };

    if (
      !this.schedulerJobsListGridLayoutStore ||
      store.currentPageIndex !== this.schedulerJobsListGridLayoutStore.currentPageIndex ||
      JSON.stringify(store.sortModel) !== JSON.stringify(this.schedulerJobsListGridLayoutStore.sortModel) ||
      store.searchText !== this.schedulerJobsListGridLayoutStore.searchText
    ) {
      this.settingsStoreService.saveCurrentUserSettings(this.schedulerJobsListGridLayoutStoreKey, store);
      this.schedulerJobsListGridLayoutStore = store;
    }
  }
}
