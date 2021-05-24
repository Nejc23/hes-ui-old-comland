import { Component, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { DaterangepickerComponent } from 'ngx-daterangepicker-material';
import { environment } from 'src/environments/environment';
import { dateDisplayFormat } from '../../consts/date-format';

@Component({
  selector: 'app-datetime-range-picker',
  templateUrl: './datetime-range-picker.component.html'
})
export class DateTimeRangePickerComponent {
  constructor() {}
  @ViewChild(DaterangepickerComponent) datePicker: DaterangepickerComponent;

  selected: any;
  selectedDate = moment();
  controlId: string;

  @Input() withRanges = true;
  @Input() withTime = true;

  @Input() form: FormGroup;
  @Output() formClosed: EventEmitter<boolean> = new EventEmitter();
  today = false;
  clearData = false;

  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment()],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment()],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().startOf('month')]
  };

  onSelect(event) {
    console.log('[onSelect] : ');
    console.log(event);
  }

  rangeClicked(range) {
    if (range.label?.toLowerCase() === 'today') {
      this.today = true;
      this.form.controls.endTime.setValue(moment().format('hh:mm'));
    } else {
      this.form.controls.endTime.setValue('00:00');
      this.today = false;
    }
    if (this.clearData) {
      this.datesUpdated(range);
      this.clearData = false;
    }
    console.log('[rangeClicked] range is : ', range.Today);
  }

  datesUpdated(range) {
    this.selected = range;
    console.log('[datesUpdated] range is : ', range);
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
    // TODO FORMAT
    this.form.controls.labelText.setValue(
      startDateFormatted + ' - ' + endDateFormatted + ' | ' + this.form.controls.startTime.value + ' - ' + this.form.controls.endTime.value
    );

    this.datePicker.updateView();
  }

  clear() {
    this.clearData = true;
    this.rangeClicked(this.ranges.Yesterday);
    this.form.controls.startTime.setValue('00:00');
    this.datePicker.updateView();
  }

  // checkDate() {
  //   if (this.today) {
  //     if (this.form.controls.endTime.value(moment().format('hh:mm')) < this.form.controls.startTime.value(moment().format('hh:mm'))) {
  //       debugger;
  //     }
  //   }
  // }
}
