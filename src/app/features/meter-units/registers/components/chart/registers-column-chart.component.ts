import { IntlService } from '@progress/kendo-angular-intl';
import { EventsByTimestamp } from './../../interfaces/events-processing.interface';
import { Component, Input } from '@angular/core';
import { DataProcessingService } from 'src/app/core/repository/services/data-processing/data-processing.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: 'registers-column-chart.component.html',
  selector: 'app-registers-column-chart'
})
export class RegistersColumnChartComponent {
  @Input() eventsByTimestamp: EventsByTimestamp[] = [];
  public dateFormats;

  constructor(private dataProcessingService: DataProcessingService, private intl: IntlService) {
    this.dateFormats = environment.kendoChartCategoryDateFormats;
  }
}
