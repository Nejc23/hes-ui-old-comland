import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ComboBoxComponent } from '@progress/kendo-angular-dropdowns';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { UnitCodeListItemClient } from 'src/app/models/tou-configuration/UnitCodeListItemClient';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html'
})
export class SelectInputComponent implements OnInit, OnDestroy {
  @ViewChild(ComboBoxComponent) public combobox;
  @Input() form: FormGroup;
  @Input() property: string;
  @Input() label;
  @Input() selectOptions: Codelist<number | string>[] | UnitCodeListItemClient<number | string> = [];
  @Input() disabled = false;
  @Input() clearButton = true;
  @Input() itemDisabled;
  @Input() withDescription = false;
  @Input() withIdInDropdown = false;
  @Input() textField = 'value';
  @Input() valueField = 'id';

  @Output() selectedValueChanged: EventEmitter<any> = new EventEmitter<any>();

  active = new Subject<void>();

  selection: Codelist<number | string> = { id: null, value: this.translate.instant('COMMON.SELECT-ITEM') };

  constructor(private formUtils: FormsUtilsService, private translate: TranslateService) {}

  get formControlValue(): number | string {
    return this.form.get(this.property).value;
  }

  get required(): boolean {
    return this.formUtils.hasFormControlRequiredField(this.form.get(this.property));
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }

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
      .subscribe((x) => {
        this.selectionChange(x);
      });
  }

  ngOnDestroy(): void {
    this.active.next();
  }

  public valueChange(value: any): void {
    this.selectedValueChanged.emit(value);
  }

  public selectionChange(value: any): void {}

  getEmptySelectedValue() {
    return !this.formControlValue ? 'selected' : null;
  }

  showErrors(): boolean {
    return this.formUtils.shouldInputShowErrors(this.form.get(this.property));
  }

  click() {
    this.combobox.toggle(true);
  }
}
