import { BreadcrumbService } from './../../../shared/breadcrumbs/services/breadcrumb.service';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { SchedulerJob } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
@Component({
  selector: 'app-alarms-eventss',
  templateUrl: './alarms-events.component.html'
})
export class AlarmsEventsComponent implements OnInit {
  show = false;

  getTabTitleAlarms = `Alarms`;

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbService.setPageName(`Alarms & Events`);
  }

  public onTabSelect(e) {}
}
