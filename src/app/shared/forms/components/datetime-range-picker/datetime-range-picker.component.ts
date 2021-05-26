import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit, Inject, LOCALE_ID } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DaterangepickerComponent, LocaleConfig } from 'ngx-daterangepicker-material';
import { dateDisplayFormat } from '../../consts/date-format';

import * as moment from 'moment';

@Component({
  selector: 'app-datetime-range-picker',
  templateUrl: './datetime-range-picker.component.html'
})
export class DateTimeRangePickerComponent implements AfterViewInit {
  @ViewChild(DaterangepickerComponent) datePicker: DaterangepickerComponent;

  selected: any;
  @Input() withRanges = true;
  @Input() withTime = true;
  @Input() form: FormGroup;
  @Output() formClosed: EventEmitter<boolean> = new EventEmitter();

  today = false;

  locale: LocaleConfig = {
    applyLabel: $localize`Apply`,
    customRangeLabel: ' - ',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: moment.localeData().firstDayOfWeek()
  };

  defaultRanges: any = {
    [$localize`Today`]: [moment(), moment()],
    [$localize`Yesterday`]: [moment().subtract(1, 'days'), moment()],
    [$localize`Last 7 Days`]: [moment().subtract(6, 'days'), moment()],
    [$localize`Last 30 Days`]: [moment().subtract(29, 'days'), moment()],
    [$localize`This Month`]: [moment().startOf('month'), moment()],
    [$localize`Last Month`]: [moment().subtract(1, 'month').startOf('month'), moment().startOf('month')]
  };

  constructor(@Inject(LOCALE_ID) public locale_id: string) {
    moment.locale(locale_id);
  }

  ngAfterViewInit() {
    this.setDefaultDate();
  }

  updateRange(range) {
    if (
      range.label?.toLowerCase() === $localize`Today`.toLowerCase() ||
      range.label?.toLowerCase() === $localize`This Month`.toLowerCase()
    ) {
      this.form.controls.endTime.setValue(moment().startOf('hour').format('HH:mm'));
    } else {
      this.form.controls.endTime.setValue('00:00');
    }
  }

  datesUpdated(range) {
    this.selected = range;
    this.setValues();
  }

  save() {
    this.formClosed.emit(true);
  }

  setValues() {
    this.form.controls.startDate.setValue(this.selected.startDate);
    this.form.controls.endDate.setValue(this.selected.endDate);

    let startDateFormatted = moment(this.form.controls.startDate.value, dateDisplayFormat).format(dateDisplayFormat);
    let endDateFormatted = moment(this.form.controls.endDate.value, dateDisplayFormat).format(dateDisplayFormat);

    this.form.controls.labelText.setValue(
      startDateFormatted + ' ' + this.form.controls.startTime.value + ' - ' + endDateFormatted + ' ' + this.form.controls.endTime.value
    );
    this.datePicker.updateView();
  }

  clear() {
    this.setDefaultDate();
    this.form.controls.startTime.setValue('00:00');
  }

  setDefaultDate() {
    this.datePicker.setStartDate(moment().subtract(1, 'days'));
    this.datePicker.setEndDate(moment());
    this.datePicker.updateView();
  }
}
