import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { RadioOption } from 'src/app/shared/forms/interfaces/radio-option.interface';
import * as _ from 'lodash';
import { nameOf } from 'src/app/shared/utils/helpers/name-of-factory.helper';
import { SchedulerJob, SchedulerJobForm } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
import { PlcMeterReadScheduleService } from '../../../meter-units/services/plc-meter-read-scheduler.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { DataConcentratorUnitsSelectComponent } from 'src/app/features/data-concentrator-units-select/component/data-concentrator-units-select.component';
import { DataConcentratorUnitsSelectGridService } from 'src/app/features/data-concentrator-units-select/services/data-concentrator-units-select-grid.service';

@Component({
  selector: 'app-scheduler-discovery-job',
  templateUrl: './scheduler-discovery-job.component.html'
})
export class SchedulerDiscoveryJobComponent implements OnInit {
  @ViewChild(DataConcentratorUnitsSelectComponent, { static: false }) listOfDCUs: DataConcentratorUnitsSelectComponent;
  @Input() selectedJobId: string;
  @Input() deviceFiltersAndSearch: GridBulkActionRequestParams;

  form: FormGroup;
  readOptions: RadioOption[] = [
    { value: '1' as string, label: this.i18n('One-time'), labelSmall: this.i18n('Once') },
    { value: '2' as string, label: this.i18n('Minute(s)'), labelSmall: this.i18n('Every N minute(s)') },
    { value: '3' as string, label: this.i18n('Hour(s)'), labelSmall: this.i18n('Every N hour(s)') },
    { value: '4' as string, label: this.i18n('Daily'), labelSmall: this.i18n('Every day specific time') },
    { value: '5' as string, label: this.i18n('Weekly'), labelSmall: this.i18n('One or more days of the week') },
    { value: '6' as string, label: this.i18n('Monthly'), labelSmall: this.i18n('One or more days in the month') }
  ];
  weekDays: Codelist<number>[] = [
    { id: 1, value: this.i18n('Mon-Fri') },
    { id: 2, value: this.i18n('Mon') },
    { id: 3, value: this.i18n('Tue') },
    { id: 4, value: this.i18n('Wed') },
    { id: 5, value: this.i18n('Thu') },
    { id: 6, value: this.i18n('Fri') },
    { id: 7, value: this.i18n('Sat') },
    { id: 8, value: this.i18n('Sun') }
  ];
  selectedId = 0;
  monthDays: number[] = [];
  noDCUs = false;
  noMonthDays = false;
  requiredText = this.i18n('Required field');

  jobsTimeUnits$: Observable<Codelist<number>[]>;
  jobsTimeUnits: Codelist<number>[];
  defaultTimeUnit: Codelist<number>;
  step = 1;

  constructor(
    private meterService: PlcMeterReadScheduleService,
    private codelistService: CodelistRepositoryService,
    private jobsService: JobsService,
    private formBuilder: FormBuilder,
    private formUtils: FormsUtilsService,
    public i18n: I18n,
    private modal: NgbActiveModal,
    private dataConcentratorUnitsSelectGridService: DataConcentratorUnitsSelectGridService
  ) {}

  createForm(formData: SchedulerJob): FormGroup {
    return this.formBuilder.group({
      [this.readOptionsProperty]: [formData ? formData.readOptions.toString() : '1', Validators.required],
      [this.nMinutesProperty]: [formData ? formData.nMinutes : null],
      [this.nHoursProperty]: [formData ? formData.nHours : null],
      [this.timeProperty]: [formData ? moment(formData.dateTime).toDate() : new Date(new Date().toISOString().substring(0, 10) + 'T00:01')],
      [this.weekDaysProperty]: [formData ? formData.weekDays : []],
      [this.monthDaysProperty]: [formData ? formData.monthDays : []],
      [this.registersProperty]: [formData ? formData.registers : [], Validators.required],
      [this.descriptionProperty]: [formData ? formData.description : null, Validators.maxLength(500)],
      [this.enableProperty]: [formData ? formData.enable : true]
    });
  }

  ngOnInit() {
    this.jobsTimeUnits$ = this.codelistService.timeUnitCodeslist();
    this.jobsTimeUnits$.subscribe(units => {
      this.jobsTimeUnits = units;
      this.defaultTimeUnit = this.jobsTimeUnits.find(x => x.id === 3);

      if (this.selectedJobId) {
        this.jobsService.getJob(this.selectedJobId).subscribe(data => {
          this.selectedId = data.readOptions;
          this.form = this.createForm(data);
          // fill session with selected importTemplates
          this.dataConcentratorUnitsSelectGridService.setSessionSettingsSelectedRowsById(data.bulkActionsRequestParam.id);
          this.changeReadOptionId();
          this.form.get(this.registersProperty).clearValidators();
        });
      } else {
        this.form = this.createForm(null);
        this.changeReadOptionId();
        this.form.get(this.registersProperty).clearValidators();
      }
    });
  }

  fillData(): SchedulerJobForm {
    const ids = this.form.get(this.registersProperty).value;
    if (ids != null) {
      const concentrList: string[] = [];
      ids.forEach(id => {
        concentrList.push(id.concentratorId);
      });
      this.deviceFiltersAndSearch = {
        id: concentrList
      };
    }
    const formData: SchedulerJobForm = {
      readOptions: parseInt(this.form.get(this.readOptionsProperty).value, 10),
      nMinutes: this.show_nMinutes() || this.show_nHours() ? parseInt(this.form.get(this.nMinutesProperty).value, 10) : 0,
      nHours: this.show_nHours() ? parseInt(this.form.get(this.nHoursProperty).value, 10) : 0,
      time: this.showTime() ? this.form.get(this.timeProperty).value : null,
      weekDays: this.showWeekDays() ? this.form.get(this.weekDaysProperty).value : [],
      monthDays: this.showMonthDays() ? this.form.get(this.monthDaysProperty).value : [],
      registers: null,
      iec: false,
      description: this.form.get(this.descriptionProperty).value,
      dateTime: this.showDateTime() ? this.form.get(this.timeProperty).value : null,
      bulkActionsRequestParam: this.deviceFiltersAndSearch,
      usePointer: false,
      intervalRange: 0,
      timeUnit: 0,
      actionType: 1,
      enable: this.form.get(this.enableProperty).value
    };

    return formData;
  }

