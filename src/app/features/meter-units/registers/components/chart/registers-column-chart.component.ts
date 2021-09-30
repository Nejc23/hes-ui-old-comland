import { EventsByTimestamp } from './../../interfaces/events-processing.interface';
import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: 'registers-column-chart.component.html',
  selector: 'app-registers-column-chart'
})
export class RegistersColumnChartComponent {
  @Input() eventsByTimestamp: EventsByTimestamp[] = [];

  public dateFormats;
  public culture = 'de-DE';

  constructor() {
    this.dateFormats = environment.kendoChartCategoryDateFormats;
    this.culture = environment.kendoChartCulture;
  }

  // colorSelected(value: any) {
  // }
}
