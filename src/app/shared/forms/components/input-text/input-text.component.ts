import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html'
})
export class InputTextComponent implements OnInit {
  // required
  @Input() form: FormGroup;
  @Input() property: string;

  // optional
  @Input() label: string;
  @Input() labelRight: string;
  @Input() inputType: string;
  @Input() numberOnly = false; // input text receives only Numbers!
  @Input() isReadOnly = false; // input text is only readyonly (disabled for editing)
  @Input() placeholder = '';
  @Input() iconName = '';
  @Input() regex = '';
  @Input() overrideErrorPatternMessage: string = null;

  @Output() inputTextBlurValue: EventEmitter<boolean> = new EventEmitter();

  warnings = [];

  constructor(private formUtils: FormsUtilsService) {}

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }

  get required(): boolean {
    return this.formUtils.hasFormControlRequiredField(this.formControl);
  }

  ngOnInit() {
    if (!this.form) {
      throw Error('InputTextComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('InputTextComponent - property input missing.');
    }
    if (!this.numberOnly) {
      this.numberOnly = false;
    }
    if (!this.isReadOnly) {
      this.isReadOnly = false;
    }
  }

  showErrors(): boolean {
    return this.formUtils.shouldInputShowErrors(this.formControl);
  }

  showWarning(): boolean {
    return this.warnings.length > 0;
  }

  pushWarning(warning: string): void {
    this.warnings.push(warning);
  }

  clearWarning(): void {
    this.warnings = [];
  }

  onBlur() {
    this.inputTextBlurValue.emit(true);
  }
}
