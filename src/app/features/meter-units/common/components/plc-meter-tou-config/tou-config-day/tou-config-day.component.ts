import { Component, OnInit } from '@angular/core';
import { TouWizardService } from '../../../services/wizard.service';
import { TimeUnitTypeClient } from '../add-time-unit/add-time-unit.component';
import { TimeUnitsClient, TouConfigService } from '../../../services/tou-config.service';
import { Router } from '@angular/router';
import { EventManagerService } from '../../../../../../core/services/event-manager.service';

@Component({
  selector: 'app-tou-config-day',
  templateUrl: './tou-config-day.component.html',
  styleUrls: ['./tou-config-day.component.scss']
})
export class TouConfigDayComponent implements OnInit {
  timeUnitEnum: TimeUnitTypeClient = TimeUnitTypeClient.DAY;

  days: TimeUnitsClient;
  invalidForm = false;

  constructor(
    private wizardService: TouWizardService,
    private touService: TouConfigService,
    private router: Router,
    private eventsService: EventManagerService
  ) {}

  ngOnInit(): void {
    this.eventsService.getCustom('DisableNextButton').subscribe((res) => {
      this.invalidForm = res;
    });
    this.days = this.touService.getTimeUnits(this.timeUnitEnum);

    if (this.touService.getTouConfig().days) {
      this.days = this.touService.getTouConfig().days;
    }
  }

  nextStep() {
    this.touService.saveUnit(this.days, this.timeUnitEnum);
    this.wizardService.setCurrentStep({ stepIndex: 2, completed: true });
    this.wizardService.moveToNextStep();
  }

  previousStep() {
    this.router.navigate(['/configuration/importTouConfiguration/wizard/basic']);
  }

  isValid() {
    return (
      !this.days.units.find((unit) => unit.unit.length === 0) &&
      new Set(this.days.units).size === this.days.units.length &&
      this.days.units.length > 0
    );
  }
}
