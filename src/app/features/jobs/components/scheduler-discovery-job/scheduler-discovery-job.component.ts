import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';
import * as _ from 'lodash';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { SchedulerJob, SchedulerJobForm } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { DataConcentratorUnitsSelectComponent } from 'src/app/features/data-concentrator-units-select/component/data-concentrator-units-select.component';
import { DataConcentratorUnitsSelectGridService } from 'src/app/features/data-concentrator-units-select/services/data-concentrator-units-select-grid.service';
import { PlcMeterReadScheduleService } from 'src/app/features/meter-units/common/services/plc-meter-read-scheduler.service';

@Component({
  selector: 'app-scheduler-discovery-job',
  templateUrl: './scheduler-discovery-job.component.html',
})
export class SchedulerDiscoveryJobComponent implements OnInit {
  @ViewChild(DataConcentratorUnitsSelectComponent) listOfDCUs: DataConcentratorUnitsSelectComponent;
  @Input() selectedJobId: string;
  @Input() deviceFiltersAndSearch: GridBulkActionRequestParams;

  form: FormGroup;
  readOptions: RadioOption[] = [
    { value: '1' as string, label: $localize`One-time`, labelSmall: $localize`Once` },
    { value: '2' as string, label: $localize`Minute(s)`, labelSmall: $localize`Every N minute(s)` },
    { value: '3' as string, label: $localize`Hour(s)`, labelSmall: $localize`Every N hour(s)` },
    { value: '4' as string, label: $localize`Daily`, labelSmall: $localize`Every day specific time` },
    { value: '5' as string, label: $localize`Weekly`, labelSmall: $localize`One or more days of the week` },
    { value: '6' as string, label: $localize`Monthly`, labelSmall: $localize`One or more days in the month` },
  ];
  weekDays: Codelist<number>[] = [
    { id: 1, value: $localize`Mon-Fri` },
    { id: 2, value: $localize`Mon` },
    { id: 3, value: $localize`Tue` },
    { id: 4, value: $localize`Wed` },
    { id: 5, value: $localize`Thu` },
    { id: 6, value: $localize`Fri` },
    { id: 7, value: $localize`Sat` },
    { id: 8, value: $localize`Sun` },
  ];
  selectedId = 0;
  monthDays: number[] = [];
  noDCUs = false;
  noMonthDays = false;
  requiredText = $localize`Required field`;
  step = 1;

  constructor(
    private meterService: PlcMeterReadScheduleService,
    private codelistService: CodelistRepositoryService,
    private jobsService: JobsService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private modal: NgbActiveModal,
    private dataConcentratorUnitsSelectGridService: DataConcentratorUnitsSelectGridService
  ) {}

  createForm(formData: SchedulerJob): FormGroup {
    return this.formBuilder.group({
      [this.readOptionsProperty]: [formData ? formData.readOptions?.toString() : '1', Validators.required],
      [this.nMinutesProperty]: [formData ? formData.nMinutes : null],
      [this.nHoursProperty]: [formData ? formData.nHours : null],
      [this.timeProperty]: [formData && formData.dateTime ? moment(formData.dateTime).toDate() : null],
      [this.timeForHoursProperty]: [formData && formData.dateTime ? moment(formData.dateTime).toDate() : ''],
      [this.weekDaysProperty]: [formData && formData.weekDays ? formData.weekDays : []],
      [this.monthDaysProperty]: [formData && formData.monthDays ? formData.monthDays : []],
      [this.registersProperty]: [formData ? formData.registers : [], Validators.required],
      [this.descriptionProperty]: [formData ? formData.description : null, [Validators.maxLength(500), Validators.required]],
      [this.enableProperty]: [formData ? formData.enable : true],
    });
  }

  ngOnInit() {}

  setFormEdit(selectedJobId: string, job: SchedulerJob) {
    this.selectedJobId = selectedJobId;
    this.selectedId = job.readOptions;
    this.monthDays = job.monthDays;

    if (job.readOptions === 0) {
      job.readOptions = null;
    }
    this.form = this.createForm(job);

    // fill session with selected importTemplates
    this.dataConcentratorUnitsSelectGridService.setSessionSettingsSearchedText(null);
    this.dataConcentratorUnitsSelectGridService.setSessionSettingsSelectedRowsById(job.bulkActionsRequestParam?.id);

    this.changeReadOptionId();
    this.form.get(this.registersProperty).clearValidators();
  }

