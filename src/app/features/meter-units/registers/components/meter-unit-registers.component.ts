import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { formatDate } from '@progress/kendo-angular-intl';
import * as moment from 'moment';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { Breadcrumb } from 'src/app/shared/breadcrumbs/interfaces/breadcrumb.interface';
import { BreadcrumbService } from 'src/app/shared/breadcrumbs/services/breadcrumb.service';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { environment } from 'src/environments/environment';
import { AutoTemplateRegister } from '../../../../core/repository/interfaces/auto-templates/auto-template-register.interface';
import {
  EventRegisterValue,
  RegisterValue
} from '../../../../core/repository/interfaces/data-processing/profile-definitions-for-device.interface';
import { DataProcessingService } from '../../../../core/repository/services/data-processing/data-processing.service';
import { RegisterStatisticsService } from '../../types/services/register-statistics.service';
import { RegisterGroup, RegistersFilter, RegisterStatistics } from '../interfaces/data-processing-request.interface';
import { EventsById, EventsByTimestamp } from '../interfaces/events-processing.interface';

@Component({
  templateUrl: 'meter-unit-registers.component.html'
})
export class MeterUnitRegistersComponent implements OnInit {
  @ViewChild('popover') popover;

  public selectedRegister: AutoTemplateRegister;

  public selectedRange: RadioOption;
  public deviceRegisters: AutoTemplateRegister[];
  public foundDeviceRegisters: AutoTemplateRegister[];

  deviceId: string;

