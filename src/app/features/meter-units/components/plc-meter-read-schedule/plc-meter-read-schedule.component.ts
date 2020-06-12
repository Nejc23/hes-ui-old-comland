import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';
import * as _ from 'lodash';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import {
  MeterUnitsReadSchedule,
  MeterUnitsReadScheduleForm
} from 'src/app/core/repository/interfaces/meter-units/meter-units-read-schedule.interface';
import { RegistersSelectComponent } from 'src/app/features/registers-select/component/registers-select.component';
import { MeterUnitsTypeGridService } from '../../types/services/meter-units-type-grid.service';
import { PlcMeterReadScheduleGridService } from '../../services/plc-meter-read-schedule-grid.service';
import { PlcMeterReadScheduleService } from '../../services/plc-meter-read-scheduler.service';
import { from, of, Observable } from 'rxjs';
import * as moment from 'moment';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { List } from 'lodash';

@Component({
  selector: 'app-plc-meter-read-schedule',
  templateUrl: './plc-meter-read-schedule.component.html'
})
export class PlcMeterReadScheduleComponent implements OnInit {
  @ViewChild(RegistersSelectComponent, { static: true }) registers;

  form: FormGroup;
  readOptions: RadioOption[] = [
    { value: 1 as number, label: this.i18n('One-time'), labelSmall: this.i18n('Once') },
    { value: 2 as number, label: this.i18n('Minute(s)'), labelSmall: this.i18n('Every N minute(s)') },
    { value: 3 as number, label: this.i18n('Hour(s)'), labelSmall: this.i18n('Every N hour(s)') },
    { value: 4 as number, label: this.i18n('Daily'), labelSmall: this.i18n('Every day specific time') },
    { value: 5 as number, label: this.i18n('Weekly'), labelSmall: this.i18n('One or more days of the week') },
    { value: 6 as number, label: this.i18n('Monthly'), labelSmall: this.i18n('One or more days in the month') }
  ];
  weekDays: Codelist<number>[] = [
    { id: 1, value: this.i18n('Mon-Fri') },
    { id: 2, value: this.i18n('Mon') },
    { id: 3, value: this.i18n('Tue') },
    { id: 4, value: this.i18n('Wed') },
    { id: 5, value: this.i18n('Thu') },
    { id: 6, value: this.i18n('Fri') },
    { id: 7, value: this.i18n('Sat') },
    { id: 8, value: this.i18n('Sun') }
  ];
  selectedId = 0;
  monthDays: number[] = [];
  noRegisters = false;
  noMonthDays = false;
  registersRequiredText = this.i18n('Required field');

  jobsTimeUnits$: Observable<Codelist<number>[]>;

