import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { SelectConfig } from '../../interfaces/select-config.interface';
import { DefaultSelectConfig } from '../../models/default-select-config.models';
import { HttpParams } from '@angular/common/http';
import * as _ from 'lodash';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

@Component({
  selector: 'app-input-select',
  templateUrl: './input-select.component.html'
})
export class InputSelectComponent implements OnInit {
  // required
  @Input() form: FormGroup;
  @Input() property: string;

  // optional
  @Input() label: string;
  @Input() config: SelectConfig = new DefaultSelectConfig();
  @Input() queryParams: HttpParams | undefined = undefined;
  @Input() options: Array<Codelist<number>> = [];
  @Input() enabled = true;
  @Input() defaultValueString = '';
  @Input() addNullValue = false;

  @Output() changeSelection = new EventEmitter<any>();
  @Output() addNew = new EventEmitter<null>();
  constructor(private formUtils: FormsUtilsService) {}

  ngOnInit() {
    if (_.size(this.options) && this.config.preselectFirst) {
      this.selectFirst();
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

  currentValue(): string {
    const current = this.form.get(this.property).value;
    const selectedOption = _.find(this.options, (x) => x.id === current);
    return selectedOption ? selectedOption.value : this.defaultValueString;
  }

  selectedValue(selected: Codelist<number>) {
    this.form.get(this.property).setValue(selected ? selected.id : null);
    this.form.get(this.property).markAsDirty();
    this.changeSelection.emit(selected);
  }

  selectFirst() {
    const firstValue = _.get(_.first(this.options), this.config.valueField);
    this.form.get(this.property).setValue(firstValue);
  }

  addNewClick() {
    this.addNew.emit();
  }
}
