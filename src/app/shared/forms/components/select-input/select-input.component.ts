import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { Codelist } from '../../interfaces/codelist.interface';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormsUtilsService } from '../../services/forms-utils.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html'
})
export class SelectInputComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() property: string;
  @Input() label;
  @Input() selectOptions: Codelist<number | string>[] = [];

  @Output() selectItem = new EventEmitter<number | string>();

  active = new Subject<void>();

  constructor(private i18n: I18n, private formUtils: FormsUtilsService) {}

  ngOnInit() {
    if (!this.form) {
      throw Error('SelectInput - form input missing.');
    }
    if (!this.property) {
      throw Error('SelectInput - property input missing.');
    }
    this.form
      .get(this.property)
      .valueChanges.pipe(takeUntil(this.active))
      .subscribe(x => {
        this.onSelect(x);
      });
  }

  ngOnDestroy(): void {
    this.active.next();
  }

  onSelect(id: number | string): void {
    this.selectItem.emit(id);
  }

  getSelectedValue(id: number | string): string {
    return this.formControlValue === id ? 'selected' : null;
  }

  get formControlValue(): number | string {
    return this.form.get(this.property).value;
  }

  getEmptySelectedValue() {
    return !this.formControlValue ? 'selected' : null;
  }

  get required(): boolean {
    return this.formUtils.hasFormControlRequiredField(this.form.get(this.property));
  }

  showErrors(): boolean {
    return this.formUtils.shouldInputShowErrors(this.form.get(this.property));
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }
}
