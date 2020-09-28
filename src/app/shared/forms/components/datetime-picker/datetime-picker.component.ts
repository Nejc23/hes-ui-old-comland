import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-datetime-picker',
  templateUrl: './datetime-picker.component.html'
})
export class DateTimePickerComponent implements OnInit {
  // Required
  @Input() form: FormGroup;
  @Input() property: string;
  @Input() label;
  @Input() min: Date;
  @Input() max: Date;
  @Input() readonly = false;

  controlId: string;

  constructor(private formUtils: FormsUtilsService) {}

  ngOnInit() {
    if (!this.form) {
      throw Error('DatetimePickerComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('DatetimePickerComponent - property input missing.');
    }
    this.controlId = _.uniqueId('datetimepicker');
  }

  get format() {
    return environment.dateTimeFormat;
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
