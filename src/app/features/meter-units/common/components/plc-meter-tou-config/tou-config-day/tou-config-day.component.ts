import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TimeUnitClientType } from 'src/app/enums/tou-configuration/TimeUnitTypeClientEnum';
import { UnsavedChangesModal } from 'src/app/features/helpers/unsaved-changes-modal';
import { DayUnitClient } from 'src/app/models/tou-configuration/DayUnitClient';
import { TimeUnitsClient } from 'src/app/models/tou-configuration/TimeUnitsClient';
import { EventManagerService } from '../../../../../../core/services/event-manager.service';
import { TouConfigService } from '../../../services/tou-config.service';
import { TouWizardService } from '../../../services/wizard.service';

@Component({
  selector: 'app-tou-config-day',
  templateUrl: './tou-config-day.component.html',
  styleUrls: ['./tou-config-day.component.scss']
})
export class TouConfigDayComponent implements OnInit {
  timeUnitEnum: TimeUnitClientType = TimeUnitClientType.DAY;

  days: TimeUnitsClient<number, DayUnitClient>;
  invalidForm = false;
  private hasUnsavedChanges = false;

  constructor(
    private wizardService: TouWizardService,
    private touService: TouConfigService,
    private router: Router,
    private eventsService: EventManagerService,
    private unsavedChangesModal: UnsavedChangesModal
  ) {}

  ngOnInit(): void {
    this.eventsService.getCustom('DisableNextButton').subscribe((res) => {
      this.invalidForm = res;
    });

    this.days = this.touService.getTimeUnits(this.timeUnitEnum) as TimeUnitsClient<number, DayUnitClient>;

    if (this.touService.getTouConfig().days) {
      this.days = this.touService.getTouConfig().days;
    } else {
      this.days = this.touService.getTimeUnits(this.timeUnitEnum) as TimeUnitsClient<number, DayUnitClient>;
    }
  }

  nextStep() {
    this.touService.touConfigurationClient.days = this.days;
    this.touService.storeTOUConfigurationToSession();
    this.wizardService.setCurrentStep({ stepIndex: 2, completed: true });
    this.wizardService.moveToNextStep();
  }

  previousStep() {
    this.router.navigate(['/configuration/importTouConfiguration/wizard/basic']);
  }

  isValid() {
    return (
      !this.days.units.find((unit) => unit.units.length === 0) &&
      new Set(this.days.units).size === this.days.units.length &&
      this.days.units.length > 0
    );
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