  constructor(
    private meterService: PlcMeterReadScheduleService,
    private plcMeterReadScheduleGridService: PlcMeterReadScheduleGridService,
    private codelistService: CodelistRepositoryService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    public i18n: I18n,
    private modal: NgbActiveModal
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.readOptionsProperty]: [null, Validators.required],
      [this.nMinutesProperty]: [null],
      [this.nHoursProperty]: [null],
      [this.timeProperty]: [new Date()],
      [this.weekDaysProperty]: [[]],
      [this.monthDaysProperty]: [[]],
      [this.registersProperty]: [[], Validators.required],
      [this.iecProperty]: [false],
      [this.descriptionProperty]: [null, Validators.maxLength(500)],
      [this.usePointerProperty]: [false],
      [this.intervalRangeProperty]: [null],
      [this.timeUnitProperty]: [null]
    });
  }

  ngOnInit() {
    this.jobsTimeUnits$ = this.codelistService.timeUnitCodeslist();
  }

  fillData(): MeterUnitsReadScheduleForm {
    console.log('MeterUnitsReadScheduleForm', this.form.get(this.timeUnitProperty).value);
    const formData: MeterUnitsReadScheduleForm = {
      readOptions: parseInt(this.form.get(this.readOptionsProperty).value, 10),
      nMinutes: this.show_nMinutes() ? parseInt(this.form.get(this.nMinutesProperty).value, 10) : 0,
      nHours: this.show_nHours() ? parseInt(this.form.get(this.nHoursProperty).value, 10) : 0,
      time: this.showTime() ? this.form.get(this.timeProperty).value : null,
      weekDays: this.showWeekDays() ? this.form.get(this.weekDaysProperty).value : [],
      monthDays: this.showMonthDays() ? this.form.get(this.monthDaysProperty).value : [],
      registers: this.form.get(this.registersProperty).value,
      iec: this.form.get(this.iecProperty).value,
      description: this.form.get(this.descriptionProperty).value,
      dateTime: this.showDateTime() ? this.form.get(this.timeProperty).value : null,
      bulkActionsRequestParam: this.plcMeterReadScheduleGridService.getSelectedRowsOrFilters(),
      usePointer: this.form.get(this.usePointerProperty).value,
      intervalRange:
        this.form.get(this.intervalRangeProperty).value !== null ? parseInt(this.form.get(this.intervalRangeProperty).value, 10) : 0,
      timeUnit:
        this.form.get(this.timeUnitProperty).value !== null ? (this.form.get(this.timeUnitProperty).value as Codelist<number>).id : 0
    };

    return formData;
  }

  resetAll() {
    this.form.reset();
    this.monthDays = [];
    this.registers.deselectAllRows();
    this.selectedId = 0;
  }

  save(addNew: boolean) {
    // console.log('Save clicked!');
    // times and selected registers
    const selectedRegisters = this.registers.getSelectedRowIds();
    this.noRegisters = selectedRegisters.length === 0;
    // console.log(JSON.stringify(selectedRegisters));
    this.form.get(this.registersProperty).setValue(selectedRegisters);
    this.noMonthDays = this.form.get(this.monthDaysProperty).value !== null && this.form.get(this.monthDaysProperty).value.length === 0;
    const values = this.fillData();
    // console.log(`selectedId = ${this.selectedId}, values = ${JSON.stringify(values)}`);
    // console.log(values);
    const request = this.meterService.createMeterUnitsReadScheduler(values);
    // console.log(`request = ${JSON.stringify(request)}`);
    const successMessage = this.i18n(`Meter Units Read Scheduler was added successfully`);
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
        // if (result) {
        // console.log(`result.time + date = ${moment(values.time).format(moment.HTML5_FMT.DATE)}T${result.time}:00.000Z`);
        if (addNew) {
          this.resetAll();
        } else {
          this.cancel();
        }
        // }
      },
      () => {} // error
    );
  }

  cancel() {
    this.modal.close();
  }

  changeReadOptionId() {
    const selectedValuesForTimeProperty = [1, 4, 5, 6];
    this.selectedId = parseInt(this.form.get(this.readOptionsProperty).value, 10);
    this.form
      .get(this.timeProperty)
      .setValidators(_.find(selectedValuesForTimeProperty, x => x === this.selectedId) ? [Validators.required] : []);
    this.form.get(this.nMinutesProperty).setValidators(this.selectedId === 2 ? [Validators.required] : []);
    this.form.get(this.nHoursProperty).setValidators(this.selectedId === 3 ? [Validators.required] : []);
    this.form.get(this.weekDaysProperty).setValidators(this.selectedId === 5 ? [Validators.required] : []);
    this.form.get(this.monthDaysProperty).setValidators(this.selectedId === 6 ? [Validators.required] : []);
    // console.log(`changeReadOptionId = ${this.form.get(this.readOptionsProperty).value}`);
  }

  onDayInMonthClick(dayinMonth: number) {
    const result = _.find(this.monthDays, x => x === dayinMonth) ? true : false;
    if (!result) {
      this.monthDays.push(dayinMonth);
    } else {
      _.remove(this.monthDays, x => x === dayinMonth);
    }
    const realMonthDays = this.monthDays.map(day => (day = day + 1));
    const daysSorted = realMonthDays.sort((a, b) => a - b);
    this.noMonthDays = daysSorted.length === 0;
    this.form.get(this.monthDaysProperty).setValue(daysSorted);
  }

  isDayInMonthSelected(index: number) {
    let isChecked = false;
    for (const dayNo of this.monthDays) {
      if (dayNo === index) {
        isChecked = true;
      }
    }
    return isChecked;
  }

  registerSelectionChanged(hasValues: boolean) {
    // console.log('registerSelcetionChanged');
    this.noRegisters = !hasValues;
  }

  // properties - START
  get readOptionsProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.readOptions);
  }

  get nMinutesProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.nMinutes);
  }

  show_nMinutes() {
    return this.selectedId === 2;
  }

  get nHoursProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.nHours);
  }

  show_nHours() {
    return this.selectedId === 3;
  }

  get timeProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.time);
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
    return nameOf<MeterUnitsReadScheduleForm>(o => o.weekDays);
  }

  showWeekDays() {
    return this.selectedId === 5;
  }

  get monthDaysProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.monthDays);
  }

  showMonthDays() {
    return this.selectedId === 6;
  }

  get registersProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.registers);
  }

  get iecProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.iec);
  }

  showIec() {
    return this.selectedId > 1;
  }

  get descriptionProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.description);
  }

  get usePointerProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.usePointer);
  }

  get intervalRangeProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.intervalRange);
  }

  get timeUnitProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.timeUnit);
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }
}
