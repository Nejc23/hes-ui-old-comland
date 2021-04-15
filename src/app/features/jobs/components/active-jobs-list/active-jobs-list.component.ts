import { NotificationFilter, ReadingProperties } from './../../../../core/repository/interfaces/jobs/scheduler-job.interface';
import { DataConcentratorUnitsSelectComponent } from './../../../data-concentrator-units-select/component/data-concentrator-units-select.component';
import { JobTypeEnumeration } from './../../enums/job-type.enum';
import { ToastNotificationService } from './../../../../core/toast-notification/services/toast-notification.service';
import { CronScheduleComponent } from './../../cron-schedule/components/cron-schedule.component';
import { Component, OnInit, ViewChild, Input, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { SchedulerJob, SchedulerJobForm } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
import { RegistersSelectComponent } from 'src/app/features/registers-select/component/registers-select.component';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { PlcMeterReadScheduleService } from 'src/app/features/meter-units/common/services/plc-meter-read-scheduler.service';
import { DataConcentratorUnitsSelectGridService } from 'src/app/features/data-concentrator-units-select/services/data-concentrator-units-select-grid.service';
import { ActiveJob } from '../../interfaces/active-job-progress.interface';

@Component({
  selector: 'app-active-jobs-list',
  templateUrl: './active-jobs-list.component.html'
})
export class ActiveJobsListComponent implements OnInit {
  @Input() selectedJobId: string;
  @Input() deviceFiltersAndSearch: GridBulkActionRequestParams;

  activeJobs: ActiveJob = {
    totalJobs: 2,
    runningJobs: 1,
    pendingJobs: 1,
    jobs: [
      {
        jobName: 'Job 1',
        state: 'running',
        status: 'TASK_EXECUTING',
        lastUpdated: '2021-04-13T10:42:40.8694509+02:00'
      },
      {
        jobName: 'Job 2',
        state: 'pending',
        status: 'TASK_INITIALIZED',
        lastUpdated: '2021-04-13T10:42:40.8695399+02:00'
      }
    ]
  };

  start;

  constructor(
    private meterService: PlcMeterReadScheduleService,
    private codelistService: CodelistRepositoryService,
    private jobsService: JobsService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private toast: ToastNotificationService,
    private dataConcentratorUnitsSelectGridService: DataConcentratorUnitsSelectGridService
  ) {}

  ngOnInit() {}

  onDismiss() {
    this.modal.dismiss();
  }
}
