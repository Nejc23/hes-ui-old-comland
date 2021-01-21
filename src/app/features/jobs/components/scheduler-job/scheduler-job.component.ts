import { jobActionType } from './../../enums/job-action-type.enum';
import { DataConcentratorUnitsSelectComponent } from './../../../data-concentrator-units-select/component/data-concentrator-units-select.component';
import { jobType } from './../../enums/job-type.enum';
import { ToastNotificationService } from './../../../../core/toast-notification/services/toast-notification.service';
import { ToastComponent } from './../../../../shared/toast-notification/components/toast.component';
import { CronScheduleComponent } from './../../cron-schedule/components/cron-schedule.component';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';
import * as _ from 'lodash';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { SchedulerJob, SchedulerJobForm } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
import { RegistersSelectComponent } from 'src/app/features/registers-select/component/registers-select.component';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { PlcMeterReadScheduleService } from 'src/app/features/meter-units/common/services/plc-meter-read-scheduler.service';
import { DataConcentratorUnitsSelectGridService } from 'src/app/features/data-concentrator-units-select/services/data-concentrator-units-select-grid.service';
@Component({
  selector: 'app-scheduler-job',
  templateUrl: './scheduler-job.component.html'
})
export class SchedulerJobComponent implements OnInit {
  @ViewChild(RegistersSelectComponent) registers;
  @ViewChild(DataConcentratorUnitsSelectComponent) listOfDCUs: DataConcentratorUnitsSelectComponent;
  @ViewChild('cronSchedule') cronScheduler: CronScheduleComponent;

  @Input() selectedJobId: string;
  @Input() deviceFiltersAndSearch: GridBulkActionRequestParams;

  selectedRowsCount = 0;

  form: FormGroup;

  noRegisters = false;
  requiredText = $localize`Required field`;

  jobsTimeUnits$: Observable<Codelist<number>[]>;
  jobsTimeUnits: Codelist<number>[];
  defaultTimeUnit: Codelist<number>;
  step = 1;

  noDCUs = false;
  cronExpression: string;

  showRegisters = false;
  showConcentrators = false;

  jobType = jobType.reading;
  public title = '';

  constructor(
    private meterService: PlcMeterReadScheduleService,
    private codelistService: CodelistRepositoryService,
    private jobsService: JobsService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private toast: ToastNotificationService,
    private dataConcentratorUnitsSelectGridService: DataConcentratorUnitsSelectGridService
  ) {}

  createForm(formData: SchedulerJob): FormGroup {
    return this.formBuilder.group({
      [this.registersProperty]: [formData ? formData.registers : Validators.required],
      [this.devicesProperty]: [formData ? formData.devices : Validators.required],
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

      [this.startAtProperty]: [
        formData && formData.schedules && formData.schedules.length > 0 && formData.schedules[0].startAt
          ? moment(formData.schedules[0].startAt).toDate()
          : null
      ],
      [this.endAtProperty]: [
        formData && formData.schedules && formData.schedules.length > 0 && formData.schedules[0].endAt
          ? moment(formData.schedules[0].endAt).toDate()
          : null
      ]
    });
  }

  ngOnInit() {}

  setTitle() {
    switch (this.jobType.toLowerCase()) {
      case jobType.discovery.toLowerCase(): {
        return $localize`Discovery Job`;
      }
      case jobType.readEvents.toLowerCase(): {
        return $localize`DC Read events job`;
      }
      case jobType.timeSync.toLowerCase(): {
        return $localize`DC Time sync job`;
      }
      case jobType.topology.toLowerCase(): {
        return $localize`Topology job`;
      }
      default: {
        return $localize`Reading Jobs`;
      }
    }
  }

  setFormEdit(jobsTimeUnits: Codelist<number>[], selectedJobId: string, job: SchedulerJob) {
    this.initForm(job.jobType, jobsTimeUnits, selectedJobId, job);
  }

  setFormAddNew(jobTypeSetting: string, jobsTimeUnits: Codelist<number>[]) {
    this.initForm(jobTypeSetting, jobsTimeUnits, null, null);
  }

