import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import * as moment from 'moment';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { Observable } from 'rxjs';
import { ActiveJobsList } from 'src/app/core/repository/interfaces/jobs/active-jobs-list.interface';
import { ActiveJobsGridService } from '../../services/active-jobs-grid.service';

@Component({
  selector: 'app-active-jobs',
  templateUrl: './active-jobs.component.html'
})
export class ActiveJobsComponent implements OnInit {
  @Input() deviceId: string;

  public modules: Module[] = AllModules;
  public gridApi;
  columnDefs = [];
  rowData$: Observable<ActiveJobsList[]>;
  rowData: ActiveJobsList[];

  constructor(
    private activeJobsService: JobsService,
    private activeJobsGridService: ActiveJobsGridService,
    public i18n: I18n,
    private modal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.columnDefs = this.activeJobsGridService.setGridDefaultColumns();
    this.rowData$ = this.activeJobsService.getActiveJobsList(this.deviceId);
    this.rowData$.subscribe(x => {
      this.rowData = x;
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  onDismiss() {
    this.modal.dismiss();
  }
}
