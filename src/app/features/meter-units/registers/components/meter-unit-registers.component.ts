import { Observable } from 'rxjs';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { MeterUnitRegistersForm } from '../interfaces/data-processing-request.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';

@Component({
  templateUrl: 'meter-unit-registers.component.html'
})
export class MeterUnitRegistersComponent implements OnInit {
  public selectedRange: RadioOption;
  public registers$: Observable<Codelist<string>[]>;

  data: any;

  constructor(private formBuilder: FormBuilder, private i18n: I18n) {}

  public form: FormGroup;
  public rangeOptions: RadioOption[] = [
    { value: '1' as string, label: this.i18n('Today') },
    { value: '2' as string, label: this.i18n('Yesterday') },
    { value: '3' as string, label: this.i18n('Last 7 days') },
    { value: '4' as string, label: this.i18n('Current month') },
    { value: '5' as string, label: this.i18n('Last Month') },
    { value: '6' as string, label: this.i18n('Custom') }
  ];

  public hideFilter;

  get registerProperty() {
    return nameOf<MeterUnitRegistersForm>(o => o.register);
  }

  get rangeProperty() {
    return nameOf<MeterUnitRegistersForm>(o => o.range);
  }

  get startTimeProperty() {
    return nameOf<MeterUnitRegistersForm>(o => o.startTime);
  }

  get endTimeProperty() {
    return nameOf<MeterUnitRegistersForm>(o => o.endTime);
  }

  get showLineChartProperty() {
    return nameOf<MeterUnitRegistersForm>(o => o.showLineChart);
  }

  get showTableProperty() {
    return nameOf<MeterUnitRegistersForm>(o => o.showTable);
  }

  changeRangeOptionId() {}

  clickShowHideFilter() {
    this.hideFilter = !this.hideFilter;
  }

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.formBuilder.group(
      {
        [this.registerProperty]: [null, Validators.required],
        [this.rangeProperty]: [this.rangeOptions[1], Validators.required],
        [this.startTimeProperty]: [null, Validators.required],
        [this.endTimeProperty]: [null, Validators.required],
        [this.showLineChartProperty]: [false, null],
        [this.showTableProperty]: [false, null]
      }
      // { updateOn: 'blur', validators: matchPasswordsValidator(this.passwordProperty, this.confirmPasswordProperty) }
    );
  }

  showData() {}
}
