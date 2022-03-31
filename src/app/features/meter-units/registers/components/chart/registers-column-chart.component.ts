import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EventsByTimestamp } from '../../interfaces/events-processing.interface';

@Component({
  templateUrl: 'registers-column-chart.component.html',
  selector: 'app-registers-column-chart'
})
export class RegistersColumnChartComponent {
  @Input() eventsByTimestamp: EventsByTimestamp[] = [];
  @Input() title = '';
  @Input() hours = false;
  formatted = false;

  public dateFormats;
  public culture = 'de-DE'; // en-US for am/PM

  constructor() {
    this.dateFormats = environment.kendoChartCategoryDateFormats;
    this.culture = environment.kendoChartCulture;
  }
}
