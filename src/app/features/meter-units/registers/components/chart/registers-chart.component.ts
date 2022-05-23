import { environment } from './../../../../../../environments/environment';
import { RegisterValue } from './../../../../../core/repository/interfaces/data-processing/profile-definitions-for-device.interface';
import { DataProcessingService } from './../../../../../core/repository/services/data-processing/data-processing.service';
import { Component, Input } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';

@Component({
  templateUrl: 'registers-chart.component.html',
  selector: 'app-registers-chart'
})
export class RegistersChartComponent {
  public eventValues: RegisterValue[];
  @Input() public categories: Date[];
  @Input() public chartData: any[][];
  @Input() public unit = '';
  @Input() showNormalizedData = false;

  public dateFormats;

  constructor(private dataProcessingService: DataProcessingService, private intl: IntlService) {
    this.dateFormats = environment.kendoChartCategoryDateFormats;
  }

  getDateWithTime(dateTime: any) {
    return dateTime ? this.intl.formatDate(dateTime, environment.dateTimeFormat) : '';
  }

  public labelContent = (e: any) => {
    if (this.chartData?.length > 0) {
      return e.value + ' ' + this.unit;
    }
    return e.value;
  };
}
