import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@progress/kendo-angular-intl';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Placement } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styles: []
})
export class DateRangePickerComponent implements OnInit {
  @ViewChild('popover') popover;

  @Input() startProperty: string;
  @Input() endProperty: string;
  @Input() form: FormGroup;
  @Input() withButtons = true;
  @Input() withRefreshButton = true;
  @Input() singleCalendar = false;
  @Input() dateOnly = false;
  @Input() withTime = true;
  @Input() popoverPlacement: Placement = 'bottom-left';
  @Input() minDate: Date;
  @Input() setDefaultDate = true; // default date is yesterday
  @Input() withoutYear = false;
  minDateMomentJs;

  format = environment.dateTimeFormat;

  @Output() valueChange = new EventEmitter<void>();

  show = false;
  focused = false;

  errors: string[];

  startDatePlaceholder = this.translate.instant('DAY.SET-START-DATE');
  endDatePlaceholder = this.translate.instant('DAY.SET-END-DATE');

  selectedRange = 2;
  loading = false;

  @ViewChild('anchorTextbox') anchorTextbox: any;

  popup: ElementRef;
  datePickerStart: ElementRef;

  startTime: Date = null;
  endTime: Date = null;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private renderer: Renderer2,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    if (!this.form) {
      throw Error('DateRangePicker - form input missing.');
    }
    if (!this.startProperty) {
      throw Error('DateRangePicker - startProperty input missing.');
    }
    if (!this.endProperty && !this.singleCalendar) {
      throw Error('DateRangePicker - endProperty input missing.');
    }
    if (!this.withTime) {
      this.format = environment.dateFormat;
    }
    if (this.withoutYear) {
      this.format = environment.kendoChartCategoryDateFormats.days;
    }
    if (this.setDefaultDate) {
      this.setRange(2); // yesterday is default behaviour
    }
    if (this.minDate) {
      this.minDateMomentJs = moment(this.minDate);
    }
  }

  setRange(selectedRangeId: number) {
    this.selectedRange = selectedRangeId;

    switch (selectedRangeId) {
      case 1: {
        // today
        this.startTime = moment().set('minute', 0).set('hour', 0).toDate();
        this.endTime = moment().add(1, 'hour').set('minute', 0).toDate();
        break;
      }
      case 2: {
        // yesterday
        this.startTime = moment().subtract(1, 'days').set('minute', 0).set('hour', 0).toDate();
        this.endTime = moment().set('minute', 0).set('hour', 0).toDate();
        break;
      }
      case 3: {
        // Last 7 days
        this.startTime = moment().subtract(6, 'days').set('minute', 0).set('hour', 0).toDate();
        this.endTime = moment().set('minute', 0).set('hour', 0).toDate();
        break;
      }
      case 4: {
        // Last 30 days
        this.startTime = moment().subtract(29, 'days').set('minute', 0).set('hour', 0).toDate();
        this.endTime = moment().set('minute', 0).set('hour', 0).toDate();
        break;
      }
      case 5: {
        // Current month
        this.startTime = moment().startOf('month').set('minute', 0).set('hour', 0).toDate();
        this.endTime = moment().add(1, 'hour').set('minute', 0).toDate();
        break;
      }
      case 6: {
        // Last month
        this.startTime = moment().subtract(1, 'month').startOf('month').toDate();
        this.endTime = moment().startOf('month').set('minute', 0).set('hour', 0).toDate();
        break;
      }
    }

    this.form.get(this.startProperty).patchValue(this.startTime);
    if (!this.singleCalendar) {
      this.form.get(this.endProperty).patchValue(this.endTime);
    }

    if (!this.singleCalendar) {
      this.setDateRangeField();
    }
    this.show = false;
    this.focused = false;
    this.valueChange.emit();
  }

  setDateRangeField() {
    const startTime = this.form.get(this.startProperty).value;
    const endTime = this.form.get(this.endProperty).value;

    const dateRange = `${formatDate(startTime, environment.dateTimeFormat)} - ${formatDate(endTime, environment.dateTimeFormat)}`;
    this.form.patchValue({ dateRange });
  }

  dateChanged() {
    if (this.form.get(this.startProperty)?.hasError('invalidStartDate')) {
      // clear invalid start
      delete this.form.get(this.startProperty).errors['invalidStartDate'];
      this.form.get(this.startProperty).updateValueAndValidity();
    }
    const startTimeField = this.form.get(this.startProperty);

    if (!this.singleCalendar) {
      const endTimeField = this.form.get(this.endProperty);

      if (startTimeField.value < endTimeField.value && startTimeField.valid && endTimeField.valid) {
        this.selectedRange = 7; // not defined
        startTimeField.patchValue(startTimeField.value);
        endTimeField.patchValue(endTimeField.value);
        this.valueChange.emit();
      } else {
        // set invalid start
        this.form.get(this.startProperty).setErrors({ invalidStartDate: true });
        this.form.get(this.startProperty).markAsDirty();
        this.showErrors();
      }
    } else {
      this.valueChange.emit();
    }
  }

  onDateFocus() {
    this.focused = true;
  }

  onDateBlur() {
    this.focused = false;
  }

  showErrors(): boolean {
    this.errors = [];

    if (this.formUtils.shouldInputShowErrors(this.form.get(this.startProperty))) {
      this.errors.push(this.translate.instant('DAY.START-TIME-REQUIRED'));
    }

    if (!this.singleCalendar) {
      if (this.formUtils.shouldInputShowErrors(this.form.get(this.endProperty))) {
        this.errors.push(this.translate.instant('DAY.END-TIME-REQUIRED'));
      }
    }

    return this.errors.length > 0;
  }

  getErrors(): string[] {
    return [this.translate.instant('DAY.FORM-REQUIRED')];
  }

  closePopover(event: number) {
    this.selectedRange = event;
    this.popover.close();
    this.valueChange.emit();
  }

  refreshButtonClickedEvent() {
    if (this.form.valid) {
      this.valueChange.emit();
    }
  }
}
