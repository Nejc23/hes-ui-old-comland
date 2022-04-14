import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DaterangepickerComponent, LocaleConfig } from 'ngx-daterangepicker-material';

import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-datetime-range-picker',
  templateUrl: './datetime-range-picker.component.html'
})
export class DateTimeRangePickerComponent implements AfterViewInit {
  @ViewChild(DaterangepickerComponent) datePicker: DaterangepickerComponent;

  selected: any = [];
  @Input() withRanges = true;
  @Input() withTime = true;
  @Input() form: FormGroup; // startDate - endDate
  @Input() singleCalendar = false;
  @Input() initValues = false;
  @Input() minDate;
  @Input() maxDate;

  initDateFrom;
  initDateTo;

  selectedRange = 2; // yesterday
  isRange = false;
  @Output() formClosed: EventEmitter<number> = new EventEmitter(); // selected range

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
    if (this.initValues && this.form.controls.startDate.valid && this.form.controls.endDate.valid) {
      this.datePicker.setStartDate((this.initDateFrom = this.form.controls.startDate.value));
      this.datePicker.setEndDate((this.initDateTo = this.form.controls.endDate.value));

      if (this.withTime) {
        this.form.controls.startTime.setValue(
          moment()
            .set('hour', this.form.controls.startDate.value.getHours())
            .set('minute', this.form.controls.startDate.value.getMinutes())
            .format('HH:mm')
        );
        this.form.controls.endTime.setValue(
          moment()
            .set('hour', this.form.controls.endDate.value.getHours())
            .set('minute', this.form.controls.endDate.value.getMinutes())
            .format('HH:mm')
        );
      }
      this.datePicker.updateView();
    }
    if (this.form.controls?.startDate?.errors?.minError) {
      this.form.controls.startDate.setValue(this.minDate.toDate());
      this.form.controls.endDate.setValue(this.maxDate.toDate());
      this.datePicker.updateView();
    }
  }

  updateRange(range) {
    this.isRange = true;
    this.form.controls.endTime.setValue('00:00');
    this.form.controls.startTime.setValue('00:00');
    switch (range.label.toLowerCase()) {
      case this.translate.instant('DAY.TODAY').toLowerCase():
        this.today = true;
        this.form.controls.endTime.setValue(moment().add(1, 'hour').set('minute', 0).format('HH:mm'));
        this.selectedRange = 1;
        break;
      case this.translate.instant('DAY.YESTERDAY').toLowerCase():
        this.selectedRange = 2;
        break;
      case this.translate.instant('DAY.LAST-7-DAYS').toLowerCase():
        this.selectedRange = 3;
        break;
      case this.translate.instant('DAY.LAST-30-DAYS').toLowerCase():
        this.selectedRange = 4;
        break;
      case this.translate.instant('DAY.CURRENT-MONTH').toLowerCase():
        this.form.controls.endTime.setValue(moment().add(1, 'hour').set('minute', 0).format('HH:mm'));
        this.selectedRange = 5;
        break;
      case this.translate.instant('DAY.LAST-MONTH').toLowerCase():
        this.selectedRange = 6;
        break;
    }
    this.setTime();
  }

  datesUpdated(range) {
    if (!this.isRange) {
      this.selectedRange = 7;
    }
    this.selected = range;
    this.setValues();
    this.isRange = false;
    if (this.singleCalendar) {
      this.formClosed.emit(this.selectedRange);
    }
  }

  close() {
    this.formClosed.emit(this.selectedRange);
  }

  setValues() {
    this.form.controls.startDate.setValue(this.selected.startDate.toDate()); // toDate() due to kendoUi input
    this.form.controls.endDate.setValue(this.selected.endDate.toDate());
    if (this.withTime) {
      this.setTime();
    }
    this.datePicker.updateView();
  }

  clear() {
    this.setDefaultDate();
  }

  setDefaultDate() {
    this.datePicker.setStartDate(this.initDateFrom);
    this.datePicker.setEndDate(this.initDateTo);
    this.selected = {
      startDate: this.initDateFrom,
      endDate: this.initDateTo
    };
    this.datePicker.updateView();
  }

  setTime() {
    if (this.today && moment(this.form.controls.startTime.value, 'HH.mm') > moment(this.form.controls.endTime.value, 'HH.mm')) {
      this.form.controls.startTime.setValue(moment(this.form.controls.endTime.value, 'HH.mm').subtract(1, 'hour').format('HH:mm'));
    }
    this.form.controls.startDate.setValue(
      moment(this.form.controls.startDate.value)
        .set('hour', this.form.controls.startTime.value.split(':')[0])
        .set('minute', this.form.controls.startTime.value.split(':')[1])
        .set('seconds', 0)
        .toDate()
    );
    this.form.controls.endDate.setValue(
      moment(this.form.controls.endDate.value)
        .set('hour', this.form.controls.endTime.value.split(':')[0])
        .set('minute', this.form.controls.endTime.value.split(':')[1])
        .set('seconds', 0)
        .toDate()
    );
    console.log(this.form.controls.startDate.value + ' - ' + this.form.controls.endDate.value);
  }
}
