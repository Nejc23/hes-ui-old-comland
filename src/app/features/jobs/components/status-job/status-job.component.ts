import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ConcentratorService } from '../../../../core/repository/services/concentrator/concentrator.service';
import { ToastNotificationService } from '../../../../core/toast-notification/services/toast-notification.service';
import { StatusJobProgress } from '../../interfaces/status-job-progress.interface';
import * as moment from 'moment';

@Component({
  selector: 'app-status-job',
  templateUrl: './status-job.component.html'
})
export class StatusJobComponent implements OnInit, OnDestroy {
  @Input() requestId: string = '';
  @Input() jobName: string = '';
  @Input() deviceCount = 0;

  interval = null;
  intervalSeconds = 5;
  loading = true;
  finished = false;

  statusJobProgress: StatusJobProgress = {
    deviceCount: 0,
    successCount: 0,
    failCount: 0,
    progress: 10
  };

  startDate: Date = new Date();
  currentDate: Date = new Date();

  constructor(
    private modal: NgbActiveModal,
    private concentratorService: ConcentratorService,
    private toast: ToastNotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    if (this.requestId) {
      this.getProgress();
    }
  }

  onDismiss() {
    this.modal.dismiss();
  }

  getProgress() {
    this.concentratorService.getJobProgress(this.requestId).subscribe(
      (res) => {
        this.loading = false;
        this.statusJobProgress = res;
        if (this.statusJobProgress.progress == 0) {
          this.statusJobProgress.progress += 1;
        }

        this.interval = setTimeout(() => {
          if (this.statusJobProgress.deviceCount <= this.deviceCount) {
            if (this.statusJobProgress.progress < 100) {
              this.getProgress();
            } else {
              this.clearInt();
            }
          }
        }, this.intervalSeconds * 1000);
      },
      (error) => {
        console.log('error: ' + error);
        const resultErrMessage = error.error ? error.error : null;
        const errMessage = this.translate.instant('JOB.STATUS-JOB.ERROR') + ' ' + resultErrMessage;
        this.toast.errorToast(errMessage);
        this.loading = false;
        this.clearInt();
      }
    );
  }

  ngOnDestroy() {
    this.clearInt();
  }

  withError() {
    if (this.statusJobProgress?.failCount > 0) {
      return 'red';
    } else {
      return 'progress-bar-striped progress-bar-animated';
    }
  }

  clearInt() {
    this.finished = true;
    clearTimeout(this.interval);
    this.getTimeTiff(true);
    this.interval = null;
  }

  getTimeTiff(finished = false) {
    if (!this.finished) {
      this.currentDate = new Date();
    }
    const diffTime = moment(this.currentDate).diff(this.startDate);
    const duration = moment.duration(diffTime);

    return duration.days() + 'd' + ' ' + duration.hours() + 'h' + ' ' + duration.minutes() + 'm' + ' ' + duration.seconds() + 's';
  }
}
