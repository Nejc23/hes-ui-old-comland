import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { formatDate } from '@progress/kendo-angular-intl';
import * as _ from 'lodash';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

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

  @Output() valueChange = new EventEmitter<void>();

  show = false;
  focused = false;

  errors: string[];

  startDatePlaceholder = this.translate.instant('DAY.SET-START-DATE');
  endDatePlaceholder = this.translate.instant('DAY.SET-END-DATE');

  controlId: string;
  selectedRange = 2;
  loading = false;

  @ViewChild('anchorTextbox') anchorTextbox: any;

  popup: ElementRef;
  datePickerStart: ElementRef;
  datePickerEnd: ElementRef;

  startTime: Date = null;
  endTime: Date = null;

  constructor(
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    private renderer: Renderer2,
    private translate: TranslateService
  ) {}

  @ViewChild('popup', { read: ElementRef }) set setPopup(content: ElementRef) {
    if (content) {
      // initially setter gets called with undefined
      this.popup = content;
    }
  }

  @ViewChild('datePickerStart', { read: ElementRef }) set setDatePickerStart(content: ElementRef) {
    if (content) {
      // initially setter gets called with undefined
      this.datePickerStart = content;
    }
  }

  @ViewChild('datePickerEnd', { read: ElementRef }) set setDatePickerEnd(content: ElementRef) {
    if (content) {
      // initially setter gets called with undefined
      this.datePickerEnd = content;
    }
  }

  get format() {
    return environment.dateTimeFormat;
  }

  ngOnInit(): void {
    if (!this.form) {
      throw Error('DateRangePicker - form input missing.');
    }
    if (!this.startProperty) {
      throw Error('DateRangePicker - startProperty input missing.');
    }
    if (!this.endProperty) {
      throw Error('DateRangePicker - endProperty input missing.');
    }

    this.controlId = _.uniqueId('dateRangePicker');

    this.setRange(2); // yesterday is default
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.show = false;
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
    this.form.get(this.endProperty).patchValue(this.endTime);

    this.setDateRangeField();
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
    if (this.form.get(this.startProperty).hasError('invalidStartDate')) {
      // clear invalid start
      delete this.form.get(this.startProperty).errors['invalidStartDate'];
      this.form.get(this.startProperty).updateValueAndValidity();
    }
    const startTimeField = this.form.get(this.startProperty);
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

    if (this.formUtils.shouldInputShowErrors(this.form.get(this.endProperty))) {
      this.errors.push(this.translate.instant('DAY.END-TIME-REQUIRED'));
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

  private contains(target: any): boolean {
    if (!this.show) {
      return false;
    }

    const result = !!(
      this.anchorTextbox?.nativeElement?.contains(target) ||
      this.popup?.nativeElement?.contains(target) ||
      this.datePickerStart?.nativeElement?.contains(target) ||
      this.datePickerEnd?.nativeElement?.contains(target)
    );

    if (result) {
      return result;
    }

    if (target?.classList?.contains && target.classList.contains('k-time-accept')) {
      return true;
    }

    // const datePicker = this.renderer.selectRootElement('.k-datetime-container', true); // second parameter is for preserving content
    const datePicker = document.getElementsByClassName('k-datetime-container');
    if (datePicker.length === 0) {
      return false;
    }
    return datePicker[0]?.contains(target);
  }
}
