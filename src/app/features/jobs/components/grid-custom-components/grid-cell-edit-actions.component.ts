import { PermissionEnumerator } from './../../../../core/permissions/enumerators/permission-enumerator.model';
import { JobTypeEnumeration } from './../../enums/job-type.enum';
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
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { PermissionService } from 'src/app/core/permissions/services/permission.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-grid-cell-edit-actions',
  templateUrl: './grid-cell-edit-actions.component.html'
})
export class GridCellEditActionsComponent implements ICellRendererAngularComp {
  public params: any;
  messageDeleteStarted = `Scheduler job deleted!`;
  messageStarted = `Scheduled job started!`;
  messageServerError = `Server error!`;

  constructor(
    private modalService: ModalService,
    private toast: ToastNotificationService,
    private service: JobsService,
    private eventService: SchedulerJobsEventEmitterService,
    private codelistService: CodelistRepositoryService,
    private codelistMeterUnitsRepositoryService: CodelistMeterUnitsRepositoryService,
    private permissionService: PermissionService,
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

  runJob(params: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = this.translate.instant('COMMON.EXECUTE');
    response = this.service.executeSchedulerJob(params.node.data.id);
    component.btnConfirmText = operation;
    component.modalTitle = this.translate.instant('COMMON.CONFIRM-OPERATION');
    component.modalBody = this.translate.instant('JOB.SCHEDULER-JOB.EXECUTE');

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

    if (params.data.jobType === JobTypeEnumeration.discovery) {
      this.editDiscoveryJob(params, options);
    } else if (params.data.jobType === JobTypeEnumeration.timeSync) {
      // dc time sync
      this.editDcTimeSyncJob(params, options);
    } else if (params.data.jobType === JobTypeEnumeration.readEvents) {
      // dc read events job
      this.editDcReadEventsJob(params, options);
    } else if (params.data.jobType === JobTypeEnumeration.topology) {
      this.editTopologyJob(params, options);
    } else if (params.data.jobType === JobTypeEnumeration.alarmNotification) {
      this.editAlarmNotificationJob(params, options);
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
      component.setFormEdit(responseList.timeUnits, selectedJobId, responseList.job, JobTypeEnumeration.reading);

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
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(null, selectedJobId, job, JobTypeEnumeration.discovery);

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

  // private editDiscoveryJob(params: any, options: NgbModalOptions) {
  //   const selectedJobId = params.data.id;

  //   this.service.getJob(selectedJobId).subscribe((job) => {
  //     const modalRef = this.modalService.open(SchedulerJobComponent, options);
  //     const component: SchedulerJobComponent = modalRef.componentInstance;
  //     component.title = "Discovery Job";
  //     component.jobType = jobType.discovery;
  //     component.setFormEdit(null, selectedJobId, job);

  //     modalRef.result.then(
  //       (data) => {
  //         // on close (CONFIRM)
  //         this.eventService.eventEmitterRefresh.emit(true);
  //       },
  //       (reason) => {
  //         // on dismiss (CLOSE)
  //       }
  //     );
  //   });
  // }

  private editTopologyJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    this.service.getJob(selectedJobId).subscribe((job) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(null, selectedJobId, job, JobTypeEnumeration.topology);

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
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(null, selectedJobId, job, JobTypeEnumeration.timeSync);

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
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(responseList.timeUnits, selectedJobId, responseList.job, JobTypeEnumeration.readEvents);

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

  private editAlarmNotificationJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    forkJoin({
      protocols: this.codelistMeterUnitsRepositoryService.meterUnitProtocolTypeCodelist(),
      manufacturers: this.codelistMeterUnitsRepositoryService.meterUnitVendorCodelist(0),
      severities: this.codelistMeterUnitsRepositoryService.meterUnitAlarmSeverityTypeCodelist(),
      sources: this.codelistMeterUnitsRepositoryService.meterUnitAlarmSourceTypeCodelist()
    }).subscribe(({ protocols, manufacturers, severities, sources }) => {
      this.service.getNotificationJob(selectedJobId).subscribe((job) => {
        const modalRef = this.modalService.open(SchedulerJobComponent, options);
        const component: SchedulerJobComponent = modalRef.componentInstance;
        component.setFormNotificationJobEdit(protocols, manufacturers, severities, sources, selectedJobId, job);

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
    });
  }

  deleteJob(params: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = this.translate.instant('COMMON.DELETE');
    response = this.service.deleteSchedulerJob(params.node.data.id);
    component.btnConfirmText = operation;
    component.modalTitle = this.translate.instant('COMMON.CONFIRM-DELETE');
    component.modalBody = this.translate.instant('JOB.SCHEDULER-JOB.DELETE');

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
        return this.translate.instant('COMMON.EXECUTE-JOB');
      case 'edit':
        return this.translate.instant('COMMON.EDIT-JOB');
      case 'delete':
        return this.translate.instant('COMMON.DELETE-JOB');
    }
    return '';
  }

  get permissionJobExecute() {
    return PermissionEnumerator.Execute_Scheduled_Job;
  }

  get permissionJobManage() {
    return PermissionEnumerator.Manage_Jobs;
  }

  hasUserAccess(params: any): boolean {
    if (!this.permissionService.hasAccess(PermissionEnumerator.Manage_Jobs)) {
      return false;
    }

    const jobType = params.data.jobType;
    if (jobType === JobTypeEnumeration.reading) {
      return this.permissionService.hasAccess(PermissionEnumerator.Manage_Meters);
    } else if (jobType === JobTypeEnumeration.alarmNotification) {
      return this.permissionService.hasAccess(PermissionEnumerator.Manage_Alarms);
    } else {
      return this.permissionService.hasAccess(PermissionEnumerator.Manage_Concentrators);
    }
  }
}
