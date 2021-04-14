import { Component, OnInit, HostListener, ElementRef, ViewChild, Renderer2, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { formatDate } from '@progress/kendo-angular-intl';
import * as _ from 'lodash';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styles: []
})
export class DateRangePickerComponent implements OnInit {
  @Input() startProperty: string;
  @Input() endProperty: string;
  @Input() form: FormGroup;

  @Output() valueChange = new EventEmitter<void>();

  show = false;
  focused = false;

  popupWidth: string;
  errors: string[];

  startDatePlaceholder = $localize`set start date`;
  endDatePlaceholder = $localize`set end date`;

  controlId: string;

  @ViewChild('anchorTextbox') anchorTextbox: any;

  popup: ElementRef;
  @ViewChild('popup', { read: ElementRef }) set setPopup(content: ElementRef) {
    if (content) {
      // initially setter gets called with undefined
      this.popup = content;
    }
  }

  datePickerStart: ElementRef;
  @ViewChild('datePickerStart', { read: ElementRef }) set setDatePickerStart(content: ElementRef) {
    if (content) {
      // initially setter gets called with undefined
      this.datePickerStart = content;
    }
  }

  datePickerEnd: ElementRef;
  @ViewChild('datePickerEnd', { read: ElementRef }) set setDatePickerEnd(content: ElementRef) {
    if (content) {
      // initially setter gets called with undefined
      this.datePickerEnd = content;
    }
  }

  constructor(private formBuilder: FormBuilder, private formUtils: FormsUtilsService, private renderer: Renderer2) {}

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

    this.setRange(1); // today is default
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (!this.contains(event.target)) {
      this.show = false;
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

  togglePopup() {
    this.show = !this.show;
    // contentWidth exact as anchor
    if (this.show) {
      this.focused = true;
      const anchorWidth = this.anchorTextbox?.nativeElement?.clientWidth;
      if (anchorWidth) {
        this.popupWidth = anchorWidth + 2 + 'px'; // 2px is for border
      }
    } else {
      this.focused = false;
    }
  }

  setRange(selectedRangeId: number) {
    const date = new Date();

    let startTime: Date = null;
    let endTime: Date = null;

    switch (selectedRangeId) {
      case 1: {
        // today
        startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        break;
      }
      case 2: {
        // yesterday
        (startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1)),
          (endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0));
        break;
      }
      case 3: {
        // Last 7 days
        startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
        endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0);
        break;
      }
      case 4: {
        // Last 30 days
        startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 30);
        endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0);
        break;
      }
      case 5: {
        // Current month
        startTime = new Date(date.getFullYear(), date.getMonth(), 1);
        endTime = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        break;
      }
      case 6: {
        // Last month
        startTime = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        endTime = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0);
        break;
      }
    }

    this.form.get(this.startProperty).patchValue(startTime);
    this.form.get(this.endProperty).patchValue(endTime);

    this.setDateRangeField();
    this.show = false;
    this.focused = false;
    this.valueChange.emit();
    // this.showData(this.selectedRegister);
  }

  setDateRangeField() {
    const startTime = this.form.get(this.startProperty).value;
    const endTime = this.form.get(this.endProperty).value;

    const dateRange = `${formatDate(startTime, environment.dateTimeFormat)} - ${formatDate(endTime, environment.dateTimeFormat)}`;
    this.form.patchValue({ dateRange });
  }

  dateChanged() {
    const startTimeField = this.form.get(this.startProperty);
    const endTimeField = this.form.get(this.endProperty);

    startTimeField.patchValue(startTimeField.value);
    endTimeField.patchValue(endTimeField.value);

    this.valueChange.emit();
  }

  get format() {
    return environment.dateTimeFormat;
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
      this.errors.push($localize`Start time is required.`);
    }

    if (this.formUtils.shouldInputShowErrors(this.form.get(this.endProperty))) {
      this.errors.push($localize`End time is required.`);
    }

    return this.errors.length > 0;
  }

  getErrors(): string[] {
    return ['From is required'];
  }
}
