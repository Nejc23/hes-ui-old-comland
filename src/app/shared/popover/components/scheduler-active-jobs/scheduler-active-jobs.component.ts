import { ActiveJobsGridService } from './../../services/active-jobs-grid.service';
import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { AllModules, Module } from '@ag-grid-enterprise/all-modules';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-scheduler-active-jobs',
  templateUrl: 'scheduler-active-jobs.component.html'
})
export class SchedulerActiveJobsComponent implements OnInit {
  @Input() defaultItemCount = 5;
  @Input() deviceId: string;

  public modules: Module[] = AllModules;

  isContentLoaded = false;
  isMoreButtonVisible = false;

  public gridApi;

  public frameworkComponents;
  columnDefs = [];
  allActiveJobs$: Observable<SchedulerJobsList[]>;
  allActiveJobs: SchedulerJobsList[];
  visibleActiveJobs: SchedulerJobsList[];

  constructor(
    private activeJobsService: JobsService,
    private activeJobsGridService: ActiveJobsGridService,
    private translate: TranslateService
  ) {
    this.frameworkComponents = activeJobsGridService.setFrameworkComponents();
  }

  public showMore(): void {
    this.visibleActiveJobs = this.allActiveJobs;
    this.isMoreButtonVisible = false;
  }

  ngOnInit() {
    this.columnDefs = [
      {
        field: 'description',
        suppressMenu: true
      },
      {
        field: 'nextRun',
        suppressMenu: true
      }
    ];

    this.allActiveJobs$ = this.activeJobsService.getSchedulerActiveJobsList(this.deviceId);
    this.allActiveJobs$.subscribe((x) => {
      this.allActiveJobs = x;

      if (this.allActiveJobs.length > this.defaultItemCount) {
        this.isMoreButtonVisible = true;
        this.visibleActiveJobs = this.allActiveJobs.slice(0, this.defaultItemCount);
      } else {
        this.visibleActiveJobs = this.allActiveJobs;
        this.isMoreButtonVisible = false;
      }

      this.isContentLoaded = true;
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  // set momemnt text (last communication) out of date and time
  setMomentNextRun(time: string): string {
    return time != null && time.length > 0 ? moment(time).fromNow() : this.translate.instant('COMMON.NA');
  }

  getShowAllText(): string {
    return this.translate.instant('COMMON.NA') + this.allActiveJobs.length + this.translate.instant('COMMON.JOBS');
  }
}
