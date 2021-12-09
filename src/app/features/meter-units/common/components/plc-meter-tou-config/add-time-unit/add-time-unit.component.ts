import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SortDescriptor } from '@progress/kendo-data-query';
import * as moment from 'moment';
import { EventManagerService } from '../../../../../../core/services/event-manager.service';
import { ToastNotificationService } from '../../../../../../core/toast-notification/services/toast-notification.service';
import { FormData } from '../../../../../../shared/card-item/card-item.component';
import { GridColumn, GridRowAction } from '../../../../../../shared/data-table/data-table.component';
import { Codelist } from '../../../../../../shared/repository/interfaces/codelists/codelist.interface';
import { TouConfigService } from '../../../services/tou-config.service';
import { StepModel } from '../../../services/wizard.service';

export enum TimeUnitTypeClient {
  DAY = 'DAY',
  WEEK = 'WEEK',
  SEASON = 'SEASON'
}

export interface UnitClient {
  id: number;
  description: string;
  unit: Array<any>;
  fakeId?: number;
}

export interface TimeUnitClient {
  startTime: string;
  scriptId: number;
}

export interface WeekUnitClient {
  day: string;
  dayId: number;
}

export interface SeasonUnitClient {
  date: string;
  weekId: number;
}

@Component({
  selector: 'app-add-time-unit',
  templateUrl: './add-time-unit.component.html',
  styleUrls: ['./add-time-unit.component.scss']
})
export class AddTimeUnitComponent implements OnInit {
  @Input() title = '';
  @Input() type: TimeUnitTypeClient;
  @Input() units: Array<UnitClient> = [];

  form: FormGroup;
  weekForm: FormGroup;
  seasonForm: FormGroup;

  selectedTypeEnum = TimeUnitTypeClient;
  selectedUnit: UnitClient;
  controls: Array<FormData> = [];

  @Input() days: Codelist<number>[];
  @Input() weeks: Codelist<number>[];

  dayActionsConfiguration: Array<GridColumn> = [
    {
      field: 'startTime',
      translationKey: 'GRID.START-TIME'
    },
    {
      field: 'scriptId',
      translationKey: 'GRID.SCRIPT-ACTION-ID'
    }
  ];

  dayActionsRowActionsConfiguration: Array<GridRowAction> = [
    {
      actionName: 'delete',
      iconName: 'delete-icon'
    }
  ];

  dayTableDefaultSort: SortDescriptor[] = [
    {
      field: 'startTime',
      dir: 'asc'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private touService: TouConfigService,
    private toast: ToastNotificationService,
    private translate: TranslateService,
    private eventsService: EventManagerService
  ) {}

  get wf() {
    return Object.keys(this.weekForm.controls);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: ['', Validators.required],
      description: ['', Validators.required],
      startTime: ['00:00', Validators.required],
      scriptId: [1, Validators.required]
    });
    // init forms
    this.initForms();

    // disable next buttons if form is invalid
    this.form.statusChanges.subscribe((res) => {
      this.disableButton(res);
    });