  public startTime: string;
  public endTime: string;

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
  unit = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private autoTemplateService: AutoTemplatesService,
    private dataProcessingService: DataProcessingService,
    private breadcrumbService: BreadcrumbService,
    private muService: MeterUnitsService,
    private registerStatisticsService: RegisterStatisticsService,
    private formUtils: FormsUtilsService,
    private codeList: CodelistMeterUnitsRepositoryService,
    private translate: TranslateService
  ) {}

  get registerProperty() {
    return 'register';
  }

  get rangeProperty() {
    return 'range';
  }
  get startDateProperty(): string {
    return 'startDate';
  }

  get endDateProperty(): string {
    return 'endDate';
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

  get datePickerText() {
    return 'labelText';
  }

  changeRegisterOptionId() {
    const registerValue = this.form.get(this.registerProperty).value;
    const selectedRegister = this.deviceRegisters.find((r) => r.registerDefinitionId === registerValue);
    this.isRegisterSelected = true;
    this.showStatistics = selectedRegister.categorization !== 'INSTANTANEOUS_VALUE';
    this.isEvent = selectedRegister.categorization === 'EVENT';

    this.categorization = selectedRegister.categorization;

    this.showData(selectedRegister);
  }

  setDate() {
    this.showData(this.selectedRegister, true);
  }

  clickShowHideFilter() {
    this.hideFilter = !this.hideFilter;
  }

  ngOnInit() {
    this.setTitle('');

    this.router.params.subscribe((params) => {
      this.deviceId = params.deviceId;
      this.setRegisters();
    });

    this.form = this.createForm();

    // yesterday
    const startDateFormatted = moment().subtract(1, 'days').format(environment.dateDisplayFormat);
    const endDateFormatted = moment().format(environment.dateDisplayFormat);

    this.form.controls.labelText.setValue(
      startDateFormatted + ' ' + this.form.controls.startTime.value + ' - ' + endDateFormatted + ' ' + this.form.controls.endTime.value
    );
    this.muService.getMeterUnit(this.deviceId).subscribe((result) => {
      this.setTitle(result.name ? result.name : result.serialNumber);
      this.setBreadcrumbs();
    });
  }

  setRange(selectedRangeId: number) {
    const date = new Date();
    switch (selectedRangeId) {
      case 1: {
        // today
        this.form.patchValue({
          startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          endDate: date.setMinutes(0, 0, 0)
        });
        this.form.patchValue({
          endTime: ('0' + date.getHours()).slice(-2) + ':' + '00'
        });
        break;
      }
      case 2: {
        // yesterday
        this.form.patchValue({
          startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
          endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
        });
        this.form.patchValue({
          endTime: '00:00'
        });
        break;
      }
      case 3: {
        // Last 7 days
        this.form.patchValue({
          startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6),
          endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
        });
        this.form.patchValue({
          endTime: '00:00'
        });
        break;
      }
      case 4: {
        // Last 30 days
        this.form.patchValue({
          startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 29),
          endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0)
        });
        this.form.patchValue({
          endTime: '00:00'
        });
        break;
      }
      case 5: {
        // Current month
        this.form.patchValue({
          startDate: new Date(date.getFullYear(), date.getMonth(), 1),
          endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours())
        });
        this.form.patchValue({
          endTime: ('0' + date.getHours()).slice(-2) + ':' + '00'
        });
        break;
      }
      case 6: {
        // Last month
        this.form.patchValue({
          startDate: new Date(date.getFullYear(), date.getMonth() - 1, 1),
          endDate: new Date(date.getFullYear(), date.getMonth(), 1, 0, 0)
        });
        this.form.patchValue({
          endTime: '00:00'
        });
        break;
      }
    }
    const startDateFormatted = moment(this.form.get('startDate').value).format('DD. MM. YYYY HH:mm');
    const endDateFormatted = moment(this.form.get('endDate').value).format('DD. MM. YYYY HH:mm');
    this.form.controls.labelText.setValue(startDateFormatted + ' - ' + endDateFormatted);
    this.showData(this.selectedRegister, true);
  }

  setBreadcrumbs() {
    const breadcrumbs: Breadcrumb[] = [
      {
        label: this.translate.instant('MENU.METERS'),
        params: {},
        url: null
      }
    ];

    breadcrumbs.push({
      label: this.translate.instant('MENU.DATA-VIEW'),
      params: {},
      url: null
    });

    this.breadcrumbService.setBreadcrumbs(breadcrumbs);
  }

  setTitle(title) {
    this.breadcrumbService.setPageName(title);
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
      [this.rangeProperty]: [null],
      [this.startDateProperty]: [moment().subtract(1, 'days'), Validators.required],
      [this.endDateProperty]: [moment(), Validators.required],
      [this.startTimeProperty]: ['00:00'],
      [this.endTimeProperty]: ['00:00'],
      [this.showLineChartProperty]: [true, null],
      [this.showTableProperty]: [true, null],
      [this.registerSearchProperty]: [null],
      [this.datePickerText]: [null]
    });
  }

  showData(register: AutoTemplateRegister, forceRefresh: boolean = false) {
    const startDate = moment(this.form.get('startDate').value).toDate();
    const endDate = moment(this.form.get('endDate').value).toDate();

    if (!register || !startDate || !endDate) {
      this.isDataFound = false;
      return;
    }

    startDate.setHours(this.form.get(this.startTimeProperty).value.split(':')[0]);
    startDate.setMinutes(this.form.get(this.startTimeProperty).value.split(':')[1]);
    endDate.setHours(this.form.get(this.endTimeProperty).value.split(':')[0]);
    endDate.setMinutes(this.form.get(this.endTimeProperty).value.split(':')[1]);

    if (!forceRefresh && register === this.selectedRegister) {
      return;
    }

    this.selectedRegister = register;
    this.startTime = moment(startDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    this.endTime = moment(endDate).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
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
          this.registerStatisticsData = this.registerStatisticsService.getRegisterStatistics(this.rowData);

          this.setEventData();

          this.chartCategories = values.map((v) => new Date(v.timestamp));
          this.chartData = [values];
          if (values[0].valueWithUnit?.unit) {
            this.unit = values[0].valueWithUnit.unit;
          }
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
      outData = this.rowData.map((d: EventRegisterValue) => ({ timestamp: new Date(d.timestamp).setMinutes(0, 0, 0), value: d.value }));
    } else {
      outData = this.rowData.map((d: EventRegisterValue) => ({ timestamp: new Date(d.timestamp).setHours(0, 0, 0, 0), value: d.value }));
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
      this.showStatistics = this.selectedRegister.categorization !== 'INSTANTANEOUS_VALUE';
    }
  }

  getLocalDateWithTimeString(dateTime: Date): string {
    return dateTime ? `${formatDate(dateTime, environment.dateTimeFormat)}` : '';
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

  onRefresh() {
    this.showData(this.selectedRegister, true);
  }

  insertedSearchValue(searchValue) {
    this.setRegisterGroups(searchValue);
  }

  closePopover() {
    this.popover.close();
    this.setDate();
  }
}
