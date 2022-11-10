import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { userSettingNotificationJobDefaultAddress } from 'src/app/core/repository/consts/settings-store.const';
import { GridRequestParams, GridSortParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { SettingsStoreEmitterService } from 'src/app/core/repository/services/settings-store/settings-store-emitter.service';
import { SettingsStoreService } from 'src/app/core/repository/services/settings-store/settings-store.service';
import { SettingsService } from 'src/app/core/repository/services/settings/settings.service';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { enumSearchFilterOperators } from 'src/environments/config';
import { PermissionEnumerator } from '../../../../core/permissions/enumerators/permission-enumerator.model';
import { PermissionService } from '../../../../core/permissions/services/permission.service';
import { ToastNotificationService } from '../../../../core/toast-notification/services/toast-notification.service';
import { SidebarToggleService } from '../../../../shared/base-template/components/services/sidebar.service';
import { GridColumn, GridRowAction, PageChangedEvent } from '../../../../shared/data-table/data-table.component';
import { ModalConfirmComponent } from '../../../../shared/modals/components/modal-confirm.component';
import { Codelist } from '../../../../shared/repository/interfaces/codelists/codelist.interface';
import { JobTypeEnumeration } from '../../enums/job-type.enum';
import { SchedulerJobsListGridLayoutStore } from '../../interfaces/scheduler-jobs-list-grid-layout-store.interface';
import { JobsStaticTextService } from '../../services/jobs-static-text.service';
import { SchedulerJobsEventEmitterService } from '../../services/scheduler-jobs-event-emitter.service';
import { SchedulerJobsListGridService } from '../../services/scheduler-jobs-list-grid.service';
import { SchedulerJobComponent } from '../scheduler-job/scheduler-job.component';

@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html'
})
export class JobsListComponent implements OnInit, OnDestroy {
  selectedId = 1;
  headerTitle = this.staticTextService.jobsTitle;
  // N/A
  notAvailableText = this.staticTextService.notAvailableTekst;
  overlayNoRowsTemplate = this.staticTextService.noRecordsFound;
  overlayLoadingTemplate = this.staticTextService.loadingData;
  noData = false;

  // new grid
  jobColumns: Array<GridColumn>;
  gridData: Array<SchedulerJobsList>;
  rowActions: Array<GridRowAction>;
  sort: SortDescriptor[];
  pageNumber = 1;
  totalCount = 0;
  pageSize = 20;
  loading = false;
  searchText = '';
  messageEnabled = this.translate.instant('JOB.SCHEDULER-JOB-ENABLED');
  messageDisabled = this.translate.instant('JOB.SCHEDULER-JOB-DISABLED');
  messageServerError = this.translate.instant('COMMON.SERVER-ERROR');

  jobListRowActionsConfiguration: Array<GridRowAction> = [
    {
      actionName: 'execute',
      iconName: 'play-icon'
    },
    {
      actionName: 'edit',
      iconName: 'edit-icon'
    },
    {
      actionName: 'delete',
      iconName: 'delete-icon'
    }
  ];

  requestModel: GridRequestParams = {
    requestId: null,
    startRow: 0,
    endRow: 0,
    sortModel: [
      {
        colId: 'description',
        sort: 'asc'
      }
    ],
    searchModel: []
  };

  schedulerJobsListGridLayoutStoreKey = 'scheduler-jobs-list-grid-layout';
  schedulerJobsListGridLayoutStore: SchedulerJobsListGridLayoutStore;
  pageSizes: Codelist<number>[] = [
    { id: 20, value: '20' },
    { id: 50, value: '50' },
    { id: 100, value: '100' }
  ];
  form: FormGroup;
  datasource: any;
  isGridLoaded = false;
  areSettingsLoaded = false;
  gridColumnApi;
  useWildcards = false;
  private refreshSubscription: Subscription;

  constructor(
    private schedulerJobsService: JobsService,
    private schedulerJobsListGridService: SchedulerJobsListGridService,
    public fb: FormBuilder,
    public staticTextService: JobsStaticTextService,
    private eventService: SchedulerJobsEventEmitterService,
    private modalService: ModalService,
    private authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    private sidebarToggleService: SidebarToggleService,
    private codelistService: CodelistRepositoryService,
    private settingsStoreService: SettingsStoreService,
    private settingsStoreEmitterService: SettingsStoreEmitterService,
    private codelistMeterUnitsRepositoryService: CodelistMeterUnitsRepositoryService,
    private permissionService: PermissionService,
    private translate: TranslateService,
    private elRef: ElementRef,
    private toast: ToastNotificationService,
    private settingsService: SettingsService,
    private router: Router
  ) {
    this.refreshSubscription = this.eventService.eventEmitterRefresh.subscribe({
      next: (event: boolean) => {
        if (event) {
          setTimeout(() => {
            this.getData();
          }, 500);
        }
      }
    });
  }