    if (this.units?.length > 0) {
      this.selectUnit(this.units[0]);
      if (this.type === TimeUnitTypeClient.WEEK) {
        this.patchDays();
      }
      if (this.type === TimeUnitTypeClient.SEASON) {
        this.patchWeeks();
      }
    }
  }

  addNew() {
    switch (this.type) {
      case TimeUnitTypeClient.DAY:
        const day = {
          description: 'Day ' + (this.units.length + 1),
          id: this.units.length + 1,
          unit: [],
          fakeId: this.generateFakeId()
        };
        this.units.push(day);
        this.selectUnit(day);
        break;
      case TimeUnitTypeClient.WEEK:
        const week = {
          description: 'Week ' + (this.units.length + 1),
          id: this.units.length + 1,
          unit: [],
          fakeId: this.generateFakeId()
        };
        this.units.push(week);
        this.selectUnit(week);
        this.initForms();
        this.addDaysToWeek();
        break;
      case TimeUnitTypeClient.SEASON:
        const season = {
          description: 'Season ' + (this.units.length + 1),
          id: this.units.length + 1,
          unit: []
        };
        this.initForms();
        this.units.push(season);
        this.selectUnit(season);
        this.addWeeksToSeason();
        break;
    }
    this.updateWizardStepCompleteness();
  }

  selectUnit(unit: UnitClient) {
    this.selectedUnit = unit;
    this.patchValues();
    if (this.type === TimeUnitTypeClient.WEEK) {
      this.patchDays();
    }
    if (this.type === TimeUnitTypeClient.SEASON) {
      this.patchWeeks();
    }
  }

  addTimeToDay() {
    const exist = this.selectedUnit.unit.find((unit) => unit.startTime === this.form.get('startTime').value);
    if (!exist) {
      this.selectedUnit = this.units.find((day) => day === this.selectedUnit);
      const time: TimeUnitClient = {
        startTime: this.form.get('startTime').value,
        scriptId: this.form.get('scriptId').value
      };
      this.selectedUnit.unit.push(time);
      this.selectedUnit.unit = [...this.selectedUnit.unit]; // change detection for KendoUi grid
      this.updateWizardStepCompleteness();
    } else {
      this.toast.errorToast(this.translate.instant('TOU-CONFIG.ADD-DAY-ACTION-DUPLICATE-ERROR'));
    }
  }

  patchValues() {
    this.form.get('id').patchValue(this.selectedUnit.id);
    this.form.get('description').patchValue(this.selectedUnit.description);
    this.checkId();
  }

  saveUnit() {
    if (this.form.valid) {
      this.selectedUnit.id = this.form.get('id').value;
      this.selectedUnit.description = this.form.get('description').value;
    }

    if (this.type === TimeUnitTypeClient.WEEK) {
      if (this.weekForm?.valid) {
        this.selectedUnit.unit = [];
        this.addDaysToWeek();
        this.disableButton('VALID');
      } else {
        this.disableButton('INVALID');
      }
    }
    if (this.type === TimeUnitTypeClient.SEASON) {
      if (this.seasonForm?.valid) {
        this.selectedUnit.unit = [];
        this.addWeeksToSeason();
        this.disableButton('VALID');
      } else {
        this.disableButton('INVALID');
      }
    }
  }

  removeUnit() {
    let exist = false;
    switch (this.type) {
      case TimeUnitTypeClient.DAY:
        // check if DAY item is in use
        const weeks = this.touService.getTouConfig().weeks;
        if (weeks) {
          weeks.units?.forEach((unit) => {
            if (unit.unit.find((x) => x.dayId.id === this.selectedUnit.id)) {
              exist = true;
            }
          });
        }
        const specialDays = this.touService.getTouConfig().specialDays;
        if (specialDays && specialDays.find((specialDay) => specialDay.dayId.id === this.selectedUnit.id)) {
          exist = true;
        }
        break;
      case TimeUnitTypeClient.WEEK:
        const seasons = this.touService.getTouConfig().seasons;
        seasons?.units?.forEach((unit) => {
          if (unit.unit.find((x) => x.weekId.id === this.selectedUnit.id)) {
            exist = true;
          }
        });
        break;
    }
    if (exist) {
      this.toast.errorToast(this.translate.instant('TOU-CONFIG.DELETE-ITEM-ERROR'));
    } else {
      // remove element from existing array without creating new array
      this.units.forEach((unit, index) => {
        if (unit.id == this.selectedUnit.id) {
          this.units.splice(index, 1);
        }
      });
      this.selectedUnit = this.units[this.units.length - 1];
      if (this.selectedUnit) {
        this.patchValues();
      }
      this.updateWizardStepCompleteness();
    }
  }

  addDaysToWeek() {
    this.selectedUnit = this.units.find((day) => day === this.selectedUnit);
    this.wf.forEach((w) => {
      const week: WeekUnitClient = {
        day: w,
        dayId: this.weekForm.get(w).value
      };
      this.selectedUnit.unit.push(week);
    });
  }

  addWeeksToSeason() {
    this.selectedUnit = this.units.find((day) => day === this.selectedUnit);
    const season: SeasonUnitClient = {
      date: this.seasonForm.get('startDate').value,
      weekId: this.seasonForm.get('week').value
    };
    this.selectedUnit.unit.push(season);
  }

  isSelectedButton(unit) {
    if (this.selectedUnit === unit) {
      return 'violet';
    }
  }

  patchDays() {
    if (this.selectedUnit.unit.length > 0) {
      this.wf.forEach((w) => {
        const value = this.days.find((day) => day.fakeId == this.selectedUnit.unit.find((d) => d.day === w).dayId.fakeId);
        this.weekForm.get(w).patchValue(value);
      });
      this.saveUnit();
    }
  }

  patchWeeks() {
    if (this.selectedUnit.unit.length > 0) {
      this.seasonForm.get('startDate').patchValue(new Date(this.selectedUnit.unit[0].date));
      this.seasonForm.get('endDate').patchValue(new Date(this.selectedUnit.unit[0].date));
      const value = this.weeks.find((week) => week.fakeId == this.selectedUnit.unit[0].weekId.fakeId);
      this.seasonForm.get('week').patchValue(value);
      this.saveUnit();
    }
  }

  initForms() {
    switch (this.type) {
      case TimeUnitTypeClient.WEEK:
        this.weekForm = this.fb.group({
          mo: [this.days[0], Validators.required],
          tu: [this.days[0], Validators.required],
          we: [this.days[0], Validators.required],
          th: [this.days[0], Validators.required],
          fr: [this.days[0], Validators.required],
          sa: [this.days[0], Validators.required],
          su: [this.days[0], Validators.required]
        });
        break;
      case TimeUnitTypeClient.SEASON:
        this.seasonForm = this.fb.group({
          week: [this.weeks[0], Validators.required],
          startDate: [moment().set('minute', 0).set('hour', 0).toDate(), Validators.required],
          endDate: [moment().set('minute', 0).set('hour', 0).toDate()]
        });
        break;
    }
  }

  rowActionsClicked(event: any) {
    this.selectedUnit.unit = this.selectedUnit.unit.filter((day) => day.startTime !== event.rowData.startTime);
    this.updateWizardStepCompleteness();
  }

  onIdChanged() {
    this.checkId();
    this.saveUnit();
  }

  checkId() {
    const inputValue: number = this.form.get('id').value;
    if (this.units.filter((unit) => unit.id === inputValue).length > 1) {
      this.form.get('id').setErrors({ duplicatedId: true });
      this.form.get('id').markAsDirty();
    }
  }

  disableButton(res) {
    if (res === 'INVALID') {
      if (this.form.invalid || this.weekForm?.invalid || this.seasonForm.invalid) {
        this.eventsService.emitCustom('DisableNextButton', true);
        this.updateWizardStepCompleteness(false);
      }
    } else if (this.form.valid) {
      this.eventsService.emitCustom('DisableNextButton', false);
      this.updateWizardStepCompleteness(true);
    }
  }

  updateWizardStepCompleteness(completed?: boolean) {
    // If no parameter is given of if the parameter is equal to true, check if all time units are set and populated
    if (completed !== false && this.units) {
      const allUnits = this.units.length;
      const unitsWithUnitPopulated = this.units.filter((x) => x.unit && x.unit.length > 0).length;
      completed = allUnits > 0 && allUnits == unitsWithUnitPopulated;
    }
    const TimeUnitTypeClientNumber = new Map<TimeUnitTypeClient, number>([
      [TimeUnitTypeClient.DAY, 2],
      [TimeUnitTypeClient.WEEK, 3],
      [TimeUnitTypeClient.SEASON, 4]
    ]);
    const step: StepModel = {
      stepIndex: TimeUnitTypeClientNumber.get(this.type),
      completed: completed
    };
    this.eventsService.emitCustom('UpdateWizardStepCompleteness', step);
  }

  generateFakeId() {
    if (this.units && this.units.length > 0) {
      return Math.max(...this.units.map((o) => o.fakeId), 0) + 1;
    } else {
      return 1;
    }
  }
}
