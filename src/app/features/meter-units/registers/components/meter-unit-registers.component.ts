import { EventsById, EventsByTimestamp } from './../interfaces/events-processing.interface';
import { RegisterValue } from './../../../../core/repository/interfaces/data-processing/profile-definitions-for-device.interface';
import { RegisterGroup, RegisterStatistics } from './../interfaces/data-processing-request.interface';
import { DataProcessingService } from './../../../../core/repository/services/data-processing/data-processing.service';
import { AutoTemplateRegister } from './../../../../core/repository/interfaces/auto-templates/auto-template-register.interface';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { RegistersFilter } from '../interfaces/data-processing-request.interface';
import { environment } from 'src/environments/environment';
import { formatDate } from '@progress/kendo-angular-intl';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
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
  public deviceRegisters: AutoTemplateRegister[];
  public foundDeviceRegisters: AutoTemplateRegister[];

  deviceId: string;

  public startTime: Date;
  public endTime: Date;

  public showLineChart: boolean;
  public showTable: boolean;
  public showStatistics: boolean;
  public isEvent: boolean;

  public registersFilter: RegistersFilter;

  public rowData: RegisterValue[] = [];

  public pageSubtitle;

  public registerStatisticsData: RegisterStatistics;

  public range;
  public register;

  public registerGroupOptions: RadioOption[];
  public registerGroups: RegisterGroup[];

  public isRegisterSelected = false;
  public isDataFound = false;

  public chartCategories: Date[];
  public chartData: any[][];

  public form: FormGroup;

  public hideFilter;

  public registerSearch;

  public categorization;

  public eventsByTimestamp: EventsByTimestamp[];
  public eventsById: EventsById[];

  constructor(
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private autoTemplateService: AutoTemplatesService,
    private dataProcessingService: DataProcessingService,
    private breadcrumbService: BreadcrumbService,
    private muService: MeterUnitsService,
    private formUtils: FormsUtilsService,
    private codeList: CodelistMeterUnitsRepositoryService
  ) {}

  get registerProperty() {
    return 'register';
  }

  get rangeProperty() {
    return 'range';
  }

  get startTimeProperty() {
    return nameOf<RegistersFilter>((o) => o.startTime);
  }

  get endTimeProperty() {
    return nameOf<RegistersFilter>((o) => o.endTime);
  }

  get showLineChartProperty() {
    return 'showLineChart';
  }

  get showTableProperty() {
    return 'showTable';
  }

  get registerSearchProperty() {
    return 'registerSearch';
  }

  changeRegisterOptionId() {
    const registerValue = this.form.get(this.registerProperty).value;
    const selectedRegister = this.deviceRegisters.find((r) => r.registerDefinitionId === registerValue);
    this.isRegisterSelected = true;
    this.showStatistics = selectedRegister.categorization === 'INSTANTANEOUS_VALUE' ? false : true;
    this.isEvent = selectedRegister.categorization === 'EVENT' ? true : false;

    console.log('parent this.categorization', selectedRegister, this.isEvent, this.showStatistics);
    this.categorization = selectedRegister.categorization;

    this.setPageSubtitle();

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
    this.router.params.subscribe((params) => {
      this.deviceId = params.deviceId;
      this.setRegisters();
    });

    this.form = this.createForm();
    this.setRange(2); // yesterday

    this.muService.getMeterUnit(this.deviceId).subscribe((result) => {
      this.setTitle(result.name);
      this.typeId = result.type === 0 ? 1 : result.type; // TODO remove this after BE fix.

      this.codeList.meterUnitTypeCodelist().subscribe((list) => {
        this.typeName = list.find((l) => l.id === this.typeId).value;
        this.setBreadcrumbs();
      });
    });
  }

  setBreadcrumbs() {
    const breadcrumbs: Breadcrumb[] = [
      {
        label: $localize`Meters`,
        params: {},
        url: null
      }
    ];

    if (this.typeId && this.typeName) {
      breadcrumbs.push({
        label: this.typeName,
        params: {},
        url: `/meterUnits/${this.typeId}`
      });
    }

    breadcrumbs.push({
      label: $localize`Data view`,
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
    this.autoTemplateService.getRegisters(this.deviceId).subscribe((reg) => {
      this.deviceRegisters = reg;
      this.setRegisterGroups(null);
    });
  }

  setRegisterGroups(searchText: string) {
    this.foundDeviceRegisters = this.deviceRegisters;

    if (searchText && searchText.length > 0) {
      searchText = searchText.toLowerCase();
      this.foundDeviceRegisters = this.deviceRegisters.filter((d) => d.name.toLowerCase().indexOf(searchText) > -1);
    }

    const uniqueGroups = this.foundDeviceRegisters.map((d) => d.groupName).filter((value, index, self) => self.indexOf(value) === index);

    this.registerGroups = uniqueGroups
      .map((r) => ({ groupId: null, groupName: r, registerOptions: this.getRegisterGroupOptions(r) }))
      .sort((r1, r2) => {
        if (r1.groupName < r2.groupName) {
          return -1;
        } else if (r1.groupName === r2.groupName) {
          return 0;
        }
        return 1;
      });
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      [this.registerProperty]: [null],
      [this.rangeProperty]: [null, Validators.required],
      [this.startTimeProperty]: [null, Validators.required],
      [this.endTimeProperty]: [null, Validators.required],
      [this.showLineChartProperty]: [true, null],
      [this.showTableProperty]: [true, null],
      [this.registerSearchProperty]: [null]
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
      this.dataProcessingService.getChartData(this.registersFilter).subscribe((values) => {
        if (!values || values.length === 0) {
          this.isDataFound = false;
        } else {
          this.isDataFound = true;
          this.rowData = values;
          this.registerStatisticsData = this.getRegisterStatistics(this.rowData);

          this.setEventData();
          this.setPageSubtitle();

          this.chartCategories = values.map((v) => new Date(v.timestamp));
          this.chartData = [values];
        }
      });
    } catch (error) {
      console.log('showData() Error:', error);
    }
  }

  setEventData() {
    this.eventsByTimestamp = [];
    this.eventsById = [];
    if (!this.isEvent) {
      return;
    }

    // is it ordered?
    const startTime = new Date(this.rowData[0].timestamp);
    const endTime = new Date(this.rowData[this.rowData.length - 1].timestamp);

    const daysDiff = this.getDiffDays(startTime, endTime);

    const currentTime = new Date(this.rowData[0].timestamp);
    currentTime.setMinutes(0, 0, 0);

    // let inteval = 1000 * 60 * 60 * 60; // hours
    let outData = [];
    if (daysDiff <= 1) {
      // hourly interval
      outData = this.rowData.map((d) => ({ timestamp: new Date(d.timestamp).setMinutes(0, 0, 0), value: d.value }));
    } else {
      outData = this.rowData.map((d) => ({ timestamp: new Date(d.timestamp).setHours(0, 0, 0, 0), value: d.value }));
    }

    const groupBy = (array, key) => {
      // Return the end result
      return array.reduce((result, currentValue) => {
        if (!result[currentValue[key]]) {
          result[currentValue[key]] = 0;
        }
        result[currentValue[key]]++;

        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
      }, {}); // empty object is the initial value for result object
    };

    this.eventsByTimestamp = Object.entries(groupBy(outData, 'timestamp')).map((e) => ({
      timestamp: new Date(Number(e[0])),
      count: Number(e[1])
    }));
    const dataLength = this.rowData.length;
    const eventsByIdGroup = groupBy(outData, 'value');
    this.eventsById = Object.entries(eventsByIdGroup).map((e) => ({
      category: Number(e[0]),
      count: Number(e[1]),
      value: Number(e[1]) / dataLength
    }));

    const eventsLength = this.eventsById.length;

    if (eventsLength % 6 === 1) {
      this.eventsById[eventsLength - 1].color = environment.kendoPieChartLastSliceColor; // last color fix to avoid the same color for the first and the last pie slice
    }
  }

  getDiffDays(startTime: Date, endTime: Date): number {
    const diff = endTime.valueOf() - startTime.valueOf();
    return diff / (1000 * 3600 * 24);
  }

  fillData() {
    const registerValue = this.form.get(this.registerProperty).value;
    this.selectedRegister = null;
    if (registerValue && registerValue.id) {
      this.selectedRegister = this.deviceRegisters.find((d) => d.registerDefinitionId === registerValue.id);
    }

    this.selectedRange = null;

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
    if (registerValues == null || registerValues.length === 0) {
      return null;
    }

    const values = registerValues.filter((f) => f.value).map((r) => r.value);
    if (values && values.length > 0) {
      const avg = values.reduce((a, b) => a + b) / values.length;
      const min = Math.min.apply(Math, values);
      const max = Math.max.apply(Math, values);

      return {
        averageValue: avg,
        minValue: registerValues.find((r) => r.value === min),
        maxValue: registerValues.find((r) => r.value === max)
      };
    } else {
      return null;
    }
  }

  getRegisterGroupOptions(groupName: string): RadioOption[] {
    if (!this.foundDeviceRegisters || this.foundDeviceRegisters.length === 0) {
      return [];
    }

    const registersByGroup = this.foundDeviceRegisters.filter((r) => r.groupName.toLowerCase() === groupName.toLowerCase());

    const registerGroupOptions = registersByGroup
      .map((r) => ({ label: r.name, value: r.registerDefinitionId }))
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

  get placeholderSearch() {
    return $localize`Search`;
  }

  insertedSearchValue(searchValue) {
    this.setRegisterGroups(searchValue);
  }

  getFilterTitle(): string {
    return $localize`Register`;
  }
}
