import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
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

  @Input() subTitle = '';

  @Input() boldedLastValue = '';

  @Input() labelCss = '';
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();

  controlId: string;

  @Input() cssClass = '';

  constructor(private formUtils: FormsUtilsService) {}

  valueTmp = false;

  ngOnInit() {
    if (!this.form) {
      throw Error('InputSwitchComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('InputSwitchComponent - property input missing.');
    }
    this.controlId = _.uniqueId('switch');
    this.valueTmp = this.form.get(this.property).value;
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

  labelClick() {
    // if (this.valueTmp === this.form.get(this.property).value) {
    //   this.form.get(this.property).setValue(!this.form.get(this.property).value);
    // }
    this.form.get(this.property).setValue(!this.form.get(this.property).value);
    this.valueTmp = this.form.get(this.property).value;
    this.valueChanged.emit(this.valueTmp);
  }

  onValueChanged(value: any) {
    this.valueChanged.emit(value);
  }
}