  resetAll() {
    this.step = 1;
    this.form.reset();
    this.monthDays = [];
    this.listOfDCUs.deselectAllRows();
    this.selectedId = 0;
  }

  save(addNew: boolean) {
    const selectedData = this.listOfDCUs.getSelectedRowIds();
    this.noDCUs = selectedData.length === 0;

    this.form.get(this.registersProperty).setValue(selectedData);
    this.noMonthDays = this.form.get(this.monthDaysProperty).value !== null && this.form.get(this.monthDaysProperty).value.length === 0;
    const values = this.fillData();
    let request: Observable<SchedulerJob> = null;
    let operation = this.i18n('added');
    if (this.selectedJobId) {
      operation = this.i18n(`updated`);
      request = this.meterService.updateMeterUnitsReadScheduler(values, this.selectedJobId);
    } else {
      request = this.meterService.createMeterUnitsReadScheduler(values);
    }
    const successMessage = this.i18n(`Data Concentrator Discovery Scheduler was ${operation} successfully`);
    this.formUtils.saveForm(this.form, request, successMessage).subscribe(
      result => {
        if (addNew) {
          this.resetAll();
        } else {
          this.modal.close();
        }
      },
      () => {} // error
    );
  }

  cancel() {
    this.modal.dismiss();
  }

  changeReadOptionId() {
    const selectedValuesForTimeProperty = [1, 4, 5, 6];
    this.selectedId = parseInt(this.form.get(this.readOptionsProperty).value, 10);
    this.form
      .get(this.timeProperty)
      .setValidators(_.find(selectedValuesForTimeProperty, x => x === this.selectedId) ? [Validators.required] : []);
    this.form
      .get(this.nMinutesProperty)
      .setValidators(this.show_nMinutes() || this.show_nHours() ? [Validators.required, Validators.max(59)] : []);
    this.form.get(this.nHoursProperty).setValidators(this.show_nHours() ? [Validators.required, Validators.max(23)] : []);
    this.form.get(this.weekDaysProperty).setValidators(this.showWeekDays() ? [Validators.required] : []);
    this.form.get(this.monthDaysProperty).setValidators(this.showMonthDays() ? [Validators.required] : []);
    if (this.show_nHours() && !this.form.get(this.nMinutesProperty).value) {
      this.form.get(this.nMinutesProperty).setValue(0);
    }
  }

  onDayInMonthClick(dayinMonth: number) {
    const result = _.find(this.monthDays, x => x === dayinMonth) ? true : false;
    if (!result) {
      this.monthDays.push(dayinMonth);
    } else {
      _.remove(this.monthDays, x => x === dayinMonth);
    }
    const realMonthDays = this.monthDays.map(day => (day = day + 1));
    const daysSorted = realMonthDays.sort((a, b) => a - b);
    this.noMonthDays = daysSorted.length === 0;
    this.form.get(this.monthDaysProperty).setValue(daysSorted);
  }

  isDayInMonthSelected(index: number) {
    let isChecked = false;
    for (const dayNo of this.monthDays) {
      if (dayNo === index) {
        isChecked = true;
      }
    }
    return isChecked;
  }

  selectionChanged(hasValues: boolean) {
    this.noDCUs = !hasValues;
  }

  // properties - START
  get readOptionsProperty() {
    return nameOf<SchedulerJobForm>(o => o.readOptions);
  }

  get nMinutesProperty() {
    return nameOf<SchedulerJobForm>(o => o.nMinutes);
  }

  show_nMinutes() {
    return this.selectedId === 2;
  }

  get nHoursProperty() {
    return nameOf<SchedulerJobForm>(o => o.nHours);
  }

  show_nHours() {
    return this.selectedId === 3;
  }

  get timeProperty() {
    return nameOf<SchedulerJobForm>(o => o.time);
  }

  showTime() {
    const idsForTime = [4, 5, 6];
    const found = _.find(idsForTime, x => x === this.selectedId);
    return found !== undefined;
  }

  showDateTime() {
    return this.selectedId === 1;
  }

  get weekDaysProperty() {
    return nameOf<SchedulerJobForm>(o => o.weekDays);
  }

  showWeekDays() {
    return this.selectedId === 5;
  }

  get monthDaysProperty() {
    return nameOf<SchedulerJobForm>(o => o.monthDays);
  }

  showMonthDays() {
    return this.selectedId === 6;
  }

  get registersProperty() {
    return nameOf<SchedulerJobForm>(o => o.registers);
  }

  get descriptionProperty() {
    return nameOf<SchedulerJobForm>(o => o.description);
  }

  get enableProperty() {
    return nameOf<SchedulerJobForm>(o => o.enable);
  }

  // properties - END

  onDismiss() {
    this.modal.dismiss();
  }

  next(value) {
    // check form
    if (value > 0 && !this.form.valid) {
      return;
    }
    this.step = this.step + value;
    if (this.step === 2) {
      this.form.get(this.registersProperty).setValidators(Validators.required);
    } else {
      this.form.get(this.registersProperty).clearValidators();
    }
  }
}
