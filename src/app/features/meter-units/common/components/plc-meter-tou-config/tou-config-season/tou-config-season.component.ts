import { Component, OnInit } from '@angular/core';
import { TouWizardService } from '../../../services/wizard.service';
import { TimeUnitTypeClient } from '../add-time-unit/add-time-unit.component';
import { TimeUnitsClient, TouConfigService } from '../../../services/tou-config.service';
import { Codelist } from '../../../../../../shared/repository/interfaces/codelists/codelist.interface';
import { Router } from '@angular/router';
import { EventManagerService } from '../../../../../../core/services/event-manager.service';

@Component({
  selector: 'app-tou-config-season',
  templateUrl: './tou-config-season.component.html',
  styleUrls: ['./tou-config-season.component.scss']
})
export class TouConfigSeasonComponent implements OnInit {
  timeUnitEnum: TimeUnitTypeClient = TimeUnitTypeClient.SEASON;

  season: TimeUnitsClient;
  weeks: TimeUnitsClient;
  weeksCodeList: Codelist<number>[] = [];
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
    this.season = this.touService.getTimeUnits(this.timeUnitEnum);
    this.weeks = this.touService.getTimeUnits(TimeUnitTypeClient.WEEK);

    if (this.touService.getTouConfig().seasons) {
      this.season = this.touService.getTouConfig().seasons;
    }
    if (this.touService.getTouConfig().weeks) {
      this.weeks = this.touService.getTouConfig().weeks;
    }

    this.weeks.units.forEach((week) => {
      this.weeksCodeList.push({
        id: week.id,
        value: week.description,
        fakeId: week.fakeId
      });
    });
  }

  nextStep() {
    this.touService.saveUnit(this.season, this.timeUnitEnum);
    this.wizardService.setCurrentStep({ stepIndex: 4, completed: true });
    this.wizardService.moveToNextStep();
  }

  isValid() {
    return this.season.units.length > 0;
  }

  previousStep() {
    this.router.navigate(['/configuration/importTouConfiguration/wizard/week']);
  }
}
