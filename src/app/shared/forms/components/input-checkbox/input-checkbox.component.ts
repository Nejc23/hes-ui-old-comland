import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormsUtilsService } from '../../services/forms-utils.service';

@Component({
  selector: 'app-input-checkbox',
  templateUrl: './input-checkbox.component.html'
})
export class InputCheckboxComponent implements OnInit {
  // required
  @Input() form: FormGroup;
  @Input() property: string;
  @Input() label: string;

  constructor(private formUtils: FormsUtilsService) {}

  ngOnInit() {
    if (!this.form) {
      throw Error('InputCheckboxComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('InputCheckboxComponent - property input missing.');
    }
    if (!this.label) {
      throw Error('InputCheckboxComponent - label input missing.');
    }
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }

  showErrors(): boolean {
    return this.formUtils.shouldInputShowErrors(this.formControl);
  }
}
