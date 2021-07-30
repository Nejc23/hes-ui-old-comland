import { BreadcrumbService } from '../../../shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-alarms-eventss',
  templateUrl: './alarms-events-list.component.html'
})
export class AlarmsEventsListComponent implements OnInit {
  show = false;

  constructor() {}

  ngOnInit(): void {}
}
