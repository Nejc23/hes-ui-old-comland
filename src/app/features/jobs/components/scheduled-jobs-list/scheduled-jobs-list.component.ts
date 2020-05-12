import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AllModules, Module, GridOptions } from '@ag-grid-enterprise/all-modules';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ScheduledJobsList } from 'src/app/core/repository/interfaces/jobs/scheduled-jobs-list.interface';
import { ActionFormStaticTextService } from 'src/app/features/data-concentrator-units/components/action-form/services/action-form-static-text.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { ScheduledJobsListGridService } from '../../services/scheduled-jobs-list-grid.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { JobsStaticTextService } from '../../services/jobs-static-text.service';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';
import { enumSearchFilterOperators } from 'src/environments/config';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/gris-request-params.interface';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ActiveJobsComponent } from '../active-jobs/active-jobs.component';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';

@Component({
  selector: 'app-scheduled-jobs-list',
  templateUrl: './scheduled-jobs-list.component.html'
})
export class ScheduledJobsListComponent implements OnInit {
  form: FormGroup;

  selectedId = 1;
  totalCount = 0;
  searchTextEmpty = true;

  rowData$: Observable<ScheduledJobsList[]>;
  rowData: ScheduledJobsList[];
  allRowData: ScheduledJobsList[];
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
    startRow: 0,
    endRow: 0,
    sortModel: [],
    searchModel: []
  };
  columnDefs = [];

  private localeText;

  constructor(
    private i18n: I18n,
    private scheduledJobsService: JobsService,
    private scheduledJobsListGridService: ScheduledJobsListGridService,
    public fb: FormBuilder,
    public staticTextService: JobsStaticTextService,
    private formUtils: FormsUtilsService,
    private modalService: ModalService
  ) {
    if (this.gridApi) {
      this.gridApi.purgeServerSideCache([]);
    }

    this.frameworkComponents = scheduledJobsListGridService.setFrameworkComponents();
    this.gridOptions = this.scheduledJobsListGridService.setGridOptions();
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
    const search = this.scheduledJobsListGridService.getSessionSettingsSearchedText();
    if (search && search !== '') {
      return (this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: search }]);
    }
    return [];
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();

    const that = this;
    const datasource = {
      getRows(paramsRow) {
        that.requestModel.startRow = that.scheduledJobsListGridService.getCurrentRowIndex().startRow;
        that.requestModel.endRow = that.scheduledJobsListGridService.getCurrentRowIndex().endRow;
        that.requestModel.sortModel = paramsRow.request.sortModel;
        that.requestModel.searchModel = that.setSearch();
        that.scheduledJobsService.getScheduledJobsList(that.requestModel).subscribe(data => {
          that.gridApi.hideOverlay();
          that.totalCount = data.totalCount;
          if ((data === undefined || data == null || data.totalCount === 0) && that.noSearch()) {
            that.noData = true;
          } else if (data.totalCount === 0) {
            that.gridApi.showNoRowsOverlay();
          }

          that.gridApi.paginationGoToPage(that.scheduledJobsListGridService.getSessionSettingsPageIndex());
          paramsRow.successCallback(data.data, data.totalCount);
        });
      }
    };
    this.gridApi.setServerSideDatasource(datasource);
  }

  ngOnInit() {
    console.log('scheduled-jobs-list.component ngOnInit');
    this.columnDefs = this.scheduledJobsListGridService.setGridDefaultColumns();

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

  refreshGrid() {
    this.gridApi.purgeServerSideCache([]);
  }

  searchData($event: string) {
    if ($event !== this.scheduledJobsListGridService.getSessionSettingsSearchedText()) {
      this.scheduledJobsListGridService.setSessionSettingsSearchedText($event);
      this.requestModel.searchModel = [{ colId: 'all', type: enumSearchFilterOperators.like, value: $event }];

      this.scheduledJobsListGridService.setSessionSettingsPageIndex(0);
      this.gridApi.onFilterChanged();
    }
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
    params.api.showLoadingOverlay();
  }

  // on change page in the grid
  onPaginationChange(params) {
    if (this.gridApi) {
      this.gridApi.refreshHeader();
    }

    if (params.newPage && !this.loadGrid) {
      this.scheduledJobsListGridService.setSessionSettingsPageIndex(params.api.paginationGetCurrentPage());
    } else if (!params.newPage && params.keepRenderedRows && this.loadGrid) {
      this.loadGrid = false;
      params.api.paginationGoToPage(this.scheduledJobsListGridService.getSessionSettingsPageIndex());
    }
  }

  addScheduledJob() {
    // TODO: AO, 07.05.2020, open form for adding new scheduled job
    const options: NgbModalOptions = {
      size: 'lg'
    };
    const deviceId = '221A39C5-6C84-4F6E-889C-96326862D771';
    const modalRef = this.modalService.open(ActiveJobsComponent, options);
    modalRef.componentInstance.deviceId = deviceId;
    modalRef.result.then(
      data => {
        // on close (CONFIRM)
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }
}
