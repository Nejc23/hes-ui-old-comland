import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';

@Component({
  selector: 'app-input-numeric',
  templateUrl: './input-numeric.component.html'
})
export class InputNumericComponent implements OnInit {
  // required
  @Input() form: FormGroup;
  @Input() property: string;

  // optional
  @Input() label: string;
  @Input() isReadOnly = false; // input text is only readyonly (disabled for editing)
  @Input() showSpinners = false;
  @Input() decimals = 2;
  @Input() format = '#.## \\%';
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;

  constructor(private formUtils: FormsUtilsService) {}

  ngOnInit() {
    if (!this.form) {
      throw Error('InputTextComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('InputTextComponent - property input missing.');
    }
    if (!this.isReadOnly) {
      this.isReadOnly = false;
    }
    if (!this.showSpinners) {
      this.showSpinners = false;
    }
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
