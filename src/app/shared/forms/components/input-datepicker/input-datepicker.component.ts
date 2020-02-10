import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormsUtilsService } from '../../services/forms-utils.service';
import { NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbCustomDateParserFormatter } from '../../models/date-parser-formatter';
import { NgbUTCStringAdapter } from '../../models/date-string-adapter.models';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { DaterangepickerDirective } from 'ngx-daterangepicker-material';

@Component({
  selector: 'app-input-datepicker',
  templateUrl: './input-datepicker.component.html',
  providers: [
    {
      provide: NgbDateParserFormatter,
      useClass: NgbCustomDateParserFormatter
    },
    { provide: NgbDateAdapter, useClass: NgbUTCStringAdapter }
  ]
})
export class InputDatepickerComponent implements OnInit {
  @ViewChild(DaterangepickerDirective, { static: true }) pickerDirective: DaterangepickerDirective;
  // Required
  @Input() form: FormGroup;
  @Input() property: string;
  // Optional
  @Input() label: string;

  @Output() dateSelect = new EventEmitter();

  constructor(private formUtils: FormsUtilsService, private i18n: I18n) {}

  ngOnInit() {
    if (!this.form) {
      throw Error('InputDatepickerComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('InputDatepickerComponent - property input missing.');
    }
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }

  get required(): boolean {
    return this.formUtils.hasFormControlRequiredField(this.formControl);
  }

  onDateSelect(id: string): void {
    this.dateSelect.emit(id);
  }

  showErrors(): boolean {
    return this.formUtils.shouldInputShowErrors(this.formControl);
  }
}
