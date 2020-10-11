import { registers } from 'src/app/core/repository/consts/meter-units.const';
import { RegisterValue } from './../../../../core/repository/interfaces/data-processing/profile-definitions-for-device.interface';
import { RegisterGroup, RegisterStatistics } from './../interfaces/data-processing-request.interface';
import { DataProcessingService } from './../../../../core/repository/services/data-processing/data-processing.service';
import { AutoTemplateRegister } from './../../../../core/repository/interfaces/auto-templates/auto-template-register.interface';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';
import { ActivatedRoute } from '@angular/router';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { RegistersFilter } from '../interfaces/data-processing-request.interface';
import { environment } from 'src/environments/environment';
import { formatDate } from '@progress/kendo-angular-intl';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { of } from 'rxjs';
import { Breadcrumb } from 'src/app/shared/breadcrumbs/interfaces/breadcrumb.interface';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';

@Component({
  templateUrl: 'meter-unit-registers.component.html'
})
export class MeterUnitRegistersComponent implements OnInit {
  public selectedRegister: AutoTemplateRegister;
  private typeId: number;
  private typeName: string;

  public isRangeCustom = false;

  public selectedRange: RadioOption;
  public registers: Codelist<string>[];
  public deviceRegisters: AutoTemplateRegister[];

  deviceId: string;

  public startTime: Date;
  public endTime: Date;

  public showLineChart: boolean;
  public showTable: boolean;
  public showStatistics: boolean;

  public registersFilter: RegistersFilter;

  public rowData: RegisterValue[] = [];

  public pageSubtitle;

  public registerStatisticsData: RegisterStatistics;

  public range;
  public register;
  public showNoData = false;

  public registerGroups: string[];

  public registerGroupOptions: RadioOption[];
  public registerGroups2: RegisterGroup[];

  public isRegisterSelected = false;
  public isDataFound = false;

  constructor(
    private formBuilder: FormBuilder,
    private i18n: I18n,
    private router: ActivatedRoute,
    private autoTemplateService: AutoTemplatesService,
    private dataProcessingService: DataProcessingService,
    private breadcrumbService: BreadcrumbService,
    private muService: MeterUnitsService,
    private formUtils: FormsUtilsService,
    private codeList: CodelistMeterUnitsRepositoryService
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
    return 'register';
  }

  get rangeProperty() {
    return 'range';
  }

  get startTimeProperty() {
    return nameOf<RegistersFilter>(o => o.startTime);
  }

  get endTimeProperty() {
    return nameOf<RegistersFilter>(o => o.endTime);
  }

  get showLineChartProperty() {
    return 'showLineChart';
  }

  get showTableProperty() {
    return 'showTable';
  }

  changeRegisterOptionId() {
    const registerValue = this.form.get(this.registerProperty).value;
    const selectedRegister = this.deviceRegisters.find(r => r.registerDefinitionId === registerValue);
    this.isRegisterSelected = true;
    this.showStatistics = selectedRegister.categorization === 'INSTANTANEOUS_VALUE' ? false : true;

    this.setPageSubtitle();

    window.scroll(0, 0);
    this.showData(selectedRegister);
  }

