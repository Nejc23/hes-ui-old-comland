import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { Observable } from 'rxjs';
import { ActiveJobsList } from 'src/app/core/repository/interfaces/jobs/active-jobs-list.interface';
import { ActiveJobsGridService } from '../../services/active-jobs-grid.service';

@Component({
  selector: 'app-active-job',
  templateUrl: './active-job.component.html'
})
export class ActiveJobComponent implements OnInit {
  @Input() deviceId: string;

  public modules: Module[] = AllModules;
  public gridApi;
  public frameworkComponents;
  columnDefs = [];
  rowData$: Observable<ActiveJobsList[]>;
  rowData: ActiveJobsList[];

  constructor(private activeJobsService: JobsService, private activeJobsGridService: ActiveJobsGridService) {
    this.frameworkComponents = activeJobsGridService.setFrameworkComponents();
  }

  ngOnInit() {
    this.columnDefs = this.activeJobsGridService.setGridDefaultColumns();
    this.rowData$ = this.activeJobsService.getActiveJobsList(this.deviceId);
    this.rowData$.subscribe((x) => {
      this.rowData = x;
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }
}
