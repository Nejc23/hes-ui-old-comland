import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SortDescriptor } from '@progress/kendo-data-query';
import * as moment from 'moment';
import { SpecialDayCreateDto } from 'src/app/api/time-of-use/models';
import { ToastNotificationService } from 'src/app/core/toast-notification/services/toast-notification.service';
import { TimeUnitClientType } from 'src/app/enums/tou-configuration/TimeUnitTypeClientEnum';
import { TouWizardMode } from 'src/app/enums/tou-configuration/TouWizardModeEnum';
import { DayUnitClient } from 'src/app/models/tou-configuration/DayUnitClient';
import { SpecialDayUnitClient } from 'src/app/models/tou-configuration/SpecialDayUnitClient';
import { TimeUnitsClient } from 'src/app/models/tou-configuration/TimeUnitsClient';
import { UnitClient } from 'src/app/models/tou-configuration/UnitClient';
import { UnitCodeListItemClient } from 'src/app/models/tou-configuration/UnitCodeListItemClient';
import { GridColumn, GridColumnType, GridRowAction } from '../../../../../../shared/data-table/data-table.component';
import { TouConfigService } from '../../../services/tou-config.service';
import { TouWizardService } from '../../../services/wizard.service';

@Component({
  selector: 'app-tou-config-special-days',
  templateUrl: './tou-config-special-days.component.html',
  styleUrls: ['./tou-config-special-days.component.scss']
})
export class TouConfigSpecialDaysComponent implements OnInit {
  specialDaysForm: FormGroup;
  days: TimeUnitsClient<number, DayUnitClient>;
  daysCodeList: UnitCodeListItemClient<number>[] = [];
  specialDays: SpecialDayUnitClient[];

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
      field: 'dayTextField',
      translationKey: 'GRID.DAY-EXTERNALID',
      class: 'tw-flex'
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
    private toast: ToastNotificationService
  ) {}

  ngOnInit(): void {
    if (this.touService.getTouConfig().days) {
      this.days = this.touService.getTouConfig().days;
    } else {
      this.days = this.touService.getTimeUnits(TimeUnitClientType.DAY) as TimeUnitsClient<number, DayUnitClient>;
    }
    const dayUnits = this.days.units;
    if (this.touService.getTouConfig().specialDays) {
      this.specialDays = this.touService.getTouConfig().specialDays;
      // If days have been changed, we need to "fix" the existing special days data
      this.specialDays.forEach(function (specialDay) {
        let dayUnit: UnitClient<number, DayUnitClient>;
        // In duplicate and edit mode we are referencing by ids
        if (specialDay.day.id) {
          dayUnit = dayUnits.find((d) => d.id === specialDay.day.id);
        }
        // In create new mode we are referencing by fake ids
        else {
          dayUnit = dayUnits.find((d) => d.fakeId === specialDay.day.fakeId);
        }
        specialDay.day.externalId = dayUnit.externalId;
        specialDay.day.value = dayUnit.description;
        specialDay.day.textField = `${dayUnit.externalId} (${dayUnit.description})`;
      });
      this.mapData();
    }
    this.days.units.forEach((unit) => {
      // Filter unsaved unit on edit.
      if (this.isCreateMode() || (this.isEditMode() && unit.id)) {
        this.daysCodeList.push({
          id: unit.id,
          externalId: unit.externalId,
          value: unit.description,
          textField: `${unit.externalId} (${unit.description})`,
          fakeId: unit.fakeId
        });
      }
    });
    this.specialDaysForm = this.fb.group({
      id: [this.touService.getTouConfig().basic.id, this.isEditMode() ? Validators.required : null],
      startDate: [new Date(), Validators.required],
      dayId: [this.daysCodeList[0], Validators.required],
      annually: [false]
    });
  }

  mapData() {
    this.specialDays = this.specialDays.map((specialDay, index) => ({
      ...specialDay,
      year: specialDay.annually ? this.translate.instant('GRID.EVERY-YEAR') : moment(specialDay.startDate).toDate().getFullYear(),
      rowIndex: index,
      dayTextField: `${specialDay.day.externalId} (${specialDay.day.value})`
    }));
    this.specialDays = [...this.specialDays];
  }

  nextStep() {
    this.touService.addSpecialDays(this.specialDays);
    this.wizardService.setCurrentStep({ stepIndex: 5, completed: true });
    this.wizardService.moveToNextStep();
  }

  previousStep() {
    this.router.navigate(['/configuration/importTouConfiguration/wizard/season']);
  }

  addSpecialDay() {
    const specialDay: SpecialDayUnitClient = {
      id: this.specialDaysForm.get('dayId').value.id,
      startDate: moment(this.specialDaysForm.get('startDate').value).toDate(),
      day: this.specialDaysForm.get('dayId').value,
      annually: this.specialDaysForm.get('annually').value,
      dayTextField: `${this.specialDaysForm.get('dayId').value.externalId} (${this.specialDaysForm.get('dayId').value.value})`
    };
    const exist = this.specialDays.find(
      (day) =>
        new Date(day.startDate).getMonth() === specialDay.startDate.getMonth() &&
        new Date(day.startDate).getDate() === specialDay.startDate.getDate()
    );
    if (!exist) {
      if (this.isEditMode()) {
        const newSpecailDay: SpecialDayCreateDto = {
          dayId: specialDay.day.id,
          day: moment(specialDay.startDate).toDate().getDate(),
          month: moment(specialDay.startDate).toDate().getMonth() + 1,
          year: specialDay.annually ? null : moment(specialDay.startDate).toDate().getFullYear()
        };
        this.touService.addSpecialDay(this.touService.getTouConfig().basic.id, newSpecailDay).subscribe(
          (res) => {
            specialDay.id = res.body.replace(/['"]+/g, '');
            this.toast.successToast(this.translate.instant('TOU-CONFIG.CONFIGURATION-UPDATED'));
            this.addSpecialDayToSpecialDayClient(specialDay);
          },
          (err: HttpErrorResponse) => {
            this.toast.errorToast(this.translate.instant(`TOU-CONFIG.API.${err.error}`));
          }
        );
      } else {
        this.addSpecialDayToSpecialDayClient(specialDay);
      }
    } else {
      this.toast.errorToast(this.translate.instant('TOU-CONFIG.ADD-SPECIAL-DAY-DUPLICATE-ERROR'));
    }
  }

  rowActionsClicked(event: any) {
    if (this.isEditMode()) {
      this.touService.deleteSpecialDay(this.touService.getTouConfig().basic.id, event.rowData.id).subscribe(
        () => {
          this.removeSpecialDayClient(event.rowData.rowIndex);
        },
        (err: HttpErrorResponse) => {
          this.toast.errorToast(this.translate.instant(`TOU-CONFIG.API.${err.error}`));
        }
      );
    } else {
      this.removeSpecialDayClient(event.rowData.rowIndex);
    }
  }

  isEditMode() {
    return this.touService.touWizardMode === TouWizardMode.EDIT;
  }

  isCreateMode() {
    return this.touService.touWizardMode === TouWizardMode.CREATE;
  }

  private addSpecialDayToSpecialDayClient(specialDay: SpecialDayUnitClient) {
    this.specialDays.push(specialDay);
    this.mapData();
    this.touService.addSpecialDays(this.specialDays);
  }

  private removeSpecialDayClient(index: number) {
    this.specialDays = this.specialDays.filter((day) => day.rowIndex !== index);
    this.touService.addSpecialDays(this.specialDays);
  }
}
