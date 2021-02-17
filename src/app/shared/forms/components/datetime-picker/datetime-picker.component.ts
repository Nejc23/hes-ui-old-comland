import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { CldrIntlService } from '@progress/kendo-angular-intl';
import * as _ from 'lodash';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { environment } from 'src/environments/environment';

import { LOCALE_ID, Inject } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';

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
  @Input() isInline = false;
  @Output() blur = new EventEmitter();
  @Output() valueChange = new EventEmitter<Date>();

  @ViewChild('datetime') dateTime: any;

  controlId: string;

  constructor(private formUtils: FormsUtilsService, public intlService: IntlService) {}

  ngOnInit() {
    if (!this.form) {
      throw Error('DatetimePickerComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('DatetimePickerComponent - property input missing.');
    }
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

  onBlur() {
    this.blur.emit();
  }

  onValueChange(changedDate: Date) {
    this.valueChange.emit(changedDate);
  }
}
