import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StatusJobProgress } from '../../interfaces/status-job-progress.interface';
import { ConcentratorManagementService } from '../../../../core/repository/services/concentrator-managment/concentrator-management.service';
import { ToastNotificationService } from '../../../../core/toast-notification/services/toast-notification.service';

@Component({
  selector: 'app-status-job',
  templateUrl: './status-job.component.html'
})
export class StatusJobComponent implements OnInit, OnDestroy {
  @Input() requestId: string = '';
  @Input() jobName: string = '';
  statusJobProgress: StatusJobProgress;

  timeout = null;

  constructor(
    private modal: NgbActiveModal,
    private concentratorManagementService: ConcentratorManagementService,
    private toast: ToastNotificationService
  ) {}

  ngOnInit() {
    if (this.requestId) {
      this.getProgress();

      this.timeout = setTimeout(() => {
        this.getProgress();
      }, 5000);
    }
  }

  onDismiss() {
    this.modal.dismiss();
  }

  getProgress() {
    this.concentratorManagementService.getJobProgress(this.requestId).subscribe(
      (res) => {
        console.log(res);
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
    clearTimeout(this.timeout);
  }
}
