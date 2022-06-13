import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { parseNumber } from '@progress/kendo-angular-intl';
import { SortDescriptor } from '@progress/kendo-data-query';
import * as _ from 'lodash';
import * as moment from 'moment';
import { SeasonCreateDto, SeasonUpdateDto } from 'src/app/api/time-of-use/models';
import { ModalService } from 'src/app/core/modals/services/modal.service';
import { TimeUnitClientType } from 'src/app/enums/tou-configuration/TimeUnitTypeClientEnum';
import { TouWizardMode } from 'src/app/enums/tou-configuration/TouWizardModeEnum';
import { UnsavedChangesModal } from 'src/app/features/helpers/unsaved-changes-modal';
import { DayUnitClient } from 'src/app/models/tou-configuration/DayUnitClient';
import { SeasonUnitClient } from 'src/app/models/tou-configuration/SeasonUnitClient';
import { UnitClient } from 'src/app/models/tou-configuration/UnitClient';
import { UnitCodeListItemClient } from 'src/app/models/tou-configuration/UnitCodeListItemClient';
import { WeekUnitClient } from 'src/app/models/tou-configuration/WeekUnitClient';
import { ModalConfirmComponent } from 'src/app/shared/modals/components/modal-confirm.component';
import { EventManagerService } from '../../../../../../core/services/event-manager.service';
import { ToastNotificationService } from '../../../../../../core/toast-notification/services/toast-notification.service';
import { FormData } from '../../../../../../shared/card-item/card-item.component';
import { GridColumn, GridRowAction } from '../../../../../../shared/data-table/data-table.component';
import { TouConfigurationHelper } from '../../../../../helpers/tou-configuration.helper';
import { TouConfigService } from '../../../services/tou-config.service';
import { StepModel } from '../../../services/wizard.service';
import { TouConfigErrorHandler } from '../tou-config-error-handler/tou-config-error-handler';

@Component({
  selector: 'app-add-time-unit',
  templateUrl: './add-time-unit.component.html',
  styleUrls: ['./add-time-unit.component.scss']
})
export class AddTimeUnitComponent implements OnInit {
  @Input() title = '';
  @Input() type: TimeUnitClientType;
  @Input() units: Array<UnitClient<number, DayUnitClient | WeekUnitClient | SeasonUnitClient>> = [];

  form: FormGroup;
  dayActionsForm: FormGroup;
  weekForm: FormGroup;
  seasonForm: FormGroup;
  isValidStep: boolean = false;

  selectedTypeEnum = TimeUnitClientType;
  selectedUnit: UnitClient<number, DayUnitClient | WeekUnitClient | SeasonUnitClient>;
  selectedUnitOrigin: UnitClient<number, DayUnitClient | WeekUnitClient | SeasonUnitClient>;
  controls: Array<FormData> = [];

