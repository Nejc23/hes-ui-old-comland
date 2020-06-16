import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { Observable } from 'rxjs';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { ActiveJobsStaticTextService } from '../../services/active-jobs-static-text.service';

@Component({
  selector: 'app-grid-cell-link',
  templateUrl: './grid-cell-link.component.html'
})
export class GridCellLinkComponent implements ICellRendererAngularComp {
  notAvailableText = this.staticTextService.notAvailableTekst; // N/A
  public params: any;
  stopJobConst = 'stop';
  cancelJobConst = 'cancel';

  constructor(
    private i18n: I18n,
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private staticTextService: ActiveJobsStaticTextService,
    private service: JobsService
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
    return value ? this.i18n('Stop job') : this.i18n('Cancel job');
  }

  execute(operationType: string, id: string) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = this.i18n('Confirm');

    component.btnConfirmText = operation;
    component.modalTitle = this.i18n('Confirm operation');

    switch (operationType) {
      case this.cancelJobConst:
        response = this.service.cancelJob(this.params.node.data.id, null);
        component.modalBody = this.i18n('Do you want to cancel scheduled job now?');
        break;
      case this.stopJobConst:
        response = this.service.stopJob(this.params.node.data.id, null);
        component.modalBody = this.i18n('Do you want to stop running job now?');
    }

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        response.subscribe(
          value => {
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
          e => {
            this.toast.errorToast(this.staticTextService.messageServerError);
          }
        );
      },
      reason => {
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
