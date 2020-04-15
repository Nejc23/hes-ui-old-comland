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
import { from, of } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-plc-meter-read-schedule',
  templateUrl: './plc-meter-read-schedule.component.html'
})
export class PlcMeterReadScheduleComponent implements OnInit {
  @ViewChild(RegistersSelectComponent, { static: true }) registers;

  form: FormGroup;
  readOptions: RadioOption[] = [
    { value: 1 as number, label: this.i18n('Minute(s)'), labelSmall: this.i18n('Every N minute(s)') },
    { value: 2 as number, label: this.i18n('Hour(s)'), labelSmall: this.i18n('Every N hour(s)') },
    { value: 3 as number, label: this.i18n('Daily'), labelSmall: this.i18n('Every day specific time') },
    { value: 4 as number, label: this.i18n('Weekly'), labelSmall: this.i18n('One or more days of the week') },
    { value: 5 as number, label: this.i18n('Monthly'), labelSmall: this.i18n('One or more days in the month') }
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

  constructor(
    private meterService: PlcMeterReadScheduleService,
    private plcMeterReadScheduleGridService: PlcMeterReadScheduleGridService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    public i18n: I18n,
    private modal: NgbActiveModal
  ) {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.readOptionsProperty]: [0, Validators.required],
      [this.nMinutesProperty]: [0],
      [this.nHoursProperty]: [0],
      [this.timeProperty]: [new Date()],
      [this.weekDaysProperty]: [[]],
      [this.monthDaysProperty]: [[]],
      [this.registersProperty]: [[]]
    });
  }

  ngOnInit() {}

  fillData(): MeterUnitsReadScheduleForm {
    const formData: MeterUnitsReadScheduleForm = {
      readOptions: parseInt(this.form.get(this.readOptionsProperty).value, 10),
      nMinutes: this.selectedId !== 1 ? 0 : parseInt(this.form.get(this.nMinutesProperty).value, 10),
      nHours: this.selectedId !== 2 ? 0 : parseInt(this.form.get(this.nHoursProperty).value, 10),
      time: this.selectedId < 3 ? null : this.form.get(this.timeProperty).value,
      weekDays: this.selectedId !== 4 ? [] : this.form.get(this.weekDaysProperty).value,
      monthDays: this.selectedId !== 5 ? [] : this.form.get(this.monthDaysProperty).value,
      registers: this.form.get(this.registersProperty).value,
      bulkActionsRequestParam: this.plcMeterReadScheduleGridService.getSelectedRowsOrFilters()
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
    // console.log(JSON.stringify(selectedRegisters));
    this.form.get(this.registersProperty).setValue(selectedRegisters);
    const values = this.fillData();
    // console.log(`selectedId = ${this.selectedId}, values = ${JSON.stringify(values)}`);
    const request = this.meterService.createMeterUnitsReadScheduler(values);
    // console.log(`request = ${JSON.stringify(request)}`);
    const successMessage = this.i18n(`Meter Units Read Scheduler was added successfully`);
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
        if (result) {
          // console.log(`result.time + date = ${moment(values.time).format(moment.HTML5_FMT.DATE)}T${result.time}:00.000Z`);
          if (addNew) {
            this.resetAll();
          } else {
            this.cancel();
          }
        }
      },
      () => {} // error
    );
  }

  cancel() {
    this.modal.close();
  }

  changeReadOptionId() {
    this.selectedId = parseInt(this.form.get(this.readOptionsProperty).value, 10);
    // console.log(`changeReadOptionId = ${this.form.get(this.readOptionsProperty).value}`);
  }

  onDayInMonthClick(dayinMonth: number) {
    const result = _.find(this.monthDays, dayinMonth) ? true : false;
    if (!result) {
      this.monthDays.push(dayinMonth);
    } else {
      _.remove(this.monthDays, dayinMonth);
    }
    // console.log(`day in month clicked = ${dayinMonth}`)

    const realMonthDays = this.monthDays.map(day => (day = day + 1));
    this.form.get(this.monthDaysProperty).setValue(realMonthDays);
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

  // properties - START
  get readOptionsProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.readOptions);
  }

  get nMinutesProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.nMinutes);
  }

  get nHoursProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.nHours);
  }

  get timeProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.time);
  }

  get weekDaysProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.weekDays);
  }

  get monthDaysProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.monthDays);
  }

  get registersProperty() {
    return nameOf<MeterUnitsReadScheduleForm>(o => o.registers);
  }
  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }
}
