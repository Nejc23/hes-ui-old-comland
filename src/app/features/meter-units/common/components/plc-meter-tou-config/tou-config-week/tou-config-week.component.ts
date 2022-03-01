import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TimeUnitClientType } from 'src/app/enums/tou-configuration/TimeUnitTypeClientEnum';
import { TouWizardMode } from 'src/app/enums/tou-configuration/TouWizardModeEnum';
import { UnsavedChangesModal } from 'src/app/features/helpers/unsaved-changes-modal';
import { DayUnitClient } from 'src/app/models/tou-configuration/DayUnitClient';
import { TimeUnitsClient } from 'src/app/models/tou-configuration/TimeUnitsClient';
import { UnitCodeListItemClient } from 'src/app/models/tou-configuration/UnitCodeListItemClient';
import { WeekUnitClient } from 'src/app/models/tou-configuration/WeekUnitClient';
import { EventManagerService } from '../../../../../../core/services/event-manager.service';
import { TouConfigService } from '../../../services/tou-config.service';
import { TouWizardService } from '../../../services/wizard.service';

@Component({
  selector: 'app-tou-config-week',
  templateUrl: './tou-config-week.component.html',
  styleUrls: ['./tou-config-week.component.scss']
})
export class TouConfigWeekComponent implements OnInit {
  timeUnitEnum: TimeUnitClientType = TimeUnitClientType.WEEK;

  weeks: TimeUnitsClient<number, WeekUnitClient>;
  days: TimeUnitsClient<number, DayUnitClient>;
  daysCodeList: UnitCodeListItemClient<number>[] = [];
  invalidForm = false;
  childForm: FormGroup[] = [];
  private hasUnsavedChanges = false;

  constructor(
    private wizardService: TouWizardService,
    private touService: TouConfigService,
    private router: Router,
    private eventsService: EventManagerService,
    private unsavedChangesModal: UnsavedChangesModal
  ) {
    this.eventsService.getCustom('DisableNextButton').subscribe((res) => {
      this.invalidForm = res;
    });
  }

  ngOnInit(): void {
    this.days = this.touService.getTouConfig().days;
    this.weeks = this.touService.getTouConfig().weeks;

    if (this.touService.getTouConfig().weeks) {
      this.weeks = this.touService.getTouConfig().weeks;
    } else {
      this.weeks = this.touService.getTimeUnits(this.timeUnitEnum) as TimeUnitsClient<number, WeekUnitClient>;
    }

    if (this.touService.getTouConfig().days) {
      this.days = this.touService.getTouConfig().days;
    } else {
      this.days = this.touService.getTimeUnits(TimeUnitClientType.DAY) as TimeUnitsClient<number, DayUnitClient>;
    }

    this.days.units.forEach((unit) => {
      // Filter unsaved unit on edit.
      if (this.isCreateMode() || (this.isEditMode() && unit.id)) {
        this.daysCodeList.push({
          id: unit.id,
          value: unit.description,
          fakeId: unit.fakeId,
          externalId: unit.externalId,
          textField: `${unit.externalId} (${unit.description})`
        });
      }
    });
  }

  nextStep() {
    this.saveAndNavigateToNextStep();
  }

  saveAndNavigateToNextStep() {
    if (this.isCreateMode()) {
      // Save to client configuration.
      this.touService.touConfigurationClient.weeks = this.weeks;
      this.touService.storeTOUConfigurationToSession();
    }

    this.navigateToNextStep();
  }

  navigateToNextStep() {
    this.wizardService.setCurrentStep({ stepIndex: 3, completed: true });
    this.wizardService.moveToNextStep();
  }

  isValid() {
    return this.weeks.units.length > 0;
  }

  isEditMode() {
    return this.touService.touWizardMode === TouWizardMode.EDIT;
  }

  isCreateMode() {
    return this.touService.touWizardMode === TouWizardMode.CREATE;
  }

  previousStep() {
    this.router.navigate(['/configuration/importTouConfiguration/wizard/day']);
  }

  unsavedChangesEvent(res: boolean): void {
    this.hasUnsavedChanges = res;
  }

  canDeactivate(): Promise<any> | boolean {
    if (this.hasUnsavedChanges) {
      return this.unsavedChangesModal.showModal((): void => {
        this.eventsService.emitCustom('SetSelectedUnitToOriginalValues', true);
      });
    } else {
      return true;
    }
  }
}
