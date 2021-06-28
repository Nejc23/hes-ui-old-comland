import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusJobProgress } from '../../interfaces/status-job-progress.interface';
import { ToastNotificationService } from '../../../../core/toast-notification/services/toast-notification.service';
import { ConcentratorService } from '../../../../core/repository/services/concentrator/concentrator.service';
import { CdTimerComponent } from 'angular-cd-timer';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-status-job',
  templateUrl: './status-job.component.html'
})
export class StatusJobComponent implements OnInit, OnDestroy {
  @ViewChild('basicTimer', { static: false }) cdTimer: CdTimerComponent;

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

  constructor(
    private modal: NgbActiveModal,
    private concentratorService: ConcentratorService,
    private toast: ToastNotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    if (this.requestId) {
      this.getProgress();

      this.interval = setInterval(() => {
        if (this.statusJobProgress.progress < 100) {
          this.getProgress();
        } else {
          this.clearInt();
        }
      }, this.intervalSeconds * 1000);
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
          this.statusJobProgress.progress += 10;
        }
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
    } else return 'progress-bar-striped progress-bar-animated';
  }

  clearInt() {
    this.finished = true;
    this.cdTimer.stop();
    clearInterval(this.interval);
    this.interval = null;
  }
}