  setFormAddNew() {
    this.dataConcentratorUnitsSelectGridService.setSessionSettingsSearchedText(null);
    this.dataConcentratorUnitsSelectGridService.setSessionSettingsSelectedRowsById(null);

    this.form = this.createForm(null);
    this.changeReadOptionId();
    this.form.get(this.registersProperty).clearValidators();
  }

  fillData(): SchedulerJobForm {
    const ids = this.form.get(this.registersProperty).value;
    if (ids != null) {
      const concentrList: string[] = ids;
      this.deviceFiltersAndSearch = {
        id: concentrList,
      };
    }

    let time: string = null;

    if (this.show_nHours()) {
      time = this.form.get(this.timeForHoursProperty).value;
      if (!time) {
        time = null;
      }
    } else {
      time = this.form.get(this.timeProperty).value;
      if (time === null) {
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
      registers: null,
      iec: false,
      description: this.form.get(this.descriptionProperty).value,
      dateTime: time,
      bulkActionsRequestParam: this.deviceFiltersAndSearch,
      usePointer: false,
      intervalRange: 0,
      timeUnit: 0,
      actionType: 1,
      enable: this.form.get(this.enableProperty).value,
    };

    return formData;
  }

  resetAll() {
    this.selectedJobId = null;
    this.step = 1;
    this.monthDays = [];

    this.setFormAddNew();
  }

  save(addNew: boolean) {
    console.log('im in save', this.selectedJobId);
    const selectedData = this.listOfDCUs.getSelectedRowIds();
    this.noDCUs = selectedData.length === 0;

    this.form.get(this.registersProperty).setValue(selectedData);
    this.noMonthDays = this.form.get(this.monthDaysProperty).value !== null && this.form.get(this.monthDaysProperty).value.length === 0;
    const values = this.fillData();
    let request: Observable<SchedulerJob> = null;
    let operation = $localize`added`;
    if (this.selectedJobId) {
      operation = $localize`updated`;
      request = this.meterService.updateMeterUnitsReadScheduler(values, this.selectedJobId);
    } else {
      request = this.meterService.createMeterUnitsReadScheduler(values);
    }
    const successMessage = $localize`Data Concentrator Discovery Scheduler was` + ` ${operation} ` + $localize`successfully`;
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      (result) => {
        if (addNew) {
          this.resetAll();
        } else {
          this.modal.close();
        }
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
      .setValidators(_.find(selectedValuesForTimeProperty, (x) => x === this.selectedId) ? [Validators.required] : []);
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
    const result = _.findIndex(this.monthDays, (x) => x === dayinMonth) > -1 ? true : false;
    if (!result) {
      this.monthDays.push(dayinMonth);
    } else {
      _.remove(this.monthDays, (x) => x === dayinMonth);
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

  selectionChanged(hasValues: boolean) {
    this.noDCUs = !hasValues;
  }

  // properties - START
  get readOptionsProperty() {
    return nameOf<SchedulerJobForm>((o) => o.readOptions);
  }

  get nMinutesProperty() {
    return nameOf<SchedulerJobForm>((o) => o.nMinutes);
  }

  show_nMinutes() {
    return this.selectedId === 2;
  }

  get nHoursProperty() {
    return nameOf<SchedulerJobForm>((o) => o.nHours);
  }

  show_nHours() {
    return this.selectedId === 3;
  }

  get timeProperty() {
    return nameOf<SchedulerJobForm>((o) => o.time);
  }

  get timeForHoursProperty() {
    return nameOf<SchedulerJobForm>((o) => o.timeForHours);
  }

  showTime() {
    const idsForTime = [4, 5, 6];
    const found = _.find(idsForTime, (x) => x === this.selectedId);
    return found !== undefined;
  }

  showDateTime() {
    return this.selectedId === 1;
  }

  get weekDaysProperty() {
    return nameOf<SchedulerJobForm>((o) => o.weekDays);
  }

  showWeekDays() {
    return this.selectedId === 5;
  }

  get monthDaysProperty() {
    return nameOf<SchedulerJobForm>((o) => o.monthDays);
  }

  showMonthDays() {
    return this.selectedId === 6;
  }

  get registersProperty() {
    return nameOf<SchedulerJobForm>((o) => o.registers);
  }

  get descriptionProperty() {
    return nameOf<SchedulerJobForm>((o) => o.description);
  }

  get enableProperty() {
    return nameOf<SchedulerJobForm>((o) => o.enable);
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

    console.log('im in next', this.form);
    if (value > 0 && !this.form.valid) {
      return;
    }

    // check form
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
