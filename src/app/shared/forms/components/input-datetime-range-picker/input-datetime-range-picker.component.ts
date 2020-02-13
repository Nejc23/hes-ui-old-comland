import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { DateTimeRange } from '../../interfaces/date-time-range.interface';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-input-datetime-range-picker',
  templateUrl: './input-datetime-range-picker.component.html'
})
export class InputDateTimeRangePickerComponent implements OnInit {
  // Required
  @Input() form: FormGroup;
  @Input() property: string;
  // Optional
  @Input() label: string;

  @Output() dateSelect = new EventEmitter();

  // daterange picker START
  options: any = {
    autoApply: false,
    alwaysShowCalendars: true,
    keepCalendarOpeningWithRange: true,
    showRangeLabelOnInput: false,
    showCancel: false,
    showClearButton: true,
    linkedCalendars: true,
    singleDatePicker: true,
    showWeekNumbers: false,
    showISOWeekNumbers: false,
    customRangeDirection: false,
    lockStartDate: false,
    closeOnAutoApply: true,
    timePicker24Hour: !environment.dateTimeFormat.toLowerCase().endsWith('hh:mm a')
  };
  minDate: moment.Moment = moment().subtract(5, 'days');
  maxDate: moment.Moment = moment().add(2, 'month');
  locale: any = {
    format: environment.dateTimeFormat,
    displayFormat: environment.dateTimeFormat,
    separator: ' - ',
    cancelLabel: this.i18n(`Cancel`),
    applyLabel: this.i18n(`Ok`)
  };
  opens: string;
  drops: string;
  timePicker: boolean;
  dateLimit: number;

  ranges: any = {
    Today: [moment().startOf('day'), moment().endOf('day')],
    Yesterday: [
      moment()
        .subtract(1, 'days')
        .startOf('day'),
      moment()
        .subtract(1, 'days')
        .endOf('day')
    ],
    'Last 7 Days': [
      moment()
        .subtract(6, 'days')
        .startOf('day'),
      moment().endOf('day')
    ]
  };

  selected: DateTimeRange = { startDate: moment().startOf('day'), endDate: moment().endOf('day'), error: null };
  // daterange picker END

  constructor(private formUtils: FormsUtilsService, private i18n: I18n) {
    // daterange picker START
    this.timePicker = false;
    this.opens = 'right';
    this.drops = 'down';
    this.dateLimit = 30;
    // daterange picker END
  }

  ngOnInit() {
    if (!this.form) {
      throw Error(this.i18n(`InputDateTimeRangePickerComponent - form input missing.`));
    }
    if (!this.property) {
      throw Error(this.i18n(`InputDateTimeRangePickerComponent - property input missing.`));
    }
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }

  get required(): boolean {
    return this.formUtils.hasFormControlRequiredField(this.formControl);
  }

  ngModelChange(model): void {
    if (model !== undefined && (model.startDate === null || model.endDate === null)) {
      model.error = { required: true };
    }
    this.dateSelect.emit(model);
  }

  showErrors(): boolean {
    return this.formUtils.shouldInputShowErrors(this.formControl);
  }
}
