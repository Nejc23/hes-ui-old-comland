import { Component, OnInit } from '@angular/core';
import { MenuItem, StepModel, TouWizardService } from '../../../services/wizard.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TouConfigService } from '../../../services/tou-config.service';

@Component({
  selector: 'app-tou-config-menu',
  templateUrl: './tou-config-menu.component.html',
  styleUrls: ['./tou-config-menu.component.scss']
})
export class TouConfigMenuComponent implements OnInit {
  valid = false;
  disabled = false;
  selected = false;

  currentStep: Observable<StepModel>;
  steps: Observable<StepModel[]>;

  menuItems: Observable<Array<MenuItem>>;

  constructor(private wizardService: TouWizardService, private router: Router, public touService: TouConfigService) {}

  ngOnInit(): void {
    this.currentStep = this.wizardService.getCurrentStep();
    this.steps = this.wizardService.getSteps();
    this.menuItems = this.wizardService.getMenuItems();
  }

  isSelected(url: string) {
    return url === this.router.url;
  }

  getCount(item: MenuItem) {
    if (
      (item.item === 'days' || item.item === 'weeks' || item.item === 'seasons') &&
      this.touService.touConfigurationClient[item.item]?.units
    ) {
      return this.touService.touConfigurationClient[item.item].units.length;
    }
    if (item.item === 'specialDays') {
      return this.touService.touConfigurationClient.specialDays.length;
    }
    return 0;
  }
}
