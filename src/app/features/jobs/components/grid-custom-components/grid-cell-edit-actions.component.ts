import { jobActionType } from './../../enums/job-action-type.enum';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { Observable, forkJoin } from 'rxjs';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { GridApi } from '@ag-grid-community/core';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SchedulerJobComponent } from '../scheduler-job/scheduler-job.component';
import { SchedulerJobsEventEmitterService } from '../../services/scheduler-jobs-event-emitter.service';
import { SchedulerDiscoveryJobComponent } from '../scheduler-discovery-job/scheduler-discovery-job.component';
import { SchedulerDcTimeSyncJobComponent } from '../dc-time-sync/scheduler-dc-time-sync-job.component';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { SchedulerDcReadEventsJobComponent } from '../dc-read-events/scheduler-dc-read-events-job.component';
import { SchedulerTopologyJobComponent } from '../scheduler-topology-job/scheduler-topology-job.component';

@Component({
  selector: 'app-grid-cell-edit-actions',
  templateUrl: './grid-cell-edit-actions.component.html'
})
export class GridCellEditActionsComponent implements ICellRendererAngularComp {
  public params: any;
  messageDeleteStarted = $localize`Scheduler job deleted!`;
  messageStarted = $localize`Scheduled job started!`;
  messageServerError = $localize`Server error!`;

  constructor(
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private service: JobsService,
    private eventService: SchedulerJobsEventEmitterService,
    private codelistService: CodelistRepositoryService
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
    const operation = $localize`Execute`;
    response = this.service.executeSchedulerJob(params.node.data.id);
    component.btnConfirmText = operation;
    component.modalTitle = $localize`Confirm operation`;
    component.modalBody = $localize`Do you want to execute scheduler job now`;

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        response.subscribe(
          (value) => {
            this.toast.successToast(this.messageStarted);
          },
          (e) => {
            this.toast.errorToast(this.messageServerError);
          }
        );
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  editJob(params: any) {
    const options: NgbModalOptions = {
      size: 'xl'
    };
    if (params.data.actionType === jobActionType.discovery) {
      this.editDiscoveryJob(params, options);
    } else if (params.data.actionType === jobActionType.timeSync) {
      // dc time sync
      this.editDcTimeSyncJob(params, options);
    } else if (params.data.actionType === jobActionType.readEvents) {
      // dc read events job
      this.editDcReadEventsJob(params, options);
    } else if (params.data.actionType === jobActionType.topology) {
      this.editTopologyJob(params, options);
    } else {
      this.editReadingJob(params, options);
    }
  }

  private editReadingJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    const timeUnits$ = this.codelistService.timeUnitCodeslist();
    const job$ = this.service.getJob(selectedJobId);

    forkJoin({ timeUnits: timeUnits$, job: job$ }).subscribe((responseList) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(responseList.timeUnits, selectedJobId, responseList.job);

      modalRef.result.then(
        (data) => {
          // on close (CONFIRM)
          this.eventService.eventEmitterRefresh.emit(true);
        },
        (reason) => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  private editDiscoveryJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    this.service.getJob(selectedJobId).subscribe((job) => {
      const modalRef = this.modalService.open(SchedulerDiscoveryJobComponent, options);
      const component: SchedulerDiscoveryJobComponent = modalRef.componentInstance;
      component.setFormEdit(selectedJobId, job);

      modalRef.result.then(
        (data) => {
          // on close (CONFIRM)
          this.eventService.eventEmitterRefresh.emit(true);
        },
        (reason) => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  private editTopologyJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    this.service.getJob(selectedJobId).subscribe((job) => {
      const modalRef = this.modalService.open(SchedulerTopologyJobComponent, options);
      const component: SchedulerTopologyJobComponent = modalRef.componentInstance;
      component.setFormEdit(selectedJobId, job);

      modalRef.result.then(
        (data) => {
          // on close (CONFIRM)
          this.eventService.eventEmitterRefresh.emit(true);
        },
        (reason) => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  private editDcTimeSyncJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    this.service.getJob(selectedJobId).subscribe((job) => {
      const modalRef = this.modalService.open(SchedulerDcTimeSyncJobComponent, options);
      const component: SchedulerDcTimeSyncJobComponent = modalRef.componentInstance;
      component.setFormEdit(selectedJobId, job);

      modalRef.result.then(
        (data) => {
          // on close (CONFIRM)
          this.eventService.eventEmitterRefresh.emit(true);
        },
        (reason) => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  private editDcReadEventsJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    const timeUnits$ = this.codelistService.timeUnitCodeslist();
    const job$ = this.service.getJob(selectedJobId);

    forkJoin({ timeUnits: timeUnits$, job: job$ }).subscribe((responseList) => {
      const modalRef = this.modalService.open(SchedulerDcReadEventsJobComponent, options);
      const component: SchedulerDcReadEventsJobComponent = modalRef.componentInstance;
      component.setFormEdit(responseList.timeUnits, selectedJobId, responseList.job);

      modalRef.result.then(
        (data) => {
          // on close (CONFIRM)
          this.eventService.eventEmitterRefresh.emit(true);
        },
        (reason) => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  deleteJob(params: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = $localize`Delete`;
    response = this.service.deleteSchedulerJob(params.node.data.id);
    component.btnConfirmText = operation;
    component.modalTitle = $localize`Confirm delete`;
    component.modalBody = $localize`Do you want to delete scheduler job?`;

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        response.subscribe(
          (value) => {
            const gridApi = this.params.api as GridApi;
            gridApi.purgeServerSideCache([]);
            this.toast.successToast(this.messageDeleteStarted);
          },
          (e) => {
            this.toast.errorToast(this.messageServerError);
          }
        );
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  // set tooltip text
  setToolTip(type: string) {
    switch (type) {
      case 'run':
        return $localize`Execute job`;
      case 'edit':
        return $localize`Edit job`;
      case 'delete':
        return $localize`Delete job`;
    }
    return '';
  }
}
