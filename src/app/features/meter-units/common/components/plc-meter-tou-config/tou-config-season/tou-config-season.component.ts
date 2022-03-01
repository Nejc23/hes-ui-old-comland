import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimeUnitClientType } from 'src/app/enums/tou-configuration/TimeUnitTypeClientEnum';
import { TouWizardMode } from 'src/app/enums/tou-configuration/TouWizardModeEnum';
import { UnsavedChangesModal } from 'src/app/features/helpers/unsaved-changes-modal';
import { SeasonUnitClient } from 'src/app/models/tou-configuration/SeasonUnitClient';
import { TimeUnitsClient } from 'src/app/models/tou-configuration/TimeUnitsClient';
import { UnitCodeListItemClient } from 'src/app/models/tou-configuration/UnitCodeListItemClient';
import { WeekUnitClient } from 'src/app/models/tou-configuration/WeekUnitClient';
import { EventManagerService } from '../../../../../../core/services/event-manager.service';
import { TouConfigService } from '../../../services/tou-config.service';
import { TouWizardService } from '../../../services/wizard.service';

@Component({
  selector: 'app-tou-config-season',
  templateUrl: './tou-config-season.component.html',
  styleUrls: ['./tou-config-season.component.scss']
})
export class TouConfigSeasonComponent implements OnInit {
  timeUnitEnum: TimeUnitClientType = TimeUnitClientType.SEASON;

  seasons: TimeUnitsClient<number, SeasonUnitClient>;
  weeks: TimeUnitsClient<number, WeekUnitClient>;
  weeksCodeList: UnitCodeListItemClient<number>[] = [];
  invalidForm = false;
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
    this.seasons = this.touService.getTouConfig().seasons;
    this.weeks = this.touService.getTouConfig().weeks;

    if (this.touService.getTouConfig().seasons) {
      this.seasons = this.touService.getTouConfig().seasons;
    } else {
      this.seasons = this.touService.getTimeUnits(this.timeUnitEnum) as TimeUnitsClient<number, SeasonUnitClient>;
    }
    if (this.touService.getTouConfig().weeks) {
      this.weeks = this.touService.getTouConfig().weeks;
    } else {
      this.weeks = this.touService.getTimeUnits(TimeUnitClientType.WEEK) as TimeUnitsClient<number, WeekUnitClient>;
    }

    this.weeks.units.forEach((unit) => {
      // Filter unsaved unit on edit.
      if (this.touService.touWizardMode == TouWizardMode.CREATE || (this.touService.touWizardMode == TouWizardMode.EDIT && unit.id)) {
        this.weeksCodeList.push({
          id: unit.id,
          externalId: unit.externalId,
          value: unit.description,
          textField: `${unit.externalId} (${unit.description})`,
          fakeId: unit.fakeId
        });
      }
    });
  }

  nextStep() {
    // Save to client configuration.
    this.touService.touConfigurationClient.seasons = this.seasons;
    this.touService.storeTOUConfigurationToSession();

    this.wizardService.setCurrentStep({ stepIndex: 4, completed: true });
    this.wizardService.moveToNextStep();
  }

  isValid() {
    return this.seasons.units.length > 0;
  }

  previousStep() {
    this.router.navigate(['/configuration/importTouConfiguration/wizard/week']);
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
