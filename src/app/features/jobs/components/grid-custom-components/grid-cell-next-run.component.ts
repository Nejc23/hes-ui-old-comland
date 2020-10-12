import { Component, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { JobsStaticTextService } from '../../services/jobs-static-text.service';

@Component({
  selector: 'app-grid-cell-next-run',
  templateUrl: './grid-cell-next-run.component.html'
})
export class GridCellNextRunComponent implements ICellRendererAngularComp {
  public params: any;
  messageStarted = $localize `Scheduled job started!`;
  messageServerError = $localize `Server error!`;

  constructor(
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private service: JobsService,
    private staticextService: JobsStaticTextService
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

  runJob(params: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = $localize `Execute`;
    response = this.service.executeSchedulerJob(params.node.data.id);
    component.btnConfirmText = operation;
    component.modalTitle = $localize `Confirm operation`;
    component.modalBody = $localize `Do you want to execute scheduler job now`;

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        response.subscribe(
          value => {
            this.toast.successToast(this.messageStarted);
          },
          e => {
            this.toast.errorToast(this.messageServerError);
          }
        );
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }

  // set tooltip text
  setToolTip() {
    return $localize `Execute job`;
  }

  setNextReadText(time: string) {
    return $localize `${time ? moment(time).fromNow() : this.staticextService.notAvailableTekst}`;
  }
}
