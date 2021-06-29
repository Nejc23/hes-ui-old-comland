import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { Observable } from 'rxjs';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { ActiveJobsStaticTextService } from '../../services/active-jobs-static-text.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-grid-cell-link',
  templateUrl: './grid-cell-link.component.html'
})
export class GridCellLinkComponent implements ICellRendererAngularComp {
  notAvailableText = this.staticTextService.notAvailableTekst;
  public params: any;
  stopJobConst = 'stop';
  cancelJobConst = 'cancel';

  constructor(
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private staticTextService: ActiveJobsStaticTextService,
    private service: JobsService,
    private translate: TranslateService
  ) {}
  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  setToolTip(value: boolean) {
    return value ? this.translate.instant('COMMON.STOP-JOB') : this.translate.instant('COMMON.CANCEL-JOB');
  }

  execute(operationType: string, id: string) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = this.translate.instant('COMMON.CONFIRM');

    component.btnConfirmText = operation;
    component.modalTitle = this.translate.instant('COMMON.CONFIRM-OPERATION');

    switch (operationType) {
      case this.cancelJobConst:
        response = this.service.cancelJob(this.params.node.data.id, null);
        component.modalBody = this.translate.instant('JOB.SCHEDULER-JOB.CANCEL');
        break;
      case this.stopJobConst:
        response = this.service.stopJob(this.params.node.data.id, null);
        component.modalBody = this.translate.instant('JOB.SCHEDULER-JOB.STOP');
    }

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        response.subscribe(
          (value) => {
            let toastString = '';
            switch (operationType) {
              case this.cancelJobConst:
                toastString = this.staticTextService.messageJobCanceled;
                break;
              case this.stopJobConst:
                toastString = this.staticTextService.messageJobStopped;
            }
            this.toast.successToast(toastString);
          },
          (e) => {
            this.toast.errorToast(this.staticTextService.messageServerError);
          }
        );
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  cancelJob(id: string) {
    this.execute(this.cancelJobConst, id);
  }

  stopJob(id: string) {
    this.execute(this.stopJobConst, id);
  }
}