  @Input() days: UnitCodeListItemClient<number>[];
  @Input() weeks: UnitCodeListItemClient<number>[];
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
  loading = false;
  @Output() private hasUnsavedChanges: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private touService: TouConfigService,
    private toast: ToastNotificationService,
    private translate: TranslateService,
    private eventManagerService: EventManagerService,
    private touConfigHelper: TouConfigurationHelper,
    private modalService: ModalService,
    private touConfigErrorHelper: TouConfigErrorHandler,
    private unsavedChangesModal: UnsavedChangesModal,
    private eventsService: EventManagerService
  ) {
    this.eventManagerService.getCustom('RefreshDaysTouConfig').subscribe((res) => {
      if (res) {
        this.getDaysFromApi(res);
      }
    });
  }

  get wf() {
    return Object.keys(this.weekForm.controls);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null, null],
      externalId: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.initForms();

    // disable next buttons if form is invalid
    this.form.statusChanges.subscribe((res) => {
      this.disableButton(res);
    });

    if (this.units?.length > 0) {
      this.selectUnit(this.units[0]);
      if (this.type === TimeUnitClientType.WEEK) {
        this.patchDays();
      }
      if (this.type === TimeUnitClientType.SEASON) {
        this.patchWeeks();
      }
    }

    this.eventsService.getCustom('SetSelectedUnitToOriginalValues').subscribe(() => {
      this.setSelectedUnitValuesToOriginalValues();
    });

    this.hasUnsavedChanges.emit(this.isEditMode() && this.isFormDirty());
  }

  isEditMode() {
    return this.touService.touWizardMode === TouWizardMode.EDIT;
  }

  isCreateMode() {
    return this.touService.touWizardMode === TouWizardMode.CREATE;
  }

  isFormDirty() {
    if (this.isEditMode() && !this.selectedUnit.id) {
      return true;
    }
    switch (this.type) {
      case TimeUnitClientType.DAY:
        if (this.form.dirty) {
          return this.form.dirty;
        } else {
          if (this.isCreateMode()) {
            return this.selectedUnit.units.length > 0;
          } else {
            return false;
          }
        }
      case TimeUnitClientType.WEEK:
        return this.form.dirty || this.weekForm.dirty;
      case TimeUnitClientType.SEASON:
        return this.form.dirty || this.seasonForm.dirty;
      default:
        return false;
    }
  }

  selectUnit(unit: UnitClient<number, DayUnitClient | WeekUnitClient | SeasonUnitClient>) {
    this.selectedUnit = unit;
    this.patchValues();
    if (this.type === TimeUnitClientType.WEEK) {
      this.patchDays();
    }
    if (this.type === TimeUnitClientType.SEASON) {
      this.patchWeeks();
    }
    if (this.isEditMode()) {
      this.selectedUnitOrigin = _.cloneDeep(this.selectedUnit);
    }
  }

  addDayActions() {
    if (this.selectedUnit.units.length === 0 && this.dayActionsForm.get('startTime').value !== '00:00') {
      this.toast.errorToast(this.translate.instant('TOU-CONFIG.START-TIME-ERROR'));
    } else {
      if (!this.selectedUnit.units.find((unit) => (unit as DayUnitClient).startTime === this.dayActionsForm.get('startTime').value)) {
        // update day actions if this.selectedUnit.id exist
        if (this.isEditMode() && this.selectedUnit.id) {
          this.touService
            .addDayActionToDay(
              this.selectedUnit.id,
              parseNumber(this.dayActionsForm.get('startTime').value.split(':')[0]),
              parseNumber(this.dayActionsForm.get('startTime').value.split(':')[1]),
              this.dayActionsForm.get('scriptId').value
            )
            .subscribe(
              (res) => {
                this.toast.successToast(this.translate.instant('TOU-CONFIG.CONFIGURATION-UPDATED'));
                this.addDayActionToDayClient(res);
              },
              () => {
                this.toast.errorToast(this.translate.instant('COMMON.SERVER-ERROR'));
              }
            );
        } else {
          this.addDayActionToDayClient();
        }
      } else {
        this.toast.errorToast(this.translate.instant('TOU-CONFIG.ADD-DAY-ACTION-DUPLICATE-ERROR'));
      }
    }
  }

  patchValues() {
    this.form.get('id').patchValue(this.selectedUnit.id);
    this.form.get('externalId').patchValue(this.selectedUnit.externalId);
    this.form.get('description').patchValue(this.selectedUnit.description);
    this.checkId();
  }

  saveUnit() {
    if (this.form.valid) {
      this.selectedUnit.id = this.form.get('id').value;
      this.selectedUnit.externalId = this.form.get('externalId').value;
      this.selectedUnit.description = this.form.get('description').value;
    }

    if (this.type === TimeUnitClientType.WEEK) {
      if (this.weekForm?.valid) {
        this.selectedUnit.units = [];
        this.addDaysToWeek();
        this.disableButton('VALID');
      } else {
        this.disableButton('INVALID');
      }
    }
    if (this.type === TimeUnitClientType.SEASON) {
      if (this.seasonForm?.valid) {
        this.selectedUnit.units = [];
        this.addWeeksToSeason();
        this.disableButton('VALID');
      } else {
        this.disableButton('INVALID');
      }
    }

    this.hasUnsavedChanges.emit(this.isEditMode() && this.isFormDirty());
  }

  /**
   * Update entity in edit mode.
   */
  saveOrUpdateUnit() {
    if (this.type === TimeUnitClientType.DAY) {
      // if id exist update data
      if (this.selectedUnit.id) {
        this.updateDayFromApi();
      } else {
        this.createNewDayFromApi();
      }
    } else if (this.type === TimeUnitClientType.WEEK) {
      // if id exist update data
      if (this.selectedUnit.id) {
        this.updateWeekFromApi();
      } else {
        this.createNewWeekFromApi();
      }
    } else if (this.type === TimeUnitClientType.SEASON) {
      // if id exist update data
      if (this.selectedUnit.id) {
        this.updateSeasonFromApi();
      } else {
        this.createNewSeasonFromApi();
      }
    } else {
      this.toast.errorToast(this.translate.instant('COMMON.OPERATION-FAILED'));
    }
  }

  saveOrUpdateUnitTitle(): string {
    if (!this.isFormDirty()) {
      return 'TOU-CONFIG.NO-CHANGES';
    } else if (this.type === TimeUnitClientType.DAY && this.isEditMode() && this.isSaveOrUpdateDisabled()) {
      return 'TOU-CONFIG.NO-ACTIONS';
    }
    return '';
  }

  removeUnit() {
    let isReferencedByOtherUnit = false;
    switch (this.type) {
      case TimeUnitClientType.DAY:
        // check if DAY item is in use
        const weeks = this.touService.getTouConfig().weeks;
        if (weeks) {
          weeks.units?.forEach((unit) => {
            if (
              unit.units.find((x) =>
                this.isCreateMode() ? x.day.externalId === this.selectedUnit.externalId : x.day.id === this.selectedUnit.id
              )
            ) {
              isReferencedByOtherUnit = true;
            }
          });
        }
        const specialDays = this.touService.getTouConfig().specialDays;
        if (
          specialDays &&
          specialDays.find((specialDay) =>
            this.isCreateMode() ? specialDay.day.externalId === this.selectedUnit.externalId : specialDay.day.id === this.selectedUnit.id
          )
        ) {
          isReferencedByOtherUnit = true;
        }
        break;
      case TimeUnitClientType.WEEK:
        const seasons = this.touService.getTouConfig().seasons;
        seasons?.units?.forEach((unit) => {
          if (
            unit.units.find((x) =>
              this.isCreateMode() ? x.week.externalId === this.selectedUnit.externalId : x.week.id === this.selectedUnit.id
            )
          ) {
            isReferencedByOtherUnit = true;
          }
        });
        break;
    }
    if (isReferencedByOtherUnit || (this.isEditMode() && this.units.length === 1)) {
      this.toast.errorToast(this.translate.instant('TOU-CONFIG.DELETE-ITEM-ERROR'));
    } else {
      if (this.isEditMode() && this.selectedUnit.id) {
        if (this.type === TimeUnitClientType.DAY) {
          this.deleteUnitModal(TimeUnitClientType.DAY).result.then(() => {
            this.touService.deleteDay(this.selectedUnit.id).subscribe(
              () => {
                this.toast.successToast(this.translate.instant('TOU-CONFIG.DAY-REMOVED'));
                this.removeUnitFromUnitsClientArray();
              },
              (err: HttpErrorResponse) => {
                this.touConfigErrorHelper.showErrorsAsToasts(err);
              }
            );
          });
        } else if (this.type === TimeUnitClientType.WEEK) {
          this.deleteUnitModal(TimeUnitClientType.WEEK).result.then(() => {
            this.touService.deleteWeek(this.touService.touConfigurationClient.basic.id, this.selectedUnit.id).subscribe(
              () => {
                this.toast.successToast(this.translate.instant('TOU-CONFIG.DELETE-ITEM-SUCCESS-WEEK'));
                this.removeUnitFromUnitsClientArray();
              },
              (err: HttpErrorResponse) => {
                this.touConfigErrorHelper.showErrorsAsToasts(err);
              }
            );
          });
        } else if (this.type === TimeUnitClientType.SEASON) {
          this.deleteUnitModal(TimeUnitClientType.SEASON).result.then(() => {
            this.touService.deleteSeason(this.selectedUnit.id).subscribe(
              () => {
                this.toast.successToast(this.translate.instant('TOU-CONFIG.DELETE-ITEM-SUCCESS-SEASON'));
                this.removeUnitFromUnitsClientArray();
              },
              (err: HttpErrorResponse) => {
                this.touConfigErrorHelper.showErrorsAsToasts(err);
              }
            );
          });
        } else {
          this.toast.errorToast(this.translate.instant('COMMON.OPERATION-FAILED'));
        }
      } else {
        this.removeUnitFromUnitsClientArray();
      }
    }
  }

  addDaysToWeek() {
    this.selectedUnit = this.units.find((day) => day === this.selectedUnit);
    this.wf.forEach((w) => {
      const week: WeekUnitClient = {
        dayCode: w,
        day: this.weekForm.get(w).value
      };
      this.selectedUnit.units.push(week);
    });
  }

  addWeeksToSeason() {
    this.selectedUnit = this.units.find((day) => day === this.selectedUnit);
    const season: SeasonUnitClient = {
      date: this.seasonForm.get('startDate').value,
      week: this.seasonForm.get('week').value
    };
    this.selectedUnit.units.push(season);
  }

  isSelectedButton(unit) {
    if (this.selectedUnit === unit) {
      return 'selected';
    }
  }

  patchDays() {
    if (this.selectedUnit.units.length > 0) {
      this.wf.forEach((w) => {
        const weekUnit = this.selectedUnit.units.find((d) => (d as WeekUnitClient).dayCode === w) as WeekUnitClient;
        let preselectedDayInCombobox = this.days[0];
        // In duplicate and edit mode we are referencing by ids
        if (weekUnit.day.id) {
          preselectedDayInCombobox = this.days.find((day) => day.id === weekUnit.day.id);
        }
        // In create new mode we are referencing by fake ids
        else {
          preselectedDayInCombobox = this.days.find((day) => day.fakeId === weekUnit.day.fakeId);
        }
        this.weekForm.get(w).patchValue(preselectedDayInCombobox);
      });
      this.saveUnit();
    }
  }

  patchWeeks() {
    if (this.selectedUnit.units.length > 0) {
      const seasonUnit = this.selectedUnit.units[0] as SeasonUnitClient;
      this.seasonForm.get('startDate').patchValue(new Date(seasonUnit.date));
      this.seasonForm.get('endDate').patchValue(new Date(seasonUnit.date));
      let preselectedWeekInCombobox = this.weeks[0];
      // In duplicate and edit mode we are referencing by ids
      if (seasonUnit.week.id) {
        preselectedWeekInCombobox = this.weeks.find((week) => week.id === seasonUnit.week.id);
      }
      // In create new mode we are referencing by fake ids
      else {
        preselectedWeekInCombobox = this.weeks.find((week) => week.fakeId === seasonUnit.week.fakeId);
      }
      this.seasonForm.get('week').patchValue(preselectedWeekInCombobox);
      this.saveUnit();
    }
  }

  initForms() {
    switch (this.type) {
      case TimeUnitClientType.DAY:
        this.dayActionsForm = this.fb.group({
          startTime: ['00:00', Validators.required],
          scriptId: [1, Validators.required]
        });
        break;
      case TimeUnitClientType.WEEK:
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
      case TimeUnitClientType.SEASON:
        this.seasonForm = this.fb.group({
          week: [this.weeks[0], Validators.required],
          startDate: [moment().set('minute', 0).set('hour', 0).toDate(), Validators.required],
          endDate: [moment().set('minute', 0).set('hour', 0).toDate()]
        });
        break;
    }
  }

  rowActionsClicked(event: any) {
    // delete day action
    if (event.rowData.startTime === '00:00') {
      this.toast.errorToast(this.translate.instant('TOU-CONFIG.DELETE-MIDNIGHT-DAY-ACTION-ERROR'));
    } else if (this.selectedUnit.units.length === 1) {
      this.toast.errorToast(this.translate.instant('TOU-CONFIG.DELETE-DAY-ACTION-LAST-ONE-REMAINING-ERROR'));
    } else {
      if (this.isEditMode()) {
        // remove from API
        this.touService.deleteDayAction(this.selectedUnit.id, event.id).subscribe(
          () => {
            this.removeDayActionClient(event.rowData.startTime);
          },
          (err: HttpErrorResponse) => {
            this.touConfigErrorHelper.showErrorsAsToasts(err);
          }
        );
      } else {
        this.removeDayActionClient(event.rowData.startTime);
      }
    }
  }

  onIdChanged() {
    this.checkId();
    this.saveUnit();
  }

  checkId() {
    switch (this.touService.touWizardMode) {
      case TouWizardMode.CREATE:
        {
          const inputValue: number = this.form.get('externalId').value;
          if (this.units.filter((unit) => unit.externalId === inputValue).length > 1) {
            this.form.get('externalId').setErrors({ duplicatedId: true });
            this.form.get('externalId').markAsDirty();
          }
        }
        break;
      case TouWizardMode.EDIT:
        {
          const inputValue: string = this.form.get('id').value;
          if (this.units.filter((unit) => unit.id === inputValue).length > 1) {
            this.form.get('id').setErrors({ duplicatedId: true });
            this.form.get('id').markAsDirty();
          }
        }
        break;
    }
  }

  disableButton(res) {
    if (res === 'INVALID') {
      if (this.form.invalid || this.weekForm?.invalid || this.seasonForm?.invalid) {
        this.eventManagerService.emitCustom('DisableNextButton', true);
        this.updateWizardStepCompleteness(false);
      }
    } else if (this.form.valid) {
      this.eventManagerService.emitCustom('DisableNextButton', false);
      this.updateWizardStepCompleteness(true);
    }
  }

  updateWizardStepCompleteness(completed?: boolean) {
    // If no parameter is given of if the parameter is equal to true, check if all time units are set and populated
    if (completed !== false && this.units) {
      const allUnits = this.units.length;
      const unitsWithUnitPopulated = this.units.filter((x) => x.units && x.units.length > 0).length;
      completed = allUnits > 0 && allUnits === unitsWithUnitPopulated;
    }
    const TimeUnitTypeClientNumber = new Map<TimeUnitClientType, number>([
      [TimeUnitClientType.DAY, 2],
      [TimeUnitClientType.WEEK, 3],
      [TimeUnitClientType.SEASON, 4]
    ]);
    const step: StepModel = {
      stepIndex: TimeUnitTypeClientNumber.get(this.type),
      completed: completed
    };
    this.isValidStep = completed;
    this.eventManagerService.emitCustom('UpdateWizardStepCompleteness', step);
  }

  addDayActionToDayClient(res?: string) {
    // add day action to DayClient
    this.selectedUnit = this.units.find((day) => day === this.selectedUnit);
    const time: DayUnitClient = {
      id: res, // set id from response in edit mode
      startTime: this.dayActionsForm.get('startTime').value,
      scriptId: this.dayActionsForm.get('scriptId').value
    };
    this.selectedUnit.units.push(time);
    this.selectedUnit.units = [...this.selectedUnit.units]; // change detection for KendoUi grid
    // clone selectedUnit -> set original value after adding day action
    if (this.isEditMode()) {
      this.selectedUnitOrigin = _.cloneDeep(this.selectedUnit);
    }
    this.updateWizardStepCompleteness();
  }

  removeDayActionClient(startTime: string) {
    this.selectedUnit.units = this.selectedUnit.units.filter((day) => (day as DayUnitClient).startTime !== startTime);
    this.updateWizardStepCompleteness();
  }

  markFormAsPristine() {
    this.form.markAsPristine();
    switch (this.type) {
      case TimeUnitClientType.DAY:
        break;
      case TimeUnitClientType.WEEK:
        this.weekForm.markAsPristine();
        break;
      case TimeUnitClientType.SEASON:
        this.seasonForm.markAsPristine();
        break;
    }
    this.hasUnsavedChanges.emit(false);
  }

  changeSelectedUnitOrAddNew(unit: UnitClient<number, DayUnitClient | WeekUnitClient | SeasonUnitClient> | null = null) {
    if (this.isEditMode() && this.isFormDirty()) {
      this.unsavedChangesModal.showModal((): void => {
        this.setSelectedUnitValuesToOriginalValues();
        // Select given unit or add new.
        if (unit) {
          this.selectUnit(unit);
        } else {
          this.addUnitClient();
        }
        // Emit UnsavedChanges event to the parent component
        this.hasUnsavedChanges.emit(false);
      });
    } else {
      // Select given unit or add new.
      if (unit) {
        this.selectUnit(unit);
      } else {
        this.addUnitClient();
      }
    }
  }

  addUnitClient() {
    const nextExternalId = this.generateNextExternalId();
    switch (this.type) {
      case TimeUnitClientType.DAY:
        const day = {
          id: null,
          externalId: nextExternalId,
          description: `${this.translate.instant('TOU-CONFIG.DAY')} ${nextExternalId}`,
          units: [],
          fakeId: nextExternalId
        } as UnitClient<number, DayUnitClient>;
        this.units.push(day);
        this.selectUnit(day);
        break;
      case TimeUnitClientType.WEEK:
        const week = {
          id: null,
          externalId: nextExternalId,
          description: `${this.translate.instant('TOU-CONFIG.WEEK')} ${nextExternalId}`,
          units: [],
          fakeId: nextExternalId
        } as UnitClient<number, WeekUnitClient>;
        this.units.push(week);
        this.selectUnit(week);
        this.initForms();
        this.addDaysToWeek();
        break;
      case TimeUnitClientType.SEASON:
        const season = {
          id: null,
          externalId: nextExternalId,
          description: `${this.translate.instant('TOU-CONFIG.SEASON')} ${nextExternalId}`,
          units: [],
          fakeId: nextExternalId
        } as UnitClient<number, SeasonUnitClient>;
        this.units.push(season);
        this.selectUnit(season);
        this.initForms();
        this.addWeeksToSeason();
        break;
    }
    this.updateWizardStepCompleteness();
  }

  removeUnitFromUnitsClientArray() {
    this.units.forEach((unit, index) => {
      if (this.isCreateMode() ? unit.externalId === this.selectedUnit.externalId : unit.id === this.selectedUnit.id) {
        this.units.splice(index, 1);
      }
    });
    // Select last unit on the list.
    if (this.units.length > 0) {
      const selectUnit = this.units[this.units.length - 1];
      this.selectUnit(selectUnit);
    }
    this.updateWizardStepCompleteness();
  }

  getDaysFromApi(id: string) {
    this.touService.getConfiguration(this.touService.getTouConfig().basic.id).subscribe(
      (res) => {
        const touConfiguration = this.touConfigHelper.castConfigurationDetailDtoToTouConfigurationClient(res);
        this.touService.touConfigurationClient = touConfiguration;
        // get days from backend
        this.units = this.touService.touConfigurationClient.days.units; // important for data binding for ids in selectUnit
        this.selectedUnit = touConfiguration.days.units.find((unit) => unit.id === id); // set Selected unit with all data from BE
        // Patch form with id.
        this.form.get('id').patchValue(id);
        this.selectedUnit.units = [...this.selectedUnit.units];
        if (this.isEditMode()) {
          this.selectedUnitOrigin = _.cloneDeep(this.selectedUnit);
        }
      },
      (err: HttpErrorResponse) => {
        this.touConfigErrorHelper.showErrorsAsToasts(err);
      }
    );
  }

  getWeekDataFromForm(): UnitClient<number, WeekUnitClient> {
    const week: UnitClient<number, WeekUnitClient> = {
      id: this.form.get('id').value,
      externalId: this.form.get('externalId').value,
      description: this.form.get('description').value,
      units: []
    };

    this.wf.forEach((w) => {
      const weekDay: WeekUnitClient = {
        dayCode: w,
        day: this.weekForm.get(w).value
      };
      week.units.push(weekDay);
    });

    return week;
  }

  getSeasonDataFromForm(): UnitClient<number, SeasonUnitClient> {
    const season: UnitClient<number, SeasonUnitClient> = {
      id: this.form.get('id').value,
      externalId: this.form.get('externalId').value,
      description: this.form.get('description').value,
      units: []
    };

    const week: SeasonUnitClient = {
      date: this.seasonForm.get('startDate').value,
      week: this.seasonForm.get('week').value
    };
    season.units.push(week);

    return season;
  }

  generateNextExternalId() {
    if (this.units && this.units.length > 0) {
      return Math.max(...this.units.map((o) => o.externalId), 0) + 1;
    } else {
      return 1;
    }
  }

  isSaveOrUpdateDisabled() {
    return (
      !this.isFormDirty() || this.form.invalid || this.selectedUnit.units.length === 0 || this.weekForm?.invalid || this.seasonForm?.invalid
    );
  }

  updateDayFromApi() {
    this.loading = true;
    this.touService.updateDay(this.selectedUnit.id, this.selectedUnit.description, Number(this.selectedUnit.externalId)).subscribe(
      () => {
        this.loading = false;
        this.markFormAsPristine();
        if (this.isEditMode()) {
          this.selectedUnitOrigin = _.cloneDeep(this.selectedUnit);
        }
        this.toast.successToast(this.translate.instant('TOU-CONFIG.CONFIGURATION-UPDATED'));
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        this.touConfigErrorHelper.showErrorsAsToasts(err);
      }
    );
  }

  createNewDayFromApi() {
    const dayActions = [];
    this.selectedUnit.units.forEach((dayAction: DayUnitClient) => {
      dayActions.push({
        hour: dayAction.startTime.split(':')[0],
        minute: dayAction.startTime.split(':')[1],
        scriptActionId: dayAction.scriptId
      });
    });
    // create new day on BE
    this.loading = true;
    this.touService.addDay(this.form.get('externalId').value, this.form.get('description').value, dayActions).subscribe(
      (res) => {
        this.loading = false;
        this.selectedUnit.id = res;
        // Patch form with id.
        this.form.get('id').patchValue(res);
        this.markFormAsPristine();
        if (this.isEditMode()) {
          this.selectedUnitOrigin = _.cloneDeep(this.selectedUnit);
        }
        this.getDaysFromApi(res);
        this.toast.successToast(this.translate.instant('TOU-CONFIG.CONFIGURATION-UPDATED'));
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        this.touConfigErrorHelper.showErrorsAsToasts(err);
      }
    );
  }

  updateWeekFromApi() {
    this.loading = true;
    const updateWeekData = this.getWeekDataFromForm();
    const weekCreateDto = this.touConfigHelper.castTouConfigClientWeekToWeekUpdateDto(updateWeekData);
    this.touService.updateWeek(this.touService.touConfigurationClient.basic.id, this.selectedUnit.id, weekCreateDto).subscribe(
      () => {
        this.loading = false;
        this.markFormAsPristine();
        if (this.isEditMode()) {
          this.selectedUnitOrigin = _.cloneDeep(this.selectedUnit);
        }
        this.toast.successToast(this.translate.instant('TOU-CONFIG.CONFIGURATION-UPDATED'));
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        this.touConfigErrorHelper.showErrorsAsToasts(err);
      }
    );
  }

  createNewWeekFromApi() {
    const newWeekData = this.getWeekDataFromForm();
    const weekCreateDto = this.touConfigHelper.castTouConfigClientWeekToWeekCreateDto(newWeekData);
    this.loading = true;
    this.touService.addWeek(this.touService.touConfigurationClient.basic.id, weekCreateDto).subscribe(
      (res) => {
        this.loading = false;
        this.selectedUnit.id = res;
        // Patch form with id.
        this.form.get('id').patchValue(res);
        this.markFormAsPristine();
        if (this.isEditMode()) {
          this.selectedUnitOrigin = _.cloneDeep(this.selectedUnit);
        }
        this.patchValues();
        this.toast.successToast(this.translate.instant('TOU-CONFIG.CONFIGURATION-UPDATED'));
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        this.touConfigErrorHelper.showErrorsAsToasts(err);
      }
    );
  }

  updateSeasonFromApi() {
    this.loading = true;
    this.touService.updateSeason(this.selectedUnit.id, this.setSeasonData()).subscribe(
      (res) => {
        this.loading = false;
        this.markFormAsPristine();
        if (this.isEditMode()) {
          this.selectedUnitOrigin = _.cloneDeep(this.selectedUnit);
        }
        this.toast.successToast(this.translate.instant('TOU-CONFIG.CONFIGURATION-UPDATED'));
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        this.touConfigErrorHelper.showErrorsAsToasts(err);
      }
    );
  }

  createNewSeasonFromApi() {
    this.loading = true;
    this.touService.createSeason(this.setSeasonData()).subscribe(
      (res) => {
        this.loading = false;
        this.selectedUnit.id = res;
        // Patch form with id.
        this.form.get('id').patchValue(res);
        this.markFormAsPristine();
        if (this.isEditMode()) {
          this.selectedUnitOrigin = _.cloneDeep(this.selectedUnit);
        }
        this.patchValues();
        this.toast.successToast(this.translate.instant('TOU-CONFIG.CONFIGURATION-UPDATED'));
      },
      (err: HttpErrorResponse) => {
        this.loading = false;
        this.touConfigErrorHelper.showErrorsAsToasts(err);
      }
    );
  }

  setSeasonData(): SeasonUpdateDto | SeasonCreateDto {
    const season: UnitClient<number, SeasonUnitClient> = this.getSeasonDataFromForm();
    return {
      day: season.units[0].date.getDate(),
      description: season.description,
      externalId: season.externalId,
      month: season.units[0].date.getMonth() + 1,
      weekId: season.units[0].week.id
    };
  }

  deleteUnitModal(type: TimeUnitClientType): NgbModalRef {
    const modalRef = this.modalService.open(ModalConfirmComponent);
    const component: ModalConfirmComponent = modalRef.componentInstance;
    component.warningIcon = false;

    switch (type) {
      case TimeUnitClientType.DAY:
        component.modalTitle = this.translate.instant('TOU-CONFIG.DELETE-ITEM-TITLE-DAY');
        component.modalBody = this.translate.instant('TOU-CONFIG.DELETE-ITEM-CONFIRMATION');
        break;
      case TimeUnitClientType.WEEK:
        component.modalTitle = this.translate.instant('TOU-CONFIG.DELETE-ITEM-TITLE-WEEK');
        component.modalBody = this.translate.instant('TOU-CONFIG.DELETE-ITEM-CONFIRMATION');
        break;
      case TimeUnitClientType.SEASON:
        component.modalTitle = this.translate.instant('TOU-CONFIG.DELETE-ITEM-TITLE-SEASON');
        component.modalBody = this.translate.instant('TOU-CONFIG.DELETE-ITEM-CONFIRMATION');
        break;
    }

    return modalRef;
  }

  setSelectedUnitValuesToOriginalValues() {
    this.markFormAsPristine();
    this.hasUnsavedChanges.emit(false);
    if (this.selectedUnit.id) {
      // Reset currently selected unit on previous values.
      const indexOf = this.units.findIndex((u) => u.id === this.selectedUnit.id);
      if (indexOf > -1) {
        this.units[indexOf] = _.cloneDeep(this.selectedUnitOrigin);
        this.updateWizardStepCompleteness(true);
      }
    } else {
      this.removeUnitFromUnitsClientArray();
    }
  }
}
