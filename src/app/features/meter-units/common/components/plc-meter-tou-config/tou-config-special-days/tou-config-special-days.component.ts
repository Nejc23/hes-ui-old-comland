import { Component, OnInit } from '@angular/core';
import { StepModel, TouWizardService } from '../../../services/wizard.service';
import { TimeUnitTypeClient } from '../add-time-unit/add-time-unit.component';
import { TimeUnitsClient, TouConfigService } from '../../../services/tou-config.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Codelist } from '../../../../../../shared/repository/interfaces/codelists/codelist.interface';
import * as moment from 'moment';
import { GridColumn, GridColumnType, GridRowAction } from '../../../../../../shared/data-table/data-table.component';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SortDescriptor } from '@progress/kendo-data-query';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { EventManagerService } from 'src/app/core/services/event-manager.service';

@Component({
  selector: 'app-tou-config-special-days',
  templateUrl: './tou-config-special-days.component.html',
  styleUrls: ['./tou-config-special-days.component.scss']
})
export class TouConfigSpecialDaysComponent implements OnInit {
  specialDaysForm: FormGroup;
  days: TimeUnitsClient;
  daysCodeList: Codelist<number>[] = [];
  specialDays: any[]; // todo type

  specialDaysConfiguration: Array<GridColumn> = [
    {
      field: 'startDate',
      translationKey: 'GRID.DATE',
      type: GridColumnType.DATE_ONLY
    },
    {
      field: 'year',
      translationKey: 'GRID.YEAR'
    },
    {
      field: 'dayId',
      translationKey: 'GRID.DAY-ID',
      type: GridColumnType.CODE_LIST
    }
  ];

  specialDayRowActionsConfiguration: Array<GridRowAction> = [
    {
      actionName: 'delete',
      iconName: 'delete-icon'
    }
  ];

  specialDaysDefaultSort: SortDescriptor[] = [
    {
      field: 'startDate',
      dir: 'asc'
    }
  ];

  constructor(
    private wizardService: TouWizardService,
    private touService: TouConfigService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private toast: ToastNotificationService,
    private eventsService: EventManagerService
  ) {}

  ngOnInit(): void {
    if (this.touService.getTouConfig().days) {
      this.days = this.touService.getTouConfig().days;
    } else {
      this.days = this.touService.getTimeUnits(TimeUnitTypeClient.DAY);
    }
    const dayUnits = this.days.units;
    if (this.touService.getTouConfig().specialDays) {
      this.specialDays = this.touService.getTouConfig().specialDays;
      // If days have been changed, we need to "fix" the existing special days data
      this.specialDays.forEach(function (specialDay) {
        specialDay.dayId = dayUnits.find((d) => d.fakeId === specialDay.dayId.fakeId);
        specialDay.dayId.value = specialDay.dayId.description;
      });
      this.mapData();
    }
    this.days.units.forEach((unit) => {
      this.daysCodeList.push({
        id: unit.id,
        value: unit.description,
        fakeId: unit.fakeId
      });
    });
    this.specialDaysForm = this.fb.group({
      startDate: [new Date(), Validators.required],
      dayId: [this.daysCodeList[0], Validators.required],
      annually: [false]
    });
  }

  nextStep() {
    this.touService.addSpecialDays(this.specialDays);
    this.wizardService.setCurrentStep({ stepIndex: 5, completed: true });
    this.wizardService.moveToNextStep();
  }

  addSpecialDay() {
    const specialDay = {
      startDate: this.specialDaysForm.get('startDate').value, // moment(startDateTimeValue).format('L') todo check
      dayId: this.specialDaysForm.get('dayId').value,
      annually: this.specialDaysForm.get('annually').value
    };
    const exist = this.specialDays.find(
      (day) =>
        new Date(day.startDate).getMonth() === specialDay.startDate.getMonth() &&
        new Date(day.startDate).getDate() === specialDay.startDate.getDate()
    );
    if (!exist) {
      this.specialDays.push(specialDay);
      this.mapData();
      this.touService.addSpecialDays(this.specialDays);
      this.updateWizardStepCompleteness();
    } else {
      this.toast.errorToast(this.translate.instant('TOU-CONFIG.ADD-SPECIAL-DAY-DUPLICATE-ERROR'));
    }
  }

  mapData() {
    this.specialDays.map((day) => day.dayId.id + ' (' + day.dayId.value + ')');
    this.specialDays = this.specialDays.map((specialDay, index) => ({
      ...specialDay,
      year: specialDay.annually ? this.translate.instant('GRID.EVERY-YEAR') : moment(specialDay.startDate).toDate().getFullYear(),
      index: index
    }));
    this.specialDays = [...this.specialDays];
  }

  rowActionsClicked(event: any) {
    this.specialDays = this.specialDays.filter((day) => day.index !== event.rowData.index);
    this.specialDays = [...this.specialDays];
    this.touService.addSpecialDays(this.specialDays);
    this.updateWizardStepCompleteness();
  }

  previousStep() {
    this.router.navigate(['/configuration/importTouConfiguration/wizard/season']);
  }

  isValid() {
    return this.specialDays.length > 0;
  }

  updateWizardStepCompleteness() {
    const step: StepModel = {
      stepIndex: 5,
      completed: this.specialDays.length > 0
    };
    this.eventsService.emitCustom('UpdateWizardStepCompleteness', step);
  }
}