  initForm(jobTypeSetting: string, jobsTimeUnits: Codelist<number>[], selectedJobId: string, job: SchedulerJob) {
    if (jobsTimeUnits && jobsTimeUnits.length > 0) {
      this.jobsTimeUnits = jobsTimeUnits;
      this.defaultTimeUnit = jobsTimeUnits.find((x) => x.id === 3);
    }

    this.dataConcentratorUnitsSelectGridService.setSessionSettingsSearchedText(null);
    this.dataConcentratorUnitsSelectGridService.setSessionSettingsSelectedRowsById(job?.devices?.id);

    this.selectedJobId = selectedJobId;

    this.form = this.createForm(job);

    // this.changeReadOptionId();
    this.form.get(this.registersProperty).clearValidators();
    this.cronExpression = job && job.schedules && job.schedules.length > 0 ? job.schedules[0].cronExpression : null;

    // this.cronScheduler.initForm(this.cronExpression);

    this.jobType = jobTypeSetting;
    this.showRegisters = this.jobType.toLowerCase() === jobType.reading.toLowerCase();
    this.showConcentrators = !this.showRegisters;

    this.title = this.setTitle();
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
      active: true,
      jobType: this.jobType,
      cronExpression: this.cronExpression,
      startAtDate: this.form.get(this.startAtProperty).value,
      endAtDate: this.form.get(this.endAtProperty).value,

      readingProperties: {
        usePointer: this.showPointer ? this.form.get(this.usePointerProperty).value : false,
        iecPushEnabled: false,
        intervalRange:
          this.form.get(this.intervalRangeProperty).value !== null ? parseInt(this.form.get(this.intervalRangeProperty).value, 10) : 0,
        timeUnit:
          this.form.get(this.timeUnitProperty).value !== null ? (this.form.get(this.timeUnitProperty).value as Codelist<number>).id : 0
      }
    };
    return formData;
  }

  resetAll() {
    this.selectedJobId = null;
    this.step = 1;

    this.setFormAddNew(this.jobType, this.jobsTimeUnits);
  }

  showPointer() {
    return this.jobType.toLowerCase() === jobType.reading.toLowerCase() || this.jobType.toLowerCase() === jobType.readEvents.toLowerCase();
  }

  showUsePointer() {
    return this.form.get(this.usePointerProperty).value === true;
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
    let request: Observable<SchedulerJob> = null;
    let operation = $localize`added`;
    if (this.selectedJobId) {
      operation = $localize`updated`;
      request = this.meterService.updateMeterUnitsReadScheduler(values, this.selectedJobId);
    } else {
      request = this.meterService.createMeterUnitsReadScheduler(values);
    }
    const successMessage = $localize`Meter Units Read Scheduler was` + ` ${operation} ` + $localize`successfully`;
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        // if (result) {
        // console.log(`result.time + date = ${moment(values.time).format(moment.HTML5_FMT.DATE)}T${result.time}:00.000Z`);
        if (addNew) {
          this.resetAll();
          this.ngOnInit();
        } else {
          this.modal.close();
        }
        // }
      },
      (error) => {
        console.log('Error saving job', error);
        // this.toast.errorToast($localize`Error saving job: ` + error);
      } // error
    );
  }

  cancel() {
    this.modal.dismiss();
  }
  registerSelectionChanged(hasValues: boolean) {
    // console.log('registerSelcetionChanged');
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
    return nameOf<SchedulerJobForm>((o) => o.usePointer);
  }

  get intervalRangeProperty() {
    return nameOf<SchedulerJobForm>((o) => o.intervalRange);
  }

  get timeUnitProperty() {
    return nameOf<SchedulerJobForm>((o) => o.timeUnit);
  }

  get activeProperty() {
    return nameOf<SchedulerJobForm>((o) => o.active);
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  next(value) {
    this.form.get(this.intervalRangeProperty).clearValidators();
    this.form.get(this.timeUnitProperty).clearValidators();

    if (this.showPointer() && this.form.get(this.usePointerProperty).value) {
      this.form.get(this.intervalRangeProperty).setValidators(Validators.required);
      this.form.get(this.timeUnitProperty).setValidators(Validators.required);
    }

    this.form.get(this.intervalRangeProperty).updateValueAndValidity();
    this.form.get(this.timeUnitProperty).updateValueAndValidity();

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
    this.form.get(this.registersProperty).clearValidators();
    this.form.get(this.devicesProperty).clearValidators();

    if (this.step === 2) {
      if (this.showRegisters) {
        this.form.get(this.registersProperty).setValidators(Validators.required);
      }

      if (this.showConcentrators) {
        this.form.get(this.devicesProperty).setValidators(Validators.required);
      }
    }
  }

  getSelectedRowsCount() {
    if (this.selectedRowsCount) {
      return $localize`(${this.selectedRowsCount} selected)`;
    }

    return '';
  }

  dcuSelectionChanged(hasValues: boolean) {
    this.noDCUs = !hasValues;
  }
}
