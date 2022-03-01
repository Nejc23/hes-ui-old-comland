import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TouConfigurationClient } from 'src/app/models/tou-configuration/TouConfigurationClient';
import { TouConfigService } from '../../../services/tou-config.service';

@Component({
  selector: 'app-tou-config-summary',
  templateUrl: './tou-config-summary.component.html',
  styleUrls: ['./tou-config-summary.component.scss']
})
export class TouConfigSummaryComponent implements OnInit {
  touConfiguration: TouConfigurationClient;

  constructor(private touConfig: TouConfigService, private router: Router) {}

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
