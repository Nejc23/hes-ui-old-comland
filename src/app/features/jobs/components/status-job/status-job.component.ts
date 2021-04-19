import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusJobProgress } from '../../interfaces/status-job-progress.interface';
import { ToastNotificationService } from '../../../../core/toast-notification/services/toast-notification.service';
import { ConcentratorService } from '../../../../core/repository/services/concentrator/concentrator.service';

@Component({
  selector: 'app-status-job',
  templateUrl: './status-job.component.html'
})
export class StatusJobComponent implements OnInit, OnDestroy {
  @Input() requestId: string = '';
  @Input() jobName: string = '';
  interval = null;
  intervalSeconds = 5;

  statusJobProgress: StatusJobProgress = {
    deviceCount: 0,
    successCount: 0,
    failCount: 0,
    progress: 0
  };

  constructor(private modal: NgbActiveModal, private concentratorService: ConcentratorService, private toast: ToastNotificationService) {}

  ngOnInit() {
    if (this.requestId) {
      this.getProgress();

      this.interval = setInterval(() => {
        this.getProgress();
      }, this.intervalSeconds * 1000);
    }
  }

  onDismiss() {
    this.modal.dismiss();
  }

  getProgress() {
    this.concentratorService.getJobProgress(this.requestId).subscribe(
      (res) => {
        this.statusJobProgress = res;
      },
      (error) => {
        console.log('error: ' + error);
        const resultErrMessage = error.error ? error.error : null;
        const errMessage = $localize`Error getting status job ` + ` ` + resultErrMessage;
        this.toast.errorToast(errMessage);
      }
    );
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.interval = null;
  }
}