  get permissionJobsManage() {
    return PermissionEnumerator.Manage_Jobs;
  }

  get permissionMetersManage() {
    return PermissionEnumerator.Manage_Meters;
  }

  get permissionConcentratorsManage() {
    return PermissionEnumerator.Manage_Concentrators;
  }

  get permissionAlarmsManage() {
    return PermissionEnumerator.Manage_Alarms;
  }

  get permissionJobExecute() {
    return PermissionEnumerator.Execute_Scheduled_Job;
  }

  get permissionJobManage() {
    return PermissionEnumerator.Manage_Jobs;
  }

  ngOnInit() {
    this.jobColumns = this.schedulerJobsListGridService.columns;
    this.rowActions = this.schedulerJobsListGridService.rowActions;
    this.sort = this.schedulerJobsListGridService.sort;
    this.breadcrumbService.setPageName('');
    this.getSchedulerJobsListGridLayoutStore();
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  searchData($event: string) {
    if (this.areSettingsLoaded) {
      if ($event !== this.schedulerJobsListGridService.getSessionSettingsSearchedText()) {
        this.pageNumber = 1;
        this.schedulerJobsListGridService.setSessionSettingsSearchedText($event);
        this.searchText = $event;
        this.useWildcards = this.schedulerJobsListGridService.getSessionSettingsSearchedWildcards();
        this.schedulerJobsListGridService.setSessionSettingsPageIndex(0);
        this.getData();
        this.saveSettingsStore();
      }
    }
  }

  addJob() {
    const options: NgbModalOptions = {
      size: 'xl'
    };

    const modalRef = this.modalService.open(SchedulerJobComponent, options);

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        this.getData();
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  getSchedulerJobsListGridLayoutStore() {
    this.settingsStoreService.getCurrentUserSettings(this.schedulerJobsListGridLayoutStoreKey).subscribe(
      (settings) => {
        this.schedulerJobsListGridLayoutStore = settings as SchedulerJobsListGridLayoutStore;
        if (this.schedulerJobsListGridLayoutStore) {
          this.pageNumber = settings.currentPageIndex + 1 ?? 1;
          this.searchText = settings.searchText ?? '';
          this.useWildcards = settings.searchWildcards ?? false;
          this.pageSize = settings.pageSize?.id ?? 20;
          this.requestModel.searchModel;
          this.addSettingsToSession(settings);
        }
        this.areSettingsLoaded = true;
        this.getData();
      },
      () => {
        this.getData();
        this.areSettingsLoaded = true;
      }
    );
  }

  addSettingsToSession(settings: SchedulerJobsListGridLayoutStore) {
    if (settings) {
      if (settings.currentPageIndex) {
        this.schedulerJobsListGridService.setSessionSettingsPageIndex(settings.currentPageIndex);
      }

      if (settings.searchText) {
        this.schedulerJobsListGridService.setSessionSettingsSearchedText(settings.searchText);
      }

      if (settings.searchWildcards) {
        this.schedulerJobsListGridService.setSessionSettingsSearchedWildcards(settings.searchWildcards);
        this.useWildcards = settings.searchWildcards;
      }
    }
  }

  saveSettingsStore(sortModel?: GridSortParams[]) {
    const store: SchedulerJobsListGridLayoutStore = {
      currentPageIndex: this.schedulerJobsListGridService.getSessionSettingsPageIndex(),
      searchText: this.schedulerJobsListGridService.getSessionSettingsSearchedText(),
      searchWildcards: this.schedulerJobsListGridService.getSessionSettingsSearchedWildcards(),
      pageSize: this.pageSizes.find((pageSize) => pageSize.id === this.pageSize)
    };

    if (
      !this.schedulerJobsListGridLayoutStore ||
      store.currentPageIndex !== this.schedulerJobsListGridLayoutStore.currentPageIndex ||
      JSON.stringify(store.sortModel) !== JSON.stringify(this.schedulerJobsListGridLayoutStore.sortModel) ||
      store.searchText !== this.schedulerJobsListGridLayoutStore.searchText ||
      store.searchWildcards !== this.schedulerJobsListGridLayoutStore.searchWildcards ||
      JSON.stringify(store.pageSize) !== JSON.stringify(this.schedulerJobsListGridLayoutStore.pageSize)
    ) {
      this.settingsStoreService.saveCurrentUserSettings(this.schedulerJobsListGridLayoutStoreKey, store);
      this.schedulerJobsListGridLayoutStore = store;
    }
  }

  toggleWildcards($event: boolean) {
    if (this.areSettingsLoaded) {
      this.useWildcards = $event;
      this.schedulerJobsListGridService.setSessionSettingsSearchedWildcards($event);

      if (this.schedulerJobsListGridService.getSessionSettingsSearchedText()) {
        this.schedulerJobsListGridService.setSessionSettingsPageIndex(0);
      }
      this.getData();
      this.saveSettingsStore();
    }
  }

  hasUserAddPermissions(): boolean {
    if (!this.permissionService.hasAccess(PermissionEnumerator.Manage_Jobs)) {
      return false;
    }

    return (
      this.permissionService.hasAccess(PermissionEnumerator.Manage_Meters) ||
      this.permissionService.hasAccess(PermissionEnumerator.Manage_Concentrators) ||
      this.permissionService.hasAccess(PermissionEnumerator.Manage_Meters)
    );
  }

  addWidth() {
    return this.elRef.nativeElement.parentElement.offsetWidth;
  }

  calculateHeight() {
    return window.innerHeight - 220;
  }

  getData(forceRefresh = false) {
    this.loading = true;
    this.setRequestData();
    this.schedulerJobsService.getSchedulerJobsListForm(this.requestModel, this.pageNumber - 1, this.pageSize).subscribe((data) => {
      this.totalCount = data.totalCount;
      this.gridData = data.data;
      this.loading = false;
      if (forceRefresh) {
        this.gridData = [...this.gridData];
      }
    });
  }

  jobStatusChanged(event: any) {
    this.openJobStatusModal(event.id, !event.value);
  }

  openJobStatusModal(id: any, event: boolean) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = event ? this.translate.instant('COMMON.ENABLE') : this.translate.instant('COMMON.DISABLE');
    response = event ? this.schedulerJobsService.enableSchedulerJob(id) : this.schedulerJobsService.disableSchedulerJob(id);
    component.btnConfirmText = operation;
    component.modalTitle = this.translate.instant('COMMON.CONFIRM-OPERATION');
    component.modalBody = this.translate.instant('JOB.SCHEDULER-JOB-CHANGE-STATUS');

    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        response.subscribe(
          (value) => {
            this.getData();
            this.toast.successToast(event ? this.messageEnabled : this.messageDisabled);
          },
          (e) => {
            this.getData();
            this.toast.errorToast(this.messageServerError);
          }
        );
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  linkClicked(row: any) {
    // commented until we fixed views
    const baseUrl = '/schedulerJobs/meter-units';
    if (!(row.rowData.jobType === 1 || row.rowData.jobType === 3 || row.rowData.jobType === 5 || row.rowData.jobType === 4)) {
      this.router.navigate([baseUrl, row.id]);
    }
    // else redirect to DC baseUrl = '/schedulerJobs/concentrators';
  }

  setRequestData() {
    this.requestModel.searchModel = [
      {
        colId: 'all',
        type: enumSearchFilterOperators.like,
        value: this.searchText,
        useWildcards: this.useWildcards
      }
    ];
  }

  loadMoreData(event: PageChangedEvent) {
    this.pageNumber = event.pageNumber;
    if (event.rowsPerPage && event.rowsPerPage !== this.pageSize) {
      this.pageNumber = 1; // init page number after page size increased
      this.pageSize = event.rowsPerPage;
    }
    this.getData();
    this.saveSettingsStore();
  }

  rowActionsClicked(event: any) {
    if (event.actionName === 'execute') {
      this.runJob(event.rowData);
    }
    if (event.actionName === 'edit') {
      this.editJob(event.rowData);
    }
    if (event.actionName === 'delete') {
      this.deleteJob(event.rowData);
    }
  }

  // copied from old grid
  // todo move to service

  runJob(params: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = this.translate.instant('COMMON.EXECUTE');
    response = this.schedulerJobsService.executeSchedulerJob(params.id);
    component.btnConfirmText = operation;
    component.modalTitle = this.translate.instant('COMMON.CONFIRM-OPERATION');
    component.modalBody = this.translate.instant('JOB.SCHEDULER-JOB.EXECUTE');

    modalRef.result.then(
      (data) => {
        component.loading = true;
        // on close (CONFIRM)
        response.subscribe(
          (value) => {
            component.loading = false;
            this.toast.successToast(this.translate.instant('JOB.SCHEDULER-JOB-STARTED'));
          },
          (e) => {
            component.loading = false;
            this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
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

    if (params.jobType === JobTypeEnumeration.discovery) {
      this.editDiscoveryJob(params, options);
    } else if (params.jobType === JobTypeEnumeration.timeSync) {
      // dc time sync
      this.editDcTimeSyncJob(params, options);
    } else if (params.jobType === JobTypeEnumeration.meterTimeSync) {
      // dc time sync
      this.editMeterTimeSyncJob(params, options);
    } else if (params.jobType === JobTypeEnumeration.readEvents) {
      // dc read events job
      this.editDcReadEventsJob(params, options);
    } else if (params.jobType === JobTypeEnumeration.topology) {
      this.editTopologyJob(params, options);
    } else if (params.jobType === JobTypeEnumeration.alarmNotification) {
      this.editAlarmNotificationJob(params, options);
    } else if (params.jobType === JobTypeEnumeration.initialReKeying) {
      this.editInitialReKeyJob(params, options);
    } else {
      this.editReadingJob(params, options);
    }
  }

  deleteJob(params: any) {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    let response: Observable<any> = new Observable();
    const operation = this.translate.instant('COMMON.DELETE');
    response = this.schedulerJobsService.deleteSchedulerJob(params.id);
    component.btnConfirmText = operation;
    component.modalTitle = this.translate.instant('COMMON.CONFIRM-DELETE');
    component.modalBody = this.translate.instant('JOB.SCHEDULER-JOB.DELETE');
    modalRef.result.then(
      (data) => {
        // on close (CONFIRM)
        component.loading = true;
        response.subscribe(
          (value) => {
            component.loading = false;
            this.toast.successToast(this.translate.instant('JOB.SCHEDULER-JOB-DELETED'));
            this.getData(true);
          },
          (e) => {
            component.loading = false;
            this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
          }
        );
      },
      (reason) => {
        // on dismiss (CLOSE)
      }
    );
  }

  hasUserAccess(params: any): boolean {
    if (!this.permissionService.hasAccess(PermissionEnumerator.Manage_Jobs)) {
      return false;
    }

    const jobType = params.jobType;
    if (jobType === JobTypeEnumeration.reading) {
      return this.permissionService.hasAccess(PermissionEnumerator.Manage_Meters);
    } else if (jobType === JobTypeEnumeration.alarmNotification) {
      return this.permissionService.hasAccess(PermissionEnumerator.Manage_Alarms);
    } else {
      return this.permissionService.hasAccess(PermissionEnumerator.Manage_Concentrators);
    }
  }

  private editReadingJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.id;

    const timeUnits$ = this.codelistService.timeUnitCodeslist();
    const job$ = this.schedulerJobsService.getJob(selectedJobId);

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
    const selectedJobId = params.id;

    this.schedulerJobsService.getJob(selectedJobId).subscribe((job) => {
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

  private editTopologyJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.id;

    this.schedulerJobsService.getJob(selectedJobId).subscribe((job) => {
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
    const selectedJobId = params.id;

    this.schedulerJobsService.getJob(selectedJobId).subscribe((job) => {
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

  private editMeterTimeSyncJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.id;

    this.schedulerJobsService.getJob(selectedJobId).subscribe((job) => {
      const modalRef = this.modalService.open(SchedulerJobComponent, options);
      const component: SchedulerJobComponent = modalRef.componentInstance;
      component.setFormEdit(null, selectedJobId, job, JobTypeEnumeration.meterTimeSync);

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
    const selectedJobId = params.id;

    const timeUnits$ = this.codelistService.timeUnitCodeslist();
    const job$ = this.schedulerJobsService.getJob(selectedJobId);

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
    const selectedJobId = params.id;

    forkJoin({
      protocols: this.codelistMeterUnitsRepositoryService.meterUnitProtocolTypeCodelist(),
      manufacturers: this.codelistMeterUnitsRepositoryService.meterUnitVendorCodelist(0),
      severities: this.codelistMeterUnitsRepositoryService.meterUnitAlarmSeverityTypeCodelist(),
      sources: this.codelistMeterUnitsRepositoryService.meterUnitAlarmSourceTypeCodelist(),
      notificationTypes: this.codelistMeterUnitsRepositoryService.meterUnitAlarmNotificationTypeCodelist(),
      defaultJobAddress: this.settingsService.getSetting(userSettingNotificationJobDefaultAddress)
    }).subscribe(({ protocols, manufacturers, severities, sources, notificationTypes, defaultJobAddress }) => {
      this.schedulerJobsService.getNotificationJob(selectedJobId).subscribe((job) => {
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

  private editInitialReKeyJob(params: any, options: NgbModalOptions) {
    const selectedJobId = params.id;

    forkJoin({
      protocols: this.codelistMeterUnitsRepositoryService.meterUnitProtocolTypeCodelist(),
      manufacturers: this.codelistMeterUnitsRepositoryService.meterUnitVendorCodelist(0)
    }).subscribe(({ protocols, manufacturers }) => {
      this.schedulerJobsService.getReKeyJob(selectedJobId).subscribe((job) => {
        const modalRef = this.modalService.open(SchedulerJobComponent, options);
        const component: SchedulerJobComponent = modalRef.componentInstance;
        component.setFormInitialReKeyJobEdit(protocols, manufacturers, selectedJobId, job);

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
}
