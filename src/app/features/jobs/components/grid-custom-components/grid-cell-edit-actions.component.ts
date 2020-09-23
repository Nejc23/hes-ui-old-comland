import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { I18n } from '@ngx-translate/i18n-polyfill';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { GridApi } from '@ag-grid-community/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SchedulerJobComponent } from '../scheduler-job/scheduler-job.component';
import { SchedulerJobsEventEmitterService } from '../../services/scheduler-jobs-event-emitter.service';
import { SchedulerDiscoveryJobComponent } from '../scheduler-discovery-job/scheduler-discovery-job.component';

@Component({
  selector: 'app-grid-cell-edit-actions',
  templateUrl: './grid-cell-edit-actions.component.html'
})
export class GridCellEditActionsComponent implements ICellRendererAngularComp {
  public params: any;
  messageDeleteStarted = this.i18n(`Scheduler job deleted!`);
  messageDeleteServerError = this.i18n(`Server error!`);

  constructor(
    private i18n: I18n,
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private service: JobsService,
    private eventService: SchedulerJobsEventEmitterService,
    private cdRef: ChangeDetectorRef
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

  editJob(params: any) {
    const options: NgbModalOptions = {
      size: 'xl'
    };
    if (params.data.actionType === 1) {
      this.editDiscoveryJob(params, options);
    } else {
      this.editReadingJob(params, options);
    }
  }

  private editReadingJob(params: any, options: NgbModalOptions) {
    const modalRef = this.modalService.open(SchedulerJobComponent, options);
    const component: SchedulerJobComponent = modalRef.componentInstance;
    component.selectedJobId = params.data.id;

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        this.eventService.eventEmitterRefresh.emit(true);
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }

  private editDiscoveryJob(params: any, options: NgbModalOptions) {
    const modalRef = this.modalService.open(SchedulerDiscoveryJobComponent, options);
    const component: SchedulerDiscoveryJobComponent = modalRef.componentInstance;
    component.selectedJobId = params.data.id;

    modalRef.result.then(
      data => {
        // on close (CONFIRM)
        this.eventService.eventEmitterRefresh.emit(true);
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
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
            const gridApi = this.params.api as GridApi;
            gridApi.purgeServerSideCache([]);
            this.toast.successToast(this.messageDeleteStarted);
          },
          e => {
            this.toast.errorToast(this.messageDeleteServerError);
          }
        );
      },
      reason => {
        // on dismiss (CLOSE)
      }
    );
  }

  // set tooltip text
  setToolTip(type: string) {
    switch (type) {
      case 'edit':
        return this.i18n('Edit job');
      case 'delete':
        return this.i18n('Delete job');
    }
    return '';
  }
}