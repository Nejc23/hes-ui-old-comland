import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-input-searcher',
  templateUrl: './input-searcher.component.html'
})
export class InputSearcherComponent implements OnInit {
  // required
  @Input() form: FormGroup;
  @Input() property: string;

  // optional
  @Input() label: string;
  @Input() inputType: string;
  @Input() numberOnly = false; // input text receives only Numbers!
  @Input() isReadOnly = false; // input text is only readyonly (disabled for editing)
  @Input() placeholder = '';
  @Input() debounceTimeOut = 400;

  @Output() insertedValue = new EventEmitter<string>();

  userQuestionUpdate = new Subject<string>();

  constructor(private formUtils: FormsUtilsService) {}

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

    this.userQuestionUpdate.pipe(debounceTime(this.debounceTimeOut), distinctUntilChanged()).subscribe(value => {
      this.insertedValue.emit(value);
    });
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
