import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ScheduledJobsList } from 'src/app/core/repository/interfaces/jobs/scheduled-jobs-list.interface';
import { ActionFormStaticTextService } from 'src/app/features/data-concentrator-units/components/action-form/services/action-form-static-text.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { ScheduledJobsListGridService } from '../../services/scheduled-jobs-list-grid.service';
import { ScheduledJobsService } from 'src/app/core/repository/services/jobs/scheduled-jobs.service';
import { ScheduledJobsStaticTextService } from '../../services/scheduled-jobs-static-text.service';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';

@Component({
  selector: 'app-scheduled-jobs-list',
  templateUrl: './scheduled-jobs-list.component.html'
})
export class ScheduledJobsListComponent implements OnInit {
  form: FormGroup;

  selectedId = 1;
  countScheduled = 0;
  searchTextEmpty = true;
  public modules: Module[] = AllModules;
  public gridApi;
  public frameworkComponents;
  columnDefs = [];
  rowData$: Observable<ScheduledJobsList[]>;
  rowData: ScheduledJobsList[];
  allRowData: ScheduledJobsList[];
  selectedAll = false;
  headerTitle = this.staticTextService.jobsTitle;

  constructor(
    private i18n: I18n,
    private scheduledJobsService: ScheduledJobsService,
    private scheduledJobsListGridService: ScheduledJobsListGridService,
    public fb: FormBuilder,
    public staticTextService: ScheduledJobsStaticTextService,
    private formUtils: FormsUtilsService
  ) {
    this.frameworkComponents = scheduledJobsListGridService.setFrameworkComponents();
  }

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
    this.columnDefs = this.scheduledJobsListGridService.setGridDefaultColumns();
    this.refreshGrid();
  }

  refreshGrid() {
    this.form = this.createForm();
    this.rowData$ = this.scheduledJobsService.getScheduledJobsList();
    this.rowData$.subscribe(x => {
      this.allRowData = x;
      this.countScheduled = x.length;
      this.searchData();
    });
  }

  searchData(search: string = '') {
    const searchToLower = search.toLowerCase();
    this.rowData = _.filter(
      this.allRowData,
      data =>
        data.type.toLowerCase().includes(searchToLower) ||
        data.description.toLowerCase().includes(searchToLower) ||
        data.nextRun.toLowerCase().includes(searchToLower) ||
        data.owner.toLowerCase().includes(searchToLower)
    );
    this.countScheduled = this.rowData.length;
  }
}
