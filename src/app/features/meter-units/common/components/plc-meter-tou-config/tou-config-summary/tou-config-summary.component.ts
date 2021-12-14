import { Component, OnInit } from '@angular/core';
import { TouWizardService } from '../../../services/wizard.service';
import { TouConfigService, TouConfigurationClient } from '../../../services/tou-config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tou-config-summary',
  templateUrl: './tou-config-summary.component.html',
  styleUrls: ['./tou-config-summary.component.scss']
})
export class TouConfigSummaryComponent implements OnInit {
  touConfiguration: TouConfigurationClient;

  constructor(private wizardService: TouWizardService, private touConfig: TouConfigService, private router: Router) {}

  ngOnInit(): void {
    this.touConfiguration = this.touConfig.getTouConfig();
  }

  previousStep() {
    this.router.navigate(['/configuration/importTouConfiguration/wizard/special']);
  }

  isValid() {
    return this.touConfig.isConfigurationValid();
  }
}
