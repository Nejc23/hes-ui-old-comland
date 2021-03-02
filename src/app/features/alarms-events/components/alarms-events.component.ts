import { BreadcrumbService } from './../../../shared/breadcrumbs/services/breadcrumb.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alarms-events',
  templateUrl: './alarms-events.component.html'
})
export class AlarmsEventsComponent implements OnInit {
  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbService.setPageName($localize`Alarms & Events`);
  }
}
