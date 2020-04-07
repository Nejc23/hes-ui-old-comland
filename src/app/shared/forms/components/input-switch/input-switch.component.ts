import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-input-switch',
  templateUrl: './input-switch.component.html'
})
export class InputSwitchComponent implements OnInit {
  // required
  @Input() form: FormGroup;
  @Input() property: string;

  // optional
  @Input() label: string;

  controlId: string;

  constructor(private formUtils: FormsUtilsService) {}

  ngOnInit() {
    if (!this.form) {
      throw Error('InputTextComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('InputTextComponent - property input missing.');
    }
    this.controlId = _.uniqueId('switch');
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
