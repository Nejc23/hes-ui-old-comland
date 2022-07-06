import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable } from 'rxjs';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { userSettingNotificationJobDefaultAddress } from 'src/app/core/repository/consts/settings-store.const';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { SettingsService } from 'src/app/core/repository/services/settings/settings.service';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { SchedulerJobComponent } from 'src/app/features/jobs/components/scheduler-job/scheduler-job.component';
import { JobTypeEnumeration } from 'src/app/features/jobs/enums/job-type.enum';
import { SchedulerJobsEventEmitterService } from 'src/app/features/jobs/services/scheduler-jobs-event-emitter.service';
import { GridColumn, GridColumnType, GridRowAction } from '../../data-table/data-table.component';
import { ModalConfirmComponent } from '../../modals/components/modal-confirm.component';

@Component({
  selector: 'app-active-job-card-item',
  templateUrl: './active-job-card-item.component.html',
  styleUrls: ['./active-job-card-item.component.scss']
})
export class ActiveJobCardItemComponent implements OnInit {
  @Input() deviceId: string;

  activeJobs: any = [];
  jobsLoading = false;
  activeJobsRowActionsConfiguration: Array<GridRowAction> = [
    {
      actionName: 'settings',
      iconName: 'settings-icon'
    },
    {
      actionName: 'runJob',
      iconName: 'play-icon'
    },
    {
      actionName: 'removeFromJob',
      iconName: 'delete-icon'
    }
  ];
  activeJobsColumnsConfiguration: Array<GridColumn> = [
    {
      field: 'description',
      translationKey: 'FORM.NAME',
      width: 120
    },
    {
      field: 'type',
      translationKey: 'FORM.TYPE',
      width: 145
    },
    {
      field: 'nextRun',
      translationKey: 'FORM.NEXT-START',
      type: GridColumnType.DATE_TIME,
      width: 120
    }
  ];

  constructor(
    private router: Router,
    private activeJobsService: JobsService,
    private modalService: ModalService,
    private translate: TranslateService,
    private toast: ToastNotificationService,
    private codelistService: CodelistRepositoryService,
    private settingsService: SettingsService,
    private schedulerJobsEventService: SchedulerJobsEventEmitterService,
    private codelistMeterUnitsRepositoryService: CodelistMeterUnitsRepositoryService
  ) {}

  ngOnInit(): void {
    this.getActiveJobs();
  }

  getActiveJobs() {
    this.jobsLoading = true;
    this.activeJobsService.getSchedulerActiveJobsList(this.deviceId).subscribe((res) => {
      this.jobsLoading = false;
      this.activeJobs = res;
    });
  }

  goToJobs() {
    this.router.navigate(['/schedulerJobs']);
  }

  rowActionsClicked(event: any) {
    if (event.actionName === 'runJob') {
      this.runJob(event.id);
    } else if (event.actionName === 'settings') {
      this.editJob(event.rowData);
    } else if (event.actionName === 'removeFromJob') {
      this.removeDeviceFromSchedule(event.rowData);
    }
  }

  runJob(id: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = this.translate.instant('COMMON.EXECUTE');
    response = this.activeJobsService.executeSchedulerJob(id);

    component.btnConfirmText = operation;
    component.modalTitle = this.translate.instant('COMMON.CONFIRM-OPERATION');
    component.modalBody = this.translate.instant('JOB.SCHEDULER-JOB.EXECUTE');

    modalRef.result.then(
      () => {
        // on close (CONFIRM)
        response.subscribe(
          () => {
            this.toast.successToast(this.translate.instant('JOB.SCHEDULER-JOB-STARTED'));
            this.getActiveJobs();
          },
          () => {
            this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
          }
        );
      },
      () => {
        // on dismiss (CLOSE)
      }
    );
  }

