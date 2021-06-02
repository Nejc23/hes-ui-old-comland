import { Component, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Observable } from 'rxjs';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';

@Component({
  selector: 'app-grid-cell-active',
  templateUrl: './grid-cell-active.component.html'
})
export class GridCellActiveComponent implements ICellRendererAngularComp {
  @ViewChild('activeSwitch', { static: true }) activeSwitch;

  public params: any;
  messageEnabled = `Scheduler job enabled!`;
  messageDisabled = `Scheduler job disabled!`;
  messageServerError = `Server error!`;

  constructor(private modalService: ModalService, private toast: ToastNotificationService, private service: JobsService) {}
  // called on init
  agInit(params: any): void {
    this.params = params;
  }

  // called when the cell is refreshed
  refresh(params: any): boolean {
    this.params = params;
    return true;
  }

  valueChange(params: any, event: boolean) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = event ? `Enable` : `Disable`;
    response = event ? this.service.enableSchedulerJob(params.node.data.id) : this.service.disableSchedulerJob(params.node.data.id);
    component.btnConfirmText = operation;
    component.modalTitle = `Confirm operation`;
    component.modalBody = `Do you want to change scheduler job status`;

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        response.subscribe(
          (value) => {
            this.toast.successToast(event ? this.messageEnabled : this.messageDisabled);
          },
          (e) => {
            this.toast.errorToast(this.messageServerError);
          }
        );
      },
      (reason) => {
        // on dismiss (CLOSE)
        this.activeSwitch.checked = !event;
      }
    );
  }

  // set tooltip text
  setToolTip(value: boolean) {
    return value ? `Active` : `Inactive`;
  }
}
