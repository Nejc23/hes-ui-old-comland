import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-meter-units',
  templateUrl: './meter-units.component.html'
})
export class MeterUnitsComponent implements OnInit {
  constructor(private sidebarService: SidebarService, private i18n: I18n, public fb: FormBuilder) {
    this.sidebarService.headerTitle = 'Meter Units';
  }

  ngOnInit() {}
}
