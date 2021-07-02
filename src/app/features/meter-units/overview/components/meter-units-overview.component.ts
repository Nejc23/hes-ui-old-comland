import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/core/base-template/services/sidebar.service';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-meter-units-overview',
  templateUrl: './meter-units-overview.component.html'
})
export class MeterUnitsOverviewComponent implements OnInit {
  constructor(private sidebarService: SidebarService, public fb: FormBuilder, private translate: TranslateService) {
    this.sidebarService.headerTitle = this.translate.instant('MENU.METER-UNITS');
  }

  ngOnInit() {}
}