  editJob(data: any) {
    const params = {
      data: data
    };
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

  removeDeviceFromSchedule(jobRowData: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;

    let response: Observable<any> = new Observable();
    response = this.activeJobsService.removeDeviceFromSchedulerJob(jobRowData.id, this.deviceId);

    component.btnConfirmText = this.translate.instant('BUTTON.REMOVE');
    component.modalTitle = this.translate.instant('COMMON.CONFIRM-OPERATION');
    component.modalBody = this.translate.instant('JOB.SCHEDULER-JOB.REMOVE', { jobName: jobRowData.description });

    modalRef.result.then(
      () => {
        // on close (CONFIRM)
        response.subscribe(
          () => {
            this.toast.successToast(this.translate.instant('JOB.SCHEDULER-JOB-REMOVED'));
            this.getActiveJobs();
          },
          () => {
            this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
          }
        );
      },
      () => {
        // on dismiss (CLOSE)
      }
    );
  }

  private editReadingJob(data: any, options: NgbModalOptions) {
    const params = {
      data: data
    };

    const selectedJobId = params.data.data.id;

    const timeUnits$ = this.codelistService.timeUnitCodeslist();
    const job$ = this.activeJobsService.getJob(selectedJobId);

    forkJoin({ timeUnits: timeUnits$, job: job$ }).subscribe((responseList) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(responseList.timeUnits, selectedJobId, responseList.job, JobTypeEnumeration.reading);

      modalRef.result.then(
        () => {
          // on close (CONFIRM)
          this.getActiveJobs();
          this.schedulerJobsEventService.eventEmitterRefresh.emit(true);
        },
        () => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  private editDiscoveryJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    this.activeJobsService.getJob(selectedJobId).subscribe((job) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(null, selectedJobId, job, JobTypeEnumeration.discovery);

      modalRef.result.then(
        () => {
          // on close (CONFIRM)
          this.schedulerJobsEventService.eventEmitterRefresh.emit(true);
          this.getActiveJobs();
        },
        () => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  private editTopologyJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    this.activeJobsService.getJob(selectedJobId).subscribe((job) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(null, selectedJobId, job, JobTypeEnumeration.topology);

      modalRef.result.then(
        () => {
          // on close (CONFIRM)
          this.schedulerJobsEventService.eventEmitterRefresh.emit(true);
          this.getActiveJobs();
        },
        () => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  private editDcTimeSyncJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    this.activeJobsService.getJob(selectedJobId).subscribe((job) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(null, selectedJobId, job, JobTypeEnumeration.timeSync);

      modalRef.result.then(
        () => {
          // on close (CONFIRM)
          this.schedulerJobsEventService.eventEmitterRefresh.emit(true);
          this.getActiveJobs();
        },
        () => {
          // on dismiss (CLOSE)
        }
      );
    });
  }

  private editDcReadEventsJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.data.id;

    const timeUnits$ = this.codelistService.timeUnitCodeslist();
    const job$ = this.activeJobsService.getJob(selectedJobId);

    forkJoin({ timeUnits: timeUnits$, job: job$ }).subscribe((responseList) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(responseList.timeUnits, selectedJobId, responseList.job, JobTypeEnumeration.readEvents);

      modalRef.result.then(
        () => {
          // on close (CONFIRM)
          this.schedulerJobsEventService.eventEmitterRefresh.emit(true);
          this.getActiveJobs();
        },
        () => {
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
      sources: this.codelistMeterUnitsRepositoryService.meterUnitAlarmSourceTypeCodelist(),
      notificationTypes: this.codelistMeterUnitsRepositoryService.meterUnitAlarmNotificationTypeCodelist(),
      defaultJobAddress: this.settingsService.getSetting(userSettingNotificationJobDefaultAddress)
    }).subscribe(({ protocols, manufacturers, severities, sources, notificationTypes, defaultJobAddress }) => {
      this.activeJobsService.getNotificationJob(selectedJobId).subscribe((job) => {
        const modalRef = this.modalService.open(SchedulerJobComponent, options);
        const component: SchedulerJobComponent = modalRef.componentInstance;
        component.setFormNotificationJobEdit(
          protocols,
          manufacturers,
          severities,
          sources,
          selectedJobId,
          job,
          notificationTypes,
          defaultJobAddress
        );

        modalRef.result.then(
          () => {
            // on close (CONFIRM)
            this.schedulerJobsEventService.eventEmitterRefresh.emit(true);
            this.getActiveJobs();
          },
          () => {
            // on dismiss (CLOSE)
          }
        );
      });
    });
  }
}
