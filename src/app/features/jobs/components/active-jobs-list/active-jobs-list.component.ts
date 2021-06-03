import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { PlcMeterReadScheduleService } from 'src/app/features/meter-units/common/services/plc-meter-read-scheduler.service';
import { ActiveJob } from '../../interfaces/active-job-progress.interface';
import { ConcentratorService } from '../../../../core/repository/services/concentrator/concentrator.service';
import * as moment from 'moment';

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

  currentTime;

  start;
  loading = false;

  constructor(
    private meterService: PlcMeterReadScheduleService,
    private codeListService: CodelistRepositoryService,
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
      this.currentTime = moment();
      this.activeJobs = res;
      this.activeJobs.jobs = res.jobs.sort((x, y) => {
        return moment(y.lastUpdated).diff(moment(x.lastUpdated));
      });
    });
  }

  onDismiss() {
    this.modal.dismiss();
  }
}
