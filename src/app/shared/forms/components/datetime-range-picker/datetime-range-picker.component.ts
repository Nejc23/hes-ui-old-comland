import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DaterangepickerComponent, LocaleConfig } from 'ngx-daterangepicker-material';

import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-datetime-range-picker',
  templateUrl: './datetime-range-picker.component.html'
})
export class DateTimeRangePickerComponent implements AfterViewInit {
  @ViewChild(DaterangepickerComponent) datePicker: DaterangepickerComponent;

  selected: any = [];
  @Input() withRanges = true;
  @Input() withTime = true;
  @Input() form: FormGroup;

  @Input() initValues = false;

  @Output() formClosed: EventEmitter<boolean> = new EventEmitter();

  today = false;

  locale: LocaleConfig = {
    applyLabel: this.translate.instant('BUTTON.APPLY'),
    customRangeLabel: ' - ',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: moment.localeData().firstDayOfWeek()
  };

  defaultRanges: any = {
    [this.translate.instant('DAY.TODAY')]: [moment(), moment()],
    [this.translate.instant('DAY.YESTERDAY')]: [moment().subtract(1, 'days'), moment()],
    [this.translate.instant('DAY.LAST-7-DAYS')]: [moment().subtract(6, 'days'), moment()],
    [this.translate.instant('DAY.LAST-30-DAYS')]: [moment().subtract(29, 'days'), moment()],
    [this.translate.instant('DAY.CURRENT-MONTH')]: [moment().startOf('month'), moment()],
    [this.translate.instant('DAY.LAST-MONTH')]: [moment().subtract(1, 'month').startOf('month'), moment().startOf('month')]
  };

  constructor(private translate: TranslateService) {
    const locale_id = localStorage.getItem('lang');
    moment.locale(locale_id);
  }

  ngAfterViewInit() {
    if (this.initValues) {
      this.datePicker.setStartDate(this.form.controls.startDate.value);
      this.datePicker.setEndDate(this.form.controls.endDate.value);
      this.form.controls.startTime.setValue(this.form.controls.startTime.value);
      this.form.controls.endTime.setValue(this.form.controls.endTime.value);
      this.datePicker.updateView();
    }
  }

  updateRange(range) {
    if (range.label?.toLowerCase() === this.translate.instant('DAY.TODAY').toLowerCase()) this.today = true;
    if (
      range.label?.toLowerCase() === this.translate.instant('DAY.TODAY').toLowerCase() ||
      range.label?.toLowerCase() === this.translate.instant('DAY.CURRENT-MONTH').toLowerCase()
    ) {
      this.form.controls.endTime.setValue(moment().startOf('hour').format('HH:mm'));
    } else {
      this.form.controls.endTime.setValue('00:00');
    }
    if (this.today) {
      this.checkTimes();
    }
  }

  datesUpdated(range) {
    this.selected = range;
    this.setValues();
  }

  close() {
    this.formClosed.emit(true);
  }

  setValues() {
    this.form.controls.startDate.setValue(this.selected.startDate);
    this.form.controls.endDate.setValue(this.selected.endDate);
    this.setLabel();
    this.datePicker.updateView();
  }

  clear() {
    this.setDefaultDate();
    this.setValues();
  }

  setDefaultDate() {
    this.datePicker.setStartDate(moment().subtract(1, 'days'));
    this.datePicker.setEndDate(moment());
    this.form.controls.startTime.setValue('00:00');
    this.form.controls.endTime.setValue('00:00');
    this.selected = {
      startDate: moment().subtract(1, 'days'),
      endDate: (this.selected.endDate = moment())
    };
    this.datePicker.updateView();
  }

  checkTimes() {
    this.setLabel();
    if (this.today && moment(this.form.controls.startTime.value, 'HH.mm') > moment(this.form.controls.endTime.value, 'HH.mm')) {
      this.form.controls.startTime.setValue(moment(this.form.controls.endTime.value, 'HH.mm').subtract(1, 'hour').format('HH:mm'));
      this.setLabel();
    }
  }

  setLabel() {
    const startDateFormatted = moment(this.form.controls.startDate.value, environment.dateDisplayFormat).format(
      environment.dateDisplayFormat
    );
    const endDateFormatted = moment(this.form.controls.endDate.value, environment.dateDisplayFormat).format(environment.dateDisplayFormat);

    this.form.controls.labelText.setValue(
      startDateFormatted + ' ' + this.form.controls.startTime.value + ' - ' + endDateFormatted + ' ' + this.form.controls.endTime.value
    );
  }
}
