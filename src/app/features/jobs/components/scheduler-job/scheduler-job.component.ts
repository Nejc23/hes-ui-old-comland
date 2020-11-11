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

@Component({
  selector: 'app-scheduler-job',
  templateUrl: './scheduler-job.component.html'
})
export class SchedulerJobComponent implements OnInit {
  @ViewChild(RegistersSelectComponent) registers;
  @Input() selectedJobId: string;
  @Input() deviceFiltersAndSearch: GridBulkActionRequestParams;

  form: FormGroup;
  readOptions: RadioOption[] = [
    { value: '1' as string, label: $localize`One-time`, labelSmall: $localize`Once` },
    { value: '2' as string, label: $localize`Minute(s)`, labelSmall: $localize`Every N minute(s)` },
    { value: '3' as string, label: $localize`Hour(s)`, labelSmall: $localize`Every N hour(s` },
    { value: '4' as string, label: $localize`Daily`, labelSmall: $localize`Every day specific time` },
    { value: '5' as string, label: $localize`Weekly`, labelSmall: $localize`One or more days of the week` },
    { value: '6' as string, label: $localize`Monthly`, labelSmall: $localize`One or more days in the month` }
  ];
  weekDays: Codelist<number>[] = [
    { id: 1, value: $localize`Mon-Fri` },
    { id: 2, value: $localize`Mon` },
    { id: 3, value: $localize`Tue` },
    { id: 4, value: $localize`Wed` },
    { id: 5, value: $localize`Thu` },
    { id: 6, value: $localize`Fri` },
    { id: 7, value: $localize`Sat` },
    { id: 8, value: $localize`Sun` }
  ];
  selectedId = 0;
  monthDays: number[] = [];
  noRegisters = false;
  noMonthDays = false;
  registersRequiredText = $localize`Required field`;

  jobsTimeUnits$: Observable<Codelist<number>[]>;
  jobsTimeUnits: Codelist<number>[];
  defaultTimeUnit: Codelist<number>;
  step = 1;

  constructor(
    private meterService: PlcMeterReadScheduleService,
    private codelistService: CodelistRepositoryService,
    private jobsService: JobsService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal
  ) {}

  createForm(formData: SchedulerJob): FormGroup {
    return this.formBuilder.group({
      [this.readOptionsProperty]: [formData ? formData.readOptions.toString() : '4', Validators.required],
      [this.nMinutesProperty]: [formData ? formData.nMinutes : null],
      [this.nHoursProperty]: [formData ? formData.nHours : null],
      [this.timeProperty]: [formData && formData.dateTime ? moment(formData.dateTime).toDate() : null],
      [this.timeForHoursProperty]: [formData && formData.dateTime ? moment(formData.dateTime).toDate() : ''],
      [this.weekDaysProperty]: [formData ? formData.weekDays : []],
      [this.monthDaysProperty]: [formData ? formData.monthDays : []],
      [this.registersProperty]: [formData ? formData.registers : [], Validators.required],
      [this.iecProperty]: [formData ? formData.iec : false],
      [this.descriptionProperty]: [formData ? formData.description : null, [Validators.maxLength(500), Validators.required]],
      [this.usePointerProperty]: [formData ? formData.usePointer : true],
      [this.intervalRangeProperty]: [formData ? formData.intervalRange : 1, Validators.required],
      [this.timeUnitProperty]: [
        formData ? this.jobsTimeUnits.find(x => x.id === formData.timeUnit) : this.defaultTimeUnit,
        Validators.required
      ],
      [this.enableProperty]: [formData ? formData.enable : true]
    });
  }

  ngOnInit() {}

  setFormEdit(jobsTimeUnits: Codelist<number>[], selectedJobId: string, job: SchedulerJob) {
    this.jobsTimeUnits = jobsTimeUnits;
    this.defaultTimeUnit = jobsTimeUnits.find(x => x.id === 3);

    this.selectedJobId = selectedJobId;
    this.selectedId = job.readOptions;
    this.monthDays = job.monthDays;
    this.form = this.createForm(job);
    this.changeReadOptionId();
    this.form.get(this.registersProperty).clearValidators();
  }

