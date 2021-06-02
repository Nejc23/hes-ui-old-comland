import { PermissionService } from './../../../../core/permissions/services/permission.service';
import { NotificationFilter, ReadingProperties } from './../../../../core/repository/interfaces/jobs/scheduler-job.interface';
import { DataConcentratorUnitsSelectComponent } from './../../../data-concentrator-units-select/component/data-concentrator-units-select.component';
import { JobTypeEnumeration } from './../../enums/job-type.enum';
import { ToastNotificationService } from './../../../../core/toast-notification/services/toast-notification.service';
import { CronScheduleComponent } from './../../cron-schedule/components/cron-schedule.component';
import { Component, OnInit, ViewChild, Input, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { SchedulerJob, SchedulerJobForm } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
import { RegistersSelectComponent } from 'src/app/features/registers-select/component/registers-select.component';
import { forkJoin, Observable } from 'rxjs';
import * as moment from 'moment';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { PlcMeterReadScheduleService } from 'src/app/features/meter-units/common/services/plc-meter-read-scheduler.service';
import { DataConcentratorUnitsSelectGridService } from 'src/app/features/data-concentrator-units-select/services/data-concentrator-units-select-grid.service';
import { AlarmNotificationRulesComponent } from './alarm-notification-rules.component';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { AddJobParams } from '../../interfaces/add-job-params.interace';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
@Component({
  selector: 'app-scheduler-job',
  templateUrl: './scheduler-job.component.html'
})
export class SchedulerJobComponent implements OnInit {
  @ViewChild(RegistersSelectComponent) registers;
  @ViewChild(DataConcentratorUnitsSelectComponent) listOfDCUs: DataConcentratorUnitsSelectComponent;
  @ViewChild('cronSchedule') cronScheduler: CronScheduleComponent;
  @ViewChild('notificationRules') notificationRules: AlarmNotificationRulesComponent;

  @Input() selectedJobId: string;
  @Input() deviceFiltersAndSearch: GridBulkActionRequestParams;

  protocols: Codelist<number>[];
  manufacturers: Codelist<number>[];
  severities: Codelist<number>[];
  sources: Codelist<number>[];

  selectedRowsCount = 0;

  form: FormGroup;

  noRegisters = false;
  requiredText = `Required field`;

  jobsTimeUnits$: Observable<Codelist<number>[]>;
  jobsTimeUnits: Codelist<number>[];
  defaultTimeUnit: Codelist<number>;
  step = 0;

  noDCUs = false;
  cronExpression: string;

  showRegisters = false;
  showConcentrators = false;
  showAlarmNotification = false;

  jobType: JobTypeEnumeration = JobTypeEnumeration.reading;
  public title = '';

  // alarm notifications
  filter: NotificationFilter;
  addresses: string[];

  jobTypes = JobTypeEnumeration;

  addJobs: AddJobParams[] = [
    {
      jobType: JobTypeEnumeration.reading,
      jobName: `Reading`,
      deviceType: `METER`,
      icon: 'line_weight',
      hasUserAccess: this.hasJobsManageAccessWith(PermissionEnumerator.Manage_Meters)
    },
    {
      jobType: JobTypeEnumeration.discovery,
      jobName: `Discovery`,
      deviceType: `DC`,
      icon: 'search',
      hasUserAccess: this.hasJobsManageAccessWith(PermissionEnumerator.Manage_Concentrators)
    },
    {
      jobType: JobTypeEnumeration.timeSync,
      jobName: `Time synchronization`,
      deviceType: `DC`,
      icon: 'restore',
      hasUserAccess: this.hasJobsManageAccessWith(PermissionEnumerator.Manage_Concentrators)
    },
    {
      jobType: JobTypeEnumeration.readEvents,
      jobName: `Read events`,
      deviceType: `DC`,
      icon: 'line_style',
      hasUserAccess: this.hasJobsManageAccessWith(PermissionEnumerator.Manage_Concentrators)
    },
    {
      jobType: JobTypeEnumeration.topology,
      jobName: `Topology`,
      deviceType: `DC`,
      icon: 'share',
      isIconOutlined: true,
      hasUserAccess: this.hasJobsManageAccessWith(PermissionEnumerator.Manage_Concentrators)
    },
    {
      jobType: JobTypeEnumeration.alarmNotification,
      jobName: `Notification`,
      deviceType: `SYSTEM`,
      icon: 'notification_important',
      isIconOutlined: true,
      hasUserAccess: this.hasJobsManageAccessWith(PermissionEnumerator.Manage_Alarms)
    }
  ];

  addJobsForUser: AddJobParams[];

  constructor(
    private meterService: PlcMeterReadScheduleService,
    private codelistService: CodelistRepositoryService,
    private jobsService: JobsService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private toast: ToastNotificationService,
    private dataConcentratorUnitsSelectGridService: DataConcentratorUnitsSelectGridService,
    private codelistMeterUnitsRepositoryService: CodelistMeterUnitsRepositoryService,
    private permissionService: PermissionService
  ) {
    this.initAddJobsForUser();
  }

  initAddJobsForUser() {
    const itemsPerRow = 3;

    this.addJobsForUser = this.addJobs.filter((j) => j.hasUserAccess);
    const jobsLength = this.addJobsForUser.length;

    for (let i = 0; i < jobsLength; i++) {
      if (i < 3 && jobsLength > 3) {
        this.addJobsForUser[i].cssClasses = 'border-bottom';
      }

      if (i % 3 > 0) {
        if (!this.addJobsForUser[i].cssClasses) {
          this.addJobsForUser[i].cssClasses = '';
        }
        this.addJobsForUser[i].cssClasses += ' border-left';
      }
    }
  }

  createForm(formData: SchedulerJob): FormGroup {
    let startAt =
      formData && formData.schedules && formData.schedules.length > 0 && formData.schedules[0].startAt
        ? moment(formData.schedules[0].startAt).toDate()
        : null;
    if (this.showAlarmNotification) {
      startAt = formData && formData.startAt ? moment(formData.startAt).toDate() : null;
    }

    let endAt =
      formData && formData.schedules && formData.schedules.length > 0 && formData.schedules[0].endAt
        ? moment(formData.schedules[0].endAt).toDate()
        : null;
    if (this.showAlarmNotification) {
      endAt = formData && formData.endAt ? moment(formData.endAt).toDate() : null;
    }

    return this.formBuilder.group({
      [this.registersProperty]: [formData ? formData.registers : null, Validators.required],
      [this.devicesProperty]: [formData ? formData.devices : null, Validators.required],
      [this.activeProperty]: [formData ? formData.active : true],
      [this.descriptionProperty]: [formData ? formData.description : null, [Validators.maxLength(500), Validators.required]],
      [this.usePointerProperty]: [formData && formData.readingProperties ? formData.readingProperties.usePointer : true],
      [this.intervalRangeProperty]: [
        formData && formData.readingProperties ? formData.readingProperties.intervalRange : 1,
        Validators.required
      ],
      [this.timeUnitProperty]: [
        formData && formData.readingProperties && formData.readingProperties.timeUnit
          ? this.jobsTimeUnits.find((x) => x.id === formData.readingProperties.timeUnit)
          : this.defaultTimeUnit,
        Validators.required
      ],

      [this.startAtProperty]: [startAt],
      [this.endAtProperty]: [endAt],
      [this.iecPushEnabledProperty]:
        formData && formData.readingProperties && this.showIecPush() ? formData.readingProperties.iecPushEnabled : false
    });
  }

  ngOnInit() {}

  setTitle(): string {
    switch (this.jobType) {
      case JobTypeEnumeration.discovery: {
        return `Discovery Job`;
      }
      case JobTypeEnumeration.readEvents: {
        return `DC Read events job`;
      }
      case JobTypeEnumeration.timeSync: {
        return `DC Time sync job`;
      }
      case JobTypeEnumeration.topology: {
        return `Topology job`;
      }
      case JobTypeEnumeration.alarmNotification: {
        return `Alarm notification`;
      }
      default: {
        return `Reading Jobs`;
      }
    }
  }

  setFormEdit(jobsTimeUnits: Codelist<number>[], selectedJobId: string, job: SchedulerJob, jobType: JobTypeEnumeration) {
    this.step = 1;
    this.initForm(jobType, jobsTimeUnits, selectedJobId, job);
  }

  setFormAddNew(jobTypeSetting: JobTypeEnumeration, jobsTimeUnits: Codelist<number>[]) {
    this.initForm(jobTypeSetting, jobsTimeUnits, null, null);
  }

  setFormNotificationJobAddNew(
    protocols: Codelist<number>[],
    manufacturers: Codelist<number>[],
    severities: Codelist<number>[],
    sources: Codelist<number>[]
  ) {
    this.protocols = protocols;
    this.manufacturers = manufacturers;
    this.severities = severities;
    this.sources = sources;

    console.log('setFormNotificationJobAddNew');
    this.initForm(JobTypeEnumeration.alarmNotification, null, null, null);
  }

  setFormNotificationJobEdit(
    protocols: Codelist<number>[],
    manufacturers: Codelist<number>[],
    severities: Codelist<number>[],
    sources: Codelist<number>[],
    selectedJobId: string,
    job: SchedulerJob
  ) {
    this.protocols = protocols;
    this.manufacturers = manufacturers;
    this.severities = severities;
    this.sources = sources;

    this.initForm(JobTypeEnumeration.alarmNotification, null, selectedJobId, job);
  }

  initForm(selectedJobType: JobTypeEnumeration, jobsTimeUnits: Codelist<number>[], selectedJobId: string, job: SchedulerJob) {
    if (jobsTimeUnits && jobsTimeUnits.length > 0) {
      this.jobsTimeUnits = jobsTimeUnits;
      this.defaultTimeUnit = jobsTimeUnits.find((x) => x.id === 3);
    }

    this.jobType = selectedJobType;
    switch (this.jobType) {
      case JobTypeEnumeration.reading: {
        this.showRegisters = true;
        break;
      }
      case JobTypeEnumeration.alarmNotification: {
        this.showAlarmNotification = true;
        break;
      }
      default: {
        this.showConcentrators = true;
        break;
      }
    }

    this.dataConcentratorUnitsSelectGridService.setSessionSettingsSearchedText(null);
    this.dataConcentratorUnitsSelectGridService.setSessionSettingsSelectedRowsById(job?.devices?.id);

    this.selectedJobId = selectedJobId;

    this.form = this.createForm(job);
    this.filter = job?.filter;
    this.addresses = job?.addresses;

    this.form.get(this.registersProperty).clearValidators();

    this.cronExpression = job && job.schedules && job.schedules.length > 0 ? job.schedules[0].cronExpression : null;
    if (job && this.jobType === JobTypeEnumeration.alarmNotification) {
      this.cronExpression = job.cronExpression;
    }

    this.title = this.setTitle();
    this.step = 1;
  }

  setJobType(jobTypeSetting: any) {
    if (!isNaN(Number(jobTypeSetting))) {
      this.jobType = JobTypeEnumeration[JobTypeEnumeration[+jobTypeSetting]];
    } else {
      const jt = String(jobTypeSetting).toLowerCase();
      this.jobType = JobTypeEnumeration[jt];
    }
  }

  fillData(): SchedulerJobForm {
    if (this.showConcentrators) {
      const deviceIds = this.form.get(this.devicesProperty).value;
      if (deviceIds != null) {
        const concentrList: string[] = deviceIds;
        this.deviceFiltersAndSearch = {
          id: concentrList
        };
      }
    }

    const formData: SchedulerJobForm = {
      registers: this.form.get(this.registersProperty).value,
      description: this.form.get(this.descriptionProperty).value,
      devices: this.deviceFiltersAndSearch,
      active: this.form.get(this.activeProperty).value,
      jobType: this.jobType,
      cronExpression: this.cronExpression,
      startAtDate: this.form.get(this.startAtProperty).value,
      endAtDate: this.form.get(this.endAtProperty).value,

      readingProperties: {
        usePointer: this.showPointer ? this.form.get(this.usePointerProperty).value : false,
        iecPushEnabled: this.showIecPush() ? this.form.get(this.iecPushEnabledProperty).value : false,
        intervalRange:
          this.showForLast() && this.form.get(this.intervalRangeProperty).value
            ? parseInt(this.form.get(this.intervalRangeProperty).value, 10)
            : 0,
        timeUnit:
          this.showForLast() && this.form.get(this.timeUnitProperty).value
            ? (this.form.get(this.timeUnitProperty).value as Codelist<number>).id
            : 0
      }
    };
    return formData;
  }

  resetAll() {
    this.selectedJobId = null;
    this.step = 1;

    this.setFormAddNew(this.jobType, this.jobsTimeUnits);
  }

  showForLast() {
    return this.jobType === JobTypeEnumeration.reading;
  }

  showPointer() {
    return this.jobType === JobTypeEnumeration.reading || this.jobType === JobTypeEnumeration.readEvents;
  }

  // showUsePointer() {
  //   return this.form.get(this.usePointerProperty).value === true;
  // }

  showIecPush() {
    return this.jobType === JobTypeEnumeration.reading;
  }

  save(addNew: boolean) {
    // times and selected registers

    if (this.showRegisters) {
      const selectedRegisters = this.registers.getSelectedRowIds();
      this.noRegisters = selectedRegisters.length === 0;
      this.form.get(this.registersProperty).setValue(selectedRegisters);
    } else if (this.showConcentrators) {
      const selectedData = this.listOfDCUs.getSelectedRowIds();
      this.form.get(this.devicesProperty).setValue(selectedData);
      this.noDCUs = selectedData.length === 0;
    }

    const values = this.fillData();

    if (this.showAlarmNotification) {
      if (!this.notificationRules.validateForm()) {
        return;
      }

      values.filter = this.notificationRules.getFilter();
      values.addresses = this.notificationRules.getAddresses();
      values.jobType = JobTypeEnumeration.alarmNotification;
    }

    let request: Observable<SchedulerJob> = null;
    let operation = `added`;
    if (this.selectedJobId) {
      operation = `updated`;
      request = this.meterService.updateMeterUnitsReadScheduler(values, this.selectedJobId);

      if (this.showAlarmNotification) {
        request = this.meterService.updateNotificationJob(values, this.selectedJobId);
      }
    } else {
      request = this.meterService.createMeterUnitsReadScheduler(values);

      if (this.showAlarmNotification) {
        request = this.meterService.createNotificationJob(values);
      }
    }
    const successMessage = `Job was` + ` ${operation} ` + `successfully`;
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        if (addNew) {
          this.resetAll();
          this.ngOnInit();
        } else {
          this.modal.close();
        }
      },
      (error) => {
        console.log('Error saving job', error);
        // this.toast.errorToast( `Error saving job: ` + error);
      } // error
    );
  }

  cancel() {
    this.modal.dismiss();
  }
  registerSelectionChanged(hasValues: boolean) {
    this.noRegisters = !hasValues;
  }

  // properties - START
  get startAtProperty() {
    return nameOf<SchedulerJobForm>((o) => o.startAt);
  }

  get endAtProperty() {
    return nameOf<SchedulerJobForm>((o) => o.endAt);
  }
  get registersProperty() {
    return nameOf<SchedulerJobForm>((o) => o.registers);
  }
  get devicesProperty() {
    return nameOf<SchedulerJobForm>((o) => o.devices);
  }

  get descriptionProperty() {
    return nameOf<SchedulerJobForm>((o) => o.description);
  }

  get usePointerProperty() {
    return nameOf<ReadingProperties>((o) => o.usePointer);
  }

  get intervalRangeProperty() {
    return nameOf<ReadingProperties>((o) => o.intervalRange);
  }

  get timeUnitProperty() {
    return nameOf<ReadingProperties>((o) => o.timeUnit);
  }

  get activeProperty() {
    return nameOf<SchedulerJobForm>((o) => o.active);
  }

  get iecPushEnabledProperty() {
    return nameOf<ReadingProperties>((o) => o.iecPushEnabled);
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  next(value) {
    this.form.get(this.registersProperty).disable();
    this.form.get(this.devicesProperty).disable();

    if (!this.showForLast()) {
      this.form.get(this.intervalRangeProperty).disable();
      this.form.get(this.timeUnitProperty).disable();
    }

    if (this.jobType === JobTypeEnumeration.alarmNotification && value === -1) {
      this.filter = this.notificationRules.getFilter();
      this.addresses = this.notificationRules.getAddresses();
    }

    // if (this.showPointer() && this.form.get(this.usePointerProperty).value) {
    //   this.form.get(this.intervalRangeProperty).enable();
    //   this.form.get(this.timeUnitProperty).enable();
    // }

    // check form
    this.formUtils.touchElementsAndValidate(this.form);

    if (this.cronScheduler?.form) {
      if (value > 0 && !this.cronScheduler.isFormValid()) {
        return;
      }

      this.cronExpression = this.cronScheduler.generateCronExpression();
    }

    if (value > 0 && this.form.invalid) {
      console.log('form is invalid', this.form);
      return;
    }

    this.step = this.step + value;

    if (this.step === 2) {
      if (this.showRegisters) {
        this.form.get(this.registersProperty).enable();
      }

      if (this.showConcentrators) {
        this.form.get(this.devicesProperty).enable();
      }
    }
  }

  getSelectedRowsCount() {
    if (this.selectedRowsCount) {
      return `(${this.selectedRowsCount} selected)`;
    }

    return '';
  }

  dcuSelectionChanged(hasValues: boolean) {
    this.noDCUs = !hasValues;
  }

  callAction() {
    alert('abc');
  }

  addJob(jobType: JobTypeEnumeration) {
    if (jobType === JobTypeEnumeration.alarmNotification) {
      forkJoin({
        protocols: this.codelistMeterUnitsRepositoryService.meterUnitProtocolTypeCodelist(),
        manufacturers: this.codelistMeterUnitsRepositoryService.meterUnitVendorCodelist(0),
        severities: this.codelistMeterUnitsRepositoryService.meterUnitAlarmSeverityTypeCodelist(),
        sources: this.codelistMeterUnitsRepositoryService.meterUnitAlarmSourceTypeCodelist()
      }).subscribe(({ protocols, manufacturers, severities, sources }) => {
        this.setFormNotificationJobAddNew(protocols, manufacturers, severities, sources);
      });
    } else if (jobType === JobTypeEnumeration.reading || jobType === JobTypeEnumeration.readEvents) {
      this.codelistService.timeUnitCodeslist().subscribe((units) => {
        this.setFormAddNew(jobType, units);
      });
    } else {
      this.setFormAddNew(jobType, null);
    }
  }

  hasJobsManageAccessWith(permission: PermissionEnumerator): boolean {
    return this.permissionService.hasAccess(PermissionEnumerator.Manage_Jobs) && this.permissionService.hasAccess(permission);
  }
}
