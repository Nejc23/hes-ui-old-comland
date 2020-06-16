import { Component, ViewChild } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { GridApi, RowNode } from '@ag-grid-community/core';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';

@Component({
  selector: 'app-grid-cell-delete-btn',
  templateUrl: './grid-cell-delete-btn.component.html'
})
export class GridCellDeleteComponent implements ICellRendererAngularComp {
  public params: any;
  messageStarted = this.i18n(`Scheduler job deleted!`);
  messageServerError = this.i18n(`Server error!`);

  constructor(
    private i18n: I18n,
    private modalService: ModalService,
    private toast: ToastNotificationService,
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

  deleteJob(params: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = this.i18n('Delete');
    response = this.service.deleteSchedulerJob(params.node.data.id);
    component.btnConfirmText = operation;
    component.modalTitle = this.i18n('Confirm delete');
    component.modalBody = this.i18n('Do you want to delete scheduler job?');

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        response.subscribe(
          value => {
            console.log(params);
            const gridApi = this.params.api as GridApi;
            gridApi.purgeServerSideCache([]);
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
    return this.i18n('Delete job');
  }
}