  setFormAddNew(jobsTimeUnits: Codelist<number>[]) {
    this.jobsTimeUnits = jobsTimeUnits;
    this.defaultTimeUnit = jobsTimeUnits.find(x => x.id === 3);

    this.form = this.createForm(null);
    this.changeReadOptionId();
    this.form.get(this.registersProperty).clearValidators();
  }

  fillData(): SchedulerJobForm {
    let time: string = null;
    if (this.show_nHours()) {
      time = this.form.get(this.timeForHoursProperty).value;
      if (!time) {
        time = null;
      }
    } else {
      time = this.form.get(this.timeProperty).value;
      if (time === null || time === '') {
        time = new Date().toUTCString();
      }
    }
    const formData: SchedulerJobForm = {
      readOptions: parseInt(this.form.get(this.readOptionsProperty).value, 10),
      nMinutes: this.show_nMinutes() ? parseInt(this.form.get(this.nMinutesProperty).value, 10) : 0,
      nHours: this.show_nHours() ? parseInt(this.form.get(this.nHoursProperty).value, 10) : 0,
      time: (this.showTime() && this.form.get(this.timeProperty)).value !== '' ? this.form.get(this.timeProperty).value : null,
      timeForHours: this.show_nHours() ? this.form.get(this.timeForHoursProperty).value : null,
      weekDays: this.showWeekDays() ? this.form.get(this.weekDaysProperty).value : [],
      monthDays: this.showMonthDays() ? this.form.get(this.monthDaysProperty).value : [],
      registers: this.form.get(this.registersProperty).value,
      iec: this.form.get(this.iecProperty).value,
      description: this.form.get(this.descriptionProperty).value,
      dateTime: this.showDateTime() ? time : null,
      bulkActionsRequestParam: this.deviceFiltersAndSearch,
      usePointer: this.form.get(this.usePointerProperty).value,
      intervalRange:
        this.form.get(this.intervalRangeProperty).value !== null ? parseInt(this.form.get(this.intervalRangeProperty).value, 10) : 0,
      timeUnit:
        this.form.get(this.timeUnitProperty).value !== null ? (this.form.get(this.timeUnitProperty).value as Codelist<number>).id : 0,
      enable: this.form.get(this.enableProperty).value,
      actionType: 2
    };
    return formData;
  }

  resetAll() {
    this.selectedJobId = null;
    this.step = 1;
    this.monthDays = [];

    this.setFormAddNew(this.jobsTimeUnits);
  }

  showUsePointer() {
    return this.form.get(this.usePointerProperty).value === true;
  }

  save(addNew: boolean) {
    // times and selected registers
    const selectedRegisters = this.registers.getSelectedRowIds();
    this.noRegisters = selectedRegisters.length === 0;
    this.form.get(this.registersProperty).setValue(selectedRegisters);
    this.noMonthDays =
      this.showMonthDays() &&
      this.form.get(this.monthDaysProperty).value !== null &&
      this.form.get(this.monthDaysProperty).value.length === 0;
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
      result => {
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
      () => {} // error
    );
  }

  cancel() {
    this.modal.dismiss();
  }

  changeReadOptionId() {
    this.form.get(this.weekDaysProperty).enable();
    const selectedValuesForTimeProperty = [1, 4, 5, 6];
    this.selectedId = parseInt(this.form.get(this.readOptionsProperty).value, 10);
    this.form
      .get(this.timeProperty)
      .setValidators(_.find(selectedValuesForTimeProperty, x => x === this.selectedId) ? [Validators.required] : []);
    this.form.get(this.nMinutesProperty).setValidators(this.show_nMinutes() ? [Validators.required] : []);
    this.form.get(this.nHoursProperty).setValidators(this.show_nHours() ? [Validators.required] : []);
    this.form.get(this.weekDaysProperty).setValidators(this.showWeekDays() ? [Validators.required] : []);
    this.form.get(this.monthDaysProperty).setValidators(this.showMonthDays() ? [Validators.required] : []);

    if (this.showMonthDays()) {
      const daysSorted = this.monthDays.sort((a, b) => a - b);

      this.noMonthDays = daysSorted.length === 0;
      this.form.get(this.monthDaysProperty).setValue(daysSorted);
    }
  }

