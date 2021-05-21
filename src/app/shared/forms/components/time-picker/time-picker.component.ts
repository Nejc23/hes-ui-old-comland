import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html'
})
export class TimePickerComponent implements OnInit {
  // Required
  @Input() form: FormGroup;
  @Input() property: string;
  @Input() label;
  @Input() min: Date;
  @Input() max: Date;

  controlId: string;

  constructor(private formUtils: FormsUtilsService) {}

  ngOnInit() {
    if (!this.form) {
      throw Error('TimePickerComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('TimePickerComponent - property input missing.');
    }
    this.controlId = _.uniqueId('timepicker');
  }

  get format() {
    return environment.timeFormatLong;
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }

  get required(): boolean {
    return this.formUtils.hasFormControlRequiredField(this.formControl);
  }

  showErrors(): boolean {
    return this.formUtils.shouldInputShowErrors(this.formControl);
  }
}