  setRange(selectedRangeId: number) {
    const date = new Date();
    this.isRangeCustom = false;

    switch (selectedRangeId) {
      case 1: {
        // today
        this.form.patchValue({
          startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          endTime: date
        });
        break;
      }
      case 2: {
        // yesterday
        this.form.patchValue({
          startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
          endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0)
        });
        break;
      }
      case 3: {
        // Last 7 days
        this.form.patchValue({
          startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7),
          endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0)
        });
        break;
      }
      case 4: {
        // Last 30 days
        this.form.patchValue({
          startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 30),
          endTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0)
        });
        break;
      }
      case 5: {
        // Current month
        this.form.patchValue({
          startTime: new Date(date.getFullYear(), date.getMonth(), 1),
          endTime: date
        });
        break;
      }
      case 6: {
        // Last month
        this.form.patchValue({
          startTime: new Date(date.getFullYear(), date.getMonth() - 1, 1),
          endTime: new Date(date.getFullYear(), date.getMonth(), 1, 0, 0)
        });
        break;
      }
    }

    this.showData(this.selectedRegister);
  }

  clickShowHideFilter() {
    this.hideFilter = !this.hideFilter;
  }

  ngOnInit() {
    this.setTitle('');

    this.setPageSubtitle();
    this.router.params.subscribe(params => {
      this.deviceId = params.deviceId;
      this.setRegisters();
    });

    const rangeValue = this.rangeOptions[1].value;
    this.form = this.createForm(rangeValue);
    this.setRange(2);

    this.muService.getMeterUnit(this.deviceId).subscribe(result => {
      this.setTitle(result.name);
      this.typeId = result.type === 0 ? 1 : result.type; // TODO remove this after BE fix.

      this.codeList.meterUnitTypeCodelist().subscribe(list => {
        this.typeName = list.find(l => l.id === this.typeId).value;
        this.setBreadcrumbs();
      });
    });
  }

  setBreadcrumbs() {
    const breadcrumbs: Breadcrumb[] = [
      {
        label: this.i18n('Meters'),
        params: {},
        url: null
      }
    ];

    if (this.typeId && this.typeName) {
      breadcrumbs.push({
        label: this.i18n(this.typeName),
        params: {},
        url: `/meterUnits/${this.typeId}`
      });
    }

    breadcrumbs.push({
      label: this.i18n('Data view'),
      params: {},
      url: null
    });

    this.breadcrumbService.setBreadcrumbs(breadcrumbs);
  }

  setTitle(title) {
    this.breadcrumbService.setPageName(title);
  }

  setPageSubtitle() {
    this.pageSubtitle = '';

    if (this.selectedRegister) {
      let rangeDay = '';
      if (this.selectedRange && this.selectedRange.value !== '6') {
        rangeDay = `for ${this.selectedRange.label.toLowerCase()}`;
      }

      const startTimeString = this.getLocalDateWithTimeString(this.startTime);
      const endTimeString = this.getLocalDateWithTimeString(this.endTime);
      this.pageSubtitle = `${this.selectedRegister.name} ${rangeDay} (${startTimeString} - ${endTimeString})`;
    }
  }

  setRegisters() {
    this.autoTemplateService.getRegisters(this.deviceId).subscribe(reg => {
      this.deviceRegisters = reg;
      this.registers = this.deviceRegisters
        .map(r => ({ id: r.registerDefinitionId, value: r.name }))
        .sort((r1, r2) => {
          if (r1.value < r2.value) {
            return -1;
          } else if (r1.value === r2.value) {
            return 0;
          }
          return 1;
        });

      this.registerGroups = this.deviceRegisters
        .map(d => d.groupName)
        .filter((value, index, self) => self.indexOf(value) === index)
        .sort((r1, r2) => {
          if (r1 < r2) {
            return -1;
          } else if (r1 === r2) {
            return 0;
          }
          return 1;
        });

      const uniqueGroups = this.deviceRegisters.map(d => d.groupName).filter((value, index, self) => self.indexOf(value) === index);

      this.registerGroups2 = uniqueGroups
        .map(r => ({ groupId: null, groupName: r, registerOptions: this.getRegisterGroupOptions(r) }))
        .sort((r1, r2) => {
          if (r1.groupName < r2.groupName) {
            return -1;
          } else if (r1.groupName === r2.groupName) {
            return 0;
          }
          return 1;
        });

      this.getRegisterGroupOptions(this.registerGroups[0]);
    });
  }

  createForm(rangeValue: string): FormGroup {
    return this.formBuilder.group({
      [this.registerProperty]: [null],
      [this.rangeProperty]: [null, Validators.required],
      [this.startTimeProperty]: [null, Validators.required],
      [this.endTimeProperty]: [null, Validators.required],
      [this.showLineChartProperty]: [true, null],
      [this.showTableProperty]: [true, null]
    });
  }

  showData(register: AutoTemplateRegister, forceRefresh: boolean = false) {
    const startTime = this.form.get(this.startTimeProperty).value;
    const endTime = this.form.get(this.endTimeProperty).value;

    if (!register || !startTime || !endTime) {
      this.isDataFound = false;
      return;
    }

    if (!forceRefresh && register === this.selectedRegister && startTime === this.startTime && endTime === this.endTime) {
      console.log('showData: nothing changed');
      return;
    }

    this.selectedRegister = register;
    this.startTime = startTime;
    this.endTime = endTime;

    this.registersFilter = {
      deviceId: this.deviceId,
      register: this.selectedRegister,
      startTime: this.startTime,
      endTime: this.endTime
    };

    this.rowData = null;
    this.registerStatisticsData = null;

    try {
      this.dataProcessingService.getChartData(this.registersFilter).subscribe(values => {
        if (values) {
          this.isDataFound = true;
          this.rowData = values;
          this.registerStatisticsData = this.getRegisterStatistics(this.rowData);
          this.setPageSubtitle();
        } else {
          this.isDataFound = false;
        }
      });
    } catch (error) {
      console.log('showData() Error:', error);
    }
  }

  fillData() {
    const registerValue = this.form.get(this.registerProperty).value;
    this.selectedRegister = null;
    if (registerValue && registerValue.id) {
      this.selectedRegister = this.deviceRegisters.find(d => d.registerDefinitionId === registerValue.id);
    }

    this.selectedRange = null;
    const selectedRangeValue = this.form.get(this.rangeProperty).value;
    if (selectedRangeValue) {
      this.selectedRange = this.rangeOptions.find(r => r.value === selectedRangeValue);
    }

    this.showLineChart = this.form.get(this.showLineChartProperty).value;
    this.showTable = this.form.get(this.showTableProperty).value;

    this.startTime = this.form.get(this.startTimeProperty).value;
    this.endTime = this.form.get(this.endTimeProperty).value;

    this.showStatistics = false;
    if (this.selectedRegister) {
      this.showStatistics = this.selectedRegister.categorization === 'INSTANTANEOUS_VALUE' ? false : true;
    }
  }

  getLocalDateWithTimeString(dateTime: Date): string {
    return dateTime ? `${formatDate(dateTime, environment.dateTimeFormat)}` : '';
  }

  getRegisterStatistics(registerValues: RegisterValue[]): RegisterStatistics {
    const values = registerValues.map(r => r.value);
    const avg = values.reduce((a, b) => a + b) / values.length;
    const min = Math.min.apply(Math, values);
    const max = Math.max.apply(Math, values);

    return {
      averageValue: avg,
      minValue: registerValues.find(r => r.value === min),
      maxValue: registerValues.find(r => r.value === max)
    };
  }

  getRegisterGroupOptions(registerGroup: string): RadioOption[] {
    if (!this.deviceRegisters || this.deviceRegisters.length === 0) {
      return [];
    }

    const registersByGroup = this.deviceRegisters.filter(r => r.groupName.toLowerCase() === registerGroup.toLowerCase());

    const registerGroupOptions = registersByGroup
      .map(r => ({ label: r.name, value: r.registerDefinitionId }))
      .sort((r1, r2) => {
        if (r1.label < r2.label) {
          return -1;
        } else if (r1.label === r2.label) {
          return 0;
        }
        return 1;
      });
    return registerGroupOptions;
  }

  startTimeChanged(event: any) {
    console.log('start time changed');
  }

  onStartTimeBlur() {
    this.showData(this.selectedRegister);
  }

  onEndTimeBlur() {
    this.showData(this.selectedRegister);
  }

  onRefresh() {
    this.showData(this.selectedRegister, true);
  }
}
