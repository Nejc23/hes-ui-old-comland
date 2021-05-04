import { NotificationFilter, ReadingProperties } from './../../../../core/repository/interfaces/jobs/scheduler-job.interface';
import { DataConcentratorUnitsSelectComponent } from './../../../data-concentrator-units-select/component/data-concentrator-units-select.component';
import { JobTypeEnumeration } from './../../enums/job-type.enum';
import { ToastNotificationService } from './../../../../core/toast-notification/services/toast-notification.service';
import { CronScheduleComponent } from './../../cron-schedule/components/cron-schedule.component';
import { Component, OnInit, ViewChild, Input, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { PlcMeterReadScheduleService } from 'src/app/features/meter-units/common/services/plc-meter-read-scheduler.service';
import { ActiveJob } from '../../interfaces/active-job-progress.interface';
import { ConcentratorService } from '../../../../core/repository/services/concentrator/concentrator.service';

@Component({
  selector: 'app-active-jobs-list',
  templateUrl: './active-jobs-list.component.html'
})
export class ActiveJobsListComponent implements OnInit {
  @Input() deviceId: string;

  activeJobs: ActiveJob = {
    totalJobs: 0,
    runningJobs: 0,
    pendingJobs: 0,
    jobs: []
  };

  start;
  loading = false;

  constructor(
    private meterService: PlcMeterReadScheduleService,
    private codelistService: CodelistRepositoryService,
    private jobsService: JobsService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private concentratorService: ConcentratorService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.concentratorService.getActiveJobs(this.deviceId).subscribe((res) => {
      this.loading = false;
      this.activeJobs = res;
    });
  }

  onDismiss() {
    this.modal.dismiss();
  }
}
