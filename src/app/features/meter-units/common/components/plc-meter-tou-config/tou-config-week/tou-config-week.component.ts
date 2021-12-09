import { Component, OnInit } from '@angular/core';
import { TouWizardService } from '../../../services/wizard.service';
import { TimeUnitTypeClient } from '../add-time-unit/add-time-unit.component';
import { TimeUnitsClient, TouConfigService } from '../../../services/tou-config.service';
import { Codelist } from '../../../../../../shared/repository/interfaces/codelists/codelist.interface';
import { Router } from '@angular/router';
import { EventManagerService } from '../../../../../../core/services/event-manager.service';

@Component({
  selector: 'app-tou-config-week',
  templateUrl: './tou-config-week.component.html',
  styleUrls: ['./tou-config-week.component.scss']
})
export class TouConfigWeekComponent implements OnInit {
  timeUnitEnum: TimeUnitTypeClient = TimeUnitTypeClient.WEEK;

  weeks: TimeUnitsClient;
  days: TimeUnitsClient;
  daysCodeList: Codelist<number>[] = [];
  invalidForm = false;

  constructor(
    private wizardService: TouWizardService,
    private touService: TouConfigService,
    private router: Router,
    private eventsService: EventManagerService
  ) {
    this.eventsService.getCustom('DisableNextButton').subscribe((res) => {
      this.invalidForm = res;
    });
  }

  ngOnInit(): void {
    this.weeks = this.touService.getTimeUnits(this.timeUnitEnum);

    if (this.touService.getTouConfig().weeks) {
      this.weeks = this.touService.getTouConfig().weeks;
    }

    if (this.touService.getTouConfig().days) {
      this.days = this.touService.getTouConfig().days;
    } else {
      this.days = this.touService.getTimeUnits(TimeUnitTypeClient.DAY);
    }

    this.days.units.forEach((unit) => {
      this.daysCodeList.push({
        id: unit.id,
        value: unit.description,
        fakeId: unit.fakeId
      });
    });
  }

  nextStep() {
    this.touService.saveUnit(this.weeks, this.timeUnitEnum);
    this.wizardService.setCurrentStep({ stepIndex: 3, completed: true });
    this.wizardService.moveToNextStep();
  }

  isValid() {
    return this.weeks.units.length > 0;
  }

  previousStep() {
    this.router.navigate(['/configuration/importTouConfiguration/wizard/day']);
  }
}
