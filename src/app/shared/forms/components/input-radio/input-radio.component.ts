import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { FormGroup, AbstractControl } from '@angular/forms';
import { RadioOption } from '../../interfaces/radio-option.interface';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
@Component({
  selector: 'app-input-radio',
  templateUrl: './input-radio.component.html'
})
export class InputRadioComponent implements OnInit {
  @Input() property: string;
  @Input() form: FormGroup;
  @Input() options: RadioOption[];
  @Input() inline = false;
  @Input() label: string;
  @Input() box = false;
  @Input() showTooltip = false;
  @Input() hideLabelSmall = false;

  @Output() refresh: EventEmitter<RadioOption> = new EventEmitter();

  constructor(private formUtils: FormsUtilsService) {}

  ngOnInit() {
    if (!this.form) {
      throw Error('InputRadioComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('InputRadioComponent - property input missing.');
    }
    this.addUids();
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }

  /*
  changeValue(option: RadioOption) {
    this.formControl.setValue(option.value);
    this.refresh.emit(option);
  }
  */

  isSelected(option: RadioOption) {
    return this.formControl.value === option.value;
  }

  get required(): boolean {
    return this.formUtils.hasFormControlRequiredField(this.formControl);
  }

  showErrors(): boolean {
    return this.formUtils.shouldInputShowErrors(this.formControl);
  }

  addUids() {
    _.each(this.options, (x) => (x.uid = _.uniqueId('input-radio-')));
  }

  getTooltip(option: RadioOption): string {
    if (this.showTooltip) {
      return option.label;
    } else {
      return '';
    }
  }
}
