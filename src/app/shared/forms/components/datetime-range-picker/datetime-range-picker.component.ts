import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { DaterangepickerComponent } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-datetime-range-picker',
  templateUrl: './datetime-range-picker.component.html'
})
export class DateTimeRangePickerComponent {
  @ViewChild(DaterangepickerComponent) datePicker: DaterangepickerComponent;

  selected: any;
  selectedDate = moment();
  controlId: string;

  @Input() withRanges = true;
  @Input() withTime = true;

  @Input() form: FormGroup;
  @Output() formClosed: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  onSelect(event) {
    this.form.controls.labelText.setValue(event.chosenLabel);
    console.log('[onSelect] : ');
    console.log(event);
  }

  rangeClicked(range) {
    console.log('[rangeClicked] range is : ', range);
  }

  datesUpdated(range) {
    this.selected = range;
    this.datePicker.updateView();
    console.log('[datesUpdated] range is : ', range);
    this.setValues();
  }

  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'Current Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  };

  save() {
    this.formClosed.emit(true);
  }

  setValues() {
    this.form.controls.startDate.setValue(this.selected.startDate);
    this.form.controls.endDate.setValue(this.selected.endDate);
  }

  clear() {
    this.datesUpdated(this.ranges.Today);
    this.form.controls.startDate.setValue(this.selected.startDate);
    this.form.controls.endDate.setValue(this.selected.endDate);
    this.form.controls.startTime.setValue('00:00');
    this.form.controls.endTime.setValue('00:00');
    this.datePicker.updateView();
  }
}
