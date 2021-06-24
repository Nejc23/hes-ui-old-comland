import { BreadcrumbService } from '../../../shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alarms-eventss',
  templateUrl: './alarms-events.component.html'
})
export class AlarmsEventsComponent implements OnInit {
  show = false;

  constructor(private breadcrumbService: BreadcrumbService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.breadcrumbService.setPageName(this.translate.instant('MENU.ALARMS-EVENTS'));
  }
}
