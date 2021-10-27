import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EventsByTimestamp } from '../../interfaces/events-processing.interface';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  templateUrl: 'registers-column-chart.component.html',
  selector: 'app-registers-column-chart'
})
export class RegistersColumnChartComponent implements OnInit {
  @Input() eventsByTimestamp: EventsByTimestamp[] = [];
  @Input() title = '';
  @Input() hours = false;
  formattedEvents;

  public dateFormats;
  public culture = 'de-DE'; // en-US for am/PM

  constructor() {
    this.dateFormats = environment.kendoChartCategoryDateFormats;
    this.culture = environment.kendoChartCulture;
  }

  ngOnInit(): void {
    if (!this.hours) {
      this.formattedEvents = _.cloneDeep(this.eventsByTimestamp);
      // format for days with timezone due to kendo chart wrong date display
      this.formattedEvents.forEach((event) => {
        event.timestamp = moment(event.timestamp).format(environment.dateOnlyFormat);
      });
    }
  }
}
