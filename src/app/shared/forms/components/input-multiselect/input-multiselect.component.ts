import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { SelectConfig } from '../../interfaces/select-config.interface';
import { HttpParams } from '@angular/common/http';
import { DefaultSelectConfig } from '../../models/default-select-config.models';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';

@Component({
  selector: 'app-input-multiselect',
  templateUrl: './input-multiselect.component.html'
})
export class InputMultiselectComponent implements OnInit {
  // required
  @Input() form: FormGroup;
  @Input() property: string;

  // optional
  @Input() label: string;
  @Input() codelist: string;
  @Input() config: SelectConfig = new DefaultSelectConfig();
  @Input() queryParams: HttpParams | undefined = undefined;
  @Input() options: Codelist<number>[] = [];
  @Input() enabled = true;
  @Input() defaultValueString = '';
  @Input() addNullValue: boolean = false;
  @Input() isReadOnly: boolean = false;

  @Output() onChange = new EventEmitter<any>();

  selectedValuesArray = [];

  constructor(private formUtils: FormsUtilsService, private endpoints: CodelistRepositoryService, private fb: FormBuilder) {}

  ngOnInit() {
    if (this.codelist) {
      this.fetchCodelist();
      return;
    }
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

  selectedValue(selected: Codelist<number>, checked: boolean) {
    if (this.isReadOnly) {
      return;
    }
    this.selectedValuesArray = [];

    if (_.size(this.formControl.value)) {
      for (let value of this.formControl.value) {
        if (checked) {
          if (value !== selected.id) {
            this.selectedValuesArray.push(value); // uncheck element
          }
        } else {
          this.selectedValuesArray.push(value); // checked element (add to list)
          this.selectedValuesArray.push(selected.id);
        }
      }
    } else {
      this.selectedValuesArray.push(selected.id); // empty list
    }

    this.form.get(this.property).setValue(Array.from(new Set(this.selectedValuesArray)).sort());
    this.form.get(this.property).markAsDirty(); // form has changed
    this.onChange.emit(selected);
  }

  fetchCodelist() {
    /*  const request = this.endpoints.codelists(this.codelist);
    this.endpoints.makeRequest<Array<Codelist<number>>>(request)
      .subscribe((response) => {
        this.options = response;
        if (this.config.preselectFirst) {
          this.selectFirst();
        }
      });*/
  }

  selectFirst() {
    if (this.isReadOnly) {
      return;
    }
    const firstValue = _.get(_.first(this.options), this.config.valueField);
    this.form.get(this.property).setValue(firstValue);
  }

  isOptionChecked(option: Codelist<number>) {
    let isChecked = false;
    if (this.formControl.value) {
      for (let checkedId of this.formControl.value) {
        if (checkedId === option.id) {
          isChecked = true;
        }
      }
    }

    return isChecked;
  }
}
