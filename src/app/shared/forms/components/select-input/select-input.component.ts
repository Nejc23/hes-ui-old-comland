import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html'
})
export class SelectInputComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup;
  @Input() property: string;
  @Input() label;
  @Input() selectOptions: Codelist<number | string>[] = [];
  @Input() disabled = false;
  @Input() clearButton = true;

  @Output() selectedValueChanged: EventEmitter<any> = new EventEmitter<any>();

  active = new Subject<void>();

  selection: Codelist<number | string> = { id: null, value: 'Select item...' };

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
        this.selectionChange(x);
      });
  }

  ngOnDestroy(): void {
    this.active.next();
  }

  public valueChange(value: any): void {
    console.log('valueChange', value);
    this.selectedValueChanged.emit(value);
  }

  public selectionChange(value: any): void {
    console.log('selectionChange', value);
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
