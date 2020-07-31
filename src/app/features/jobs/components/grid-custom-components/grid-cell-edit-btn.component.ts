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
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SchedulerJobComponent } from '../scheduler-job/scheduler-job.component';
import { SchedulerJobsEventEmitterService } from '../../services/scheduler-jobs-event-emitter.service';
import { SchedulerDiscoveryJobComponent } from '../scheduler-discovery-job/scheduler-discovery-job.component';

@Component({
  selector: 'app-grid-cell-edit-btn',
  templateUrl: './grid-cell-edit-btn.component.html'
})
export class GridCellEditComponent implements ICellRendererAngularComp {
  public params: any;

  constructor(
    private i18n: I18n,
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private service: MeterUnitsService,
    private eventService: SchedulerJobsEventEmitterService
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
    console.log(params);
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
    console.log(params);
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

  // set tooltip text
  setToolTip() {
    return this.i18n('Edit job');
  }
}