  onDayInMonthClick(dayinMonth: number) {
    const result = _.findIndex(this.monthDays, x => x === dayinMonth) > -1 ? true : false;
    if (!result) {
      this.monthDays.push(dayinMonth);
    } else {
      _.remove(this.monthDays, x => x === dayinMonth);
    }
    const daysSorted = this.monthDays.sort((a, b) => a - b);

    this.noMonthDays = daysSorted.length === 0;
    this.form.get(this.monthDaysProperty).setValue(daysSorted);
  }

  isDayInMonthSelected(index: number) {
    for (const dayNo of this.monthDays) {
      if (dayNo === index) {
        return true;
      }
    }
    return false;
  }

  registerSelectionChanged(hasValues: boolean) {
    // console.log('registerSelcetionChanged');
    this.noRegisters = !hasValues;
  }

  // properties - START
  get readOptionsProperty() {
    return nameOf<SchedulerJobForm>(o => o.readOptions);
  }

  get nMinutesProperty() {
    return nameOf<SchedulerJobForm>(o => o.nMinutes);
  }

  show_nMinutes() {
    return this.selectedId === 2;
  }

  get nHoursProperty() {
    return nameOf<SchedulerJobForm>(o => o.nHours);
  }

  show_nHours() {
    return this.selectedId === 3;
  }

  get timeProperty() {
    return nameOf<SchedulerJobForm>(o => o.time);
  }

  get timeForHoursProperty() {
    return nameOf<SchedulerJobForm>(o => o.timeForHours);
  }

  showTime() {
    const idsForTime = [4, 5, 6];
    const found = _.find(idsForTime, x => x === this.selectedId);
    return found !== undefined;
  }

  showDateTime() {
    return this.selectedId === 1;
  }

  get weekDaysProperty() {
    return nameOf<SchedulerJobForm>(o => o.weekDays);
  }

  showWeekDays() {
    return this.selectedId === 5;
  }

  get monthDaysProperty() {
    return nameOf<SchedulerJobForm>(o => o.monthDays);
  }

  showMonthDays() {
    return this.selectedId === 6;
  }

  get registersProperty() {
    return nameOf<SchedulerJobForm>(o => o.registers);
  }

  get iecProperty() {
    return nameOf<SchedulerJobForm>(o => o.iec);
  }

  showIec() {
    return this.selectedId > 1;
  }

  get descriptionProperty() {
    return nameOf<SchedulerJobForm>(o => o.description);
  }

  get usePointerProperty() {
    return nameOf<SchedulerJobForm>(o => o.usePointer);
  }

  get intervalRangeProperty() {
    return nameOf<SchedulerJobForm>(o => o.intervalRange);
  }

  get timeUnitProperty() {
    return nameOf<SchedulerJobForm>(o => o.timeUnit);
  }

  get enableProperty() {
    return nameOf<SchedulerJobForm>(o => o.enable);
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  next(value) {
    if (this.showWeekDays()) {
      this.form.get(this.weekDaysProperty).enable();
    } else {
      this.form.get(this.weekDaysProperty).disable();
    }

    // check form
    this.formUtils.touchElementsAndValidate(this.form);
    if (value > 0 && !this.form.valid) {
      return;
    }
    this.step = this.step + value;
    if (this.step === 2) {
      this.form.get(this.registersProperty).setValidators(Validators.required);
    } else {
      this.form.get(this.registersProperty).clearValidators();
    }
  }
}
