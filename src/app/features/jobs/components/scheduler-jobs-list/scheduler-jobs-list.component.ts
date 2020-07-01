import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AllModules, Module, GridOptions } from '@ag-grid-enterprise/all-modules';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Observable, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';
import { ActionFormStaticTextService } from 'src/app/features/data-concentrator-units/components/action-form/services/action-form-static-text.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { SchedulerJobsListGridService } from '../../services/scheduler-jobs-list-grid.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { JobsStaticTextService } from '../../services/jobs-static-text.service';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';
import { enumSearchFilterOperators } from 'src/environments/config';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { SchedulerJobsEventEmitterService } from '../../services/scheduler-jobs-event-emitter.service';
import { SchedulerJobComponent } from '../scheduler-job/scheduler-job.component';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-scheduler-jobs-list',
  templateUrl: './scheduler-jobs-list.component.html'
})
export class SchedulerJobsListComponent implements OnInit, OnDestroy {
  form: FormGroup;

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

  private localeText;

  private refreshSubscription: Subscription;

  constructor(
    private i18n: I18n,
    private schedulerJobsService: JobsService,
    private schedulerJobsListGridService: SchedulerJobsListGridService,
    public fb: FormBuilder,
    public staticTextService: JobsStaticTextService,
    private eventService: SchedulerJobsEventEmitterService,
    private formUtils: FormsUtilsService,
    private modalService: ModalService,
    private authService: AuthService
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

  createForm(): FormGroup {
    return this.fb.group({
      ['content']: ['']
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

    const that = this;
    const datasource = {
      getRows(paramsRow) {
        that.requestModel.startRow = that.schedulerJobsListGridService.getCurrentRowIndex().startRow;
        that.requestModel.endRow = that.schedulerJobsListGridService.getCurrentRowIndex().endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;
        that.requestModel.searchModel = that.setSearch();
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

  ngOnInit() {
    console.log('scheduled-jobs-list.component ngOnInit');
    this.columnDefs = this.schedulerJobsListGridService.setGridDefaultColumns();

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
    params.api.showLoadingOverlay();
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
    const modalRef = this.modalService.open(SchedulerJobComponent, options);
    const component: SchedulerJobComponent = modalRef.componentInstance;

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
}
