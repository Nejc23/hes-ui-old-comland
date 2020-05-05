import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ScheduledJobsList } from 'src/app/core/repository/interfaces/scheduled-jobs/scheduled-jobs-list.interface';
import { ActionFormStaticTextService } from 'src/app/features/data-concentrator-units/components/action-form/services/action-form-static-text.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { ScheduledJobsListGridService } from '../../services/scheduled-jobs-list-grid.service';
import { ScheduledJobsService } from 'src/app/core/repository/services/scheduled-jobs/scheduled-jobs.service';
import { ScheduledJobsStaticTextService } from '../../services/scheduled-jobs-static-text.service';

@Component({
  selector: 'app-scheduled-jobs-list',
  templateUrl: './scheduled-jobs-list.component.html'
})
export class ScheduledJobsListComponent implements OnInit {
  form: FormGroup;
  searchTextEmpty = true;
  public modules: Module[] = AllModules;
  public gridApi;
  columnDefs = [];
  rowData$: Observable<ScheduledJobsList[]>;
  rowData: ScheduledJobsList[];
  allRowData: ScheduledJobsList[];
  totalCount = 0;
  selectedAll = false;
  headerTitle = this.staticTextService.jobsTitle;

  constructor(
    private i18n: I18n,
    private scheduledJobsService: ScheduledJobsService,
    private scheduledJobsListGridService: ScheduledJobsListGridService,
    public fb: FormBuilder,
    public staticTextService: ScheduledJobsStaticTextService,
    private formUtils: FormsUtilsService
  ) {}

  createForm(): FormGroup {
    return this.fb.group({
      ['content']: ['']
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  ngOnInit() {
    console.log('scheduled-jobs-list.component ngOnInit');
    this.form = this.createForm();
    this.columnDefs = this.scheduledJobsListGridService.setGridDefaultColumns();
    this.rowData$ = this.scheduledJobsService.getScheduledJobsList();
    this.rowData$.subscribe(x => {
      this.rowData = x;
      console.log(JSON.stringify(this.rowData));
      this.totalCount = x.length;
    });
  }

  getSelectedRowId() {
    const selectedRows = this.gridApi.getSelectedRows();
    const rows = _.map(
      selectedRows,
      nameOf<ScheduledJobsList>(o => o.id)
    );
    if (rows.length > 0) {
      return rows[0];
    } else {
      return null;
    }
  }

  deselectAllRows() {
    this.gridApi.deselectAll();
  }

  get searchProperty() {
    return 'content';
  }
}
