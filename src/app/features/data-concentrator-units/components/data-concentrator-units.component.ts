import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { I18n } from '@ngx-translate/i18n-polyfill';
import { headerTitleDCU } from '../consts/static-text.const';

@Component({
  selector: 'app-data-concentrator-units',
  templateUrl: './data-concentrator-units.component.html'
})
export class DataConcentratorUnitsComponent implements OnInit {
  constructor(private sidebatService: SidebarService, private i18n: I18n) {
    this.sidebatService.headerTitle = this.i18n(headerTitleDCU);
  }

  ngOnInit() {}
}
