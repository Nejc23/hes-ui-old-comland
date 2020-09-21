import { regexPattern } from './../../../../shared/forms/consts/regex.consts';
import { GridBulkActionRequestParams } from './../../../../core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { MeterUnitRegistersForm } from '../interfaces/data-processing-request.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { start } from 'repl';
import { RegistersSelectService } from 'src/app/core/repository/services/registers-select/registers-select.service';

@Component({
  templateUrl: 'meter-unit-registers.component.html'
})
export class MeterUnitRegistersComponent implements OnInit {
  public isRangeCustom = false;

  public selectedRange: RadioOption;
  public registers: Codelist<string>[];

  public formData: MeterUnitRegistersForm;
  deviceId: string;

  public startTime: Date;
  public endTime: Date;

  constructor(
    private formBuilder: FormBuilder,
    private i18n: I18n,
    private router: ActivatedRoute,
    private registersService: RegistersSelectService
  ) {
    // this.formData =  this.createForm();
    // this.form = this.createForm();
  }

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

  changeRangeOptionId() {
    const rangeValue = this.form.get(this.rangeProperty).value;
    // console.log('range option id:', rangeOptionId);

    this.setRange(rangeValue);

    // this.form.patchValue({startTime: new Date('2020-01-01 00:00')});
    // console.log('this.form', this.form);

    // console.log('form range option', this.formData);
    // this.form.setValue().startTime.setDate(new Date('2020-01-01').getDate());
  }

  setRange(selectedRangeId: string) {
    const date = new Date();
    this.isRangeCustom = false;

    switch (selectedRangeId) {
      case '1': {
        // today
        this.form.patchValue({
          startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          endTime: date
        });
        return;
      }
      case '2': {
        // yesterday
        this.form.patchValue({
          startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
          endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 23, 59)
        });
        return;
      }
      case '3': {
        // Last 7 days
        this.form.patchValue({
          startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7),
          endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 23, 59)
        });
        return;
      }
      case '4': {
        // Current month
        this.form.patchValue({
          startTime: new Date(date.getFullYear(), date.getMonth(), 1),
          endTime: date
        });

        return;
      }
      case '5': {
        // Last month
        this.form.patchValue({
          startTime: new Date(date.getFullYear(), date.getMonth() - 1, 1),
          endTime: new Date(date.getFullYear(), date.getMonth(), 0, 23, 59)
        });
        return;
      }
      case '6': {
        // Custom
        this.isRangeCustom = true;
      }
    }
  }

  clickShowHideFilter() {
    this.hideFilter = !this.hideFilter;
  }

  ngOnInit() {
    this.formData = {
      deviceId: null,
      register: null,
      range: this.rangeOptions[1].value,
      startTime: new Date(),
      endTime: new Date(),
      showLineChart: true,
      showTable: true
    };

    this.router.params.subscribe(params => {
      this.deviceId = params.deviceId;
      this.formData.deviceId = this.deviceId;
      this.setRegisters();
    });

    this.form = this.createForm();
  }

  setRegisters() {
    const request: GridBulkActionRequestParams = {
      id: [this.deviceId]
    };

    this.registersService.getDeviceRegisters(request).subscribe(reg => {
      this.registers = reg.map(r => ({ id: r.id, value: r.name }));
      console.log('test is this', this.registers);
    });
  }

  createForm(): FormGroup {
    return this.formBuilder.group(
      {
        [this.registerProperty]: [this.formData.register, Validators.required],
        [this.rangeProperty]: [this.rangeOptions[1].value, Validators.required],
        [this.startTimeProperty]: [this.startTime, Validators.required],
        [this.endTimeProperty]: [this.endTime, Validators.required],
        [this.showLineChartProperty]: [this.formData.showLineChart, null],
        [this.showTableProperty]: [this.formData.showTable, null]
      }
      // { updateOn: 'blur', validators: matchPasswordsValidator(this.passwordProperty, this.confirmPasswordProperty) }
    );
  }

  showData() {}
}
