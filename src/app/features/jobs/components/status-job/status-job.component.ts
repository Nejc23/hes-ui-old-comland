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
import { StatusJobProgressInterface } from '../../interfaces/status-job-progress.interface';

@Component({
  selector: 'app-status-job',
  templateUrl: './status-job.component.html'
})
export class StatusJobComponent implements OnInit {
  @Input() selectedJobId: string;
  @Input() deviceFiltersAndSearch: GridBulkActionRequestParams;

  statusJobProgress: StatusJobProgressInterface = {
    deviceCount: 4,
    successCount: 1,
    failCount: 1,
    progress: 50.0
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
