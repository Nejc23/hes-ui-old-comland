import { environment } from './../../../../../../environments/environment';
import { RegisterValue } from './../../../../../core/repository/interfaces/data-processing/profile-definitions-for-device.interface';
import { DataProcessingService } from './../../../../../core/repository/services/data-processing/data-processing.service';
import { RegistersFilter } from './../../interfaces/data-processing-request.interface';
import { DataProcessingRequest } from './../../../../../core/repository/interfaces/data-processing/data-processing-request.interface';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { values } from 'lodash';
import * as moment from 'moment';
import { IntlService } from '@progress/kendo-angular-intl';

@Component({
  templateUrl: 'registers-chart.component.html',
  selector: 'app-registers-chart'
})
export class RegistersChartComponent {
  public eventValues: RegisterValue[];
  @Input() public categories: Date[];
  @Input() public chartData: any[][];
  public dateFormats;

  constructor(private dataProcessingService: DataProcessingService, private intl: IntlService) {
    this.dateFormats = environment.kendoChartCategoryDateFormats;
  }

  getDateWithTime(dateTime: any) {
    // return dateTime ?  moment(dateTime).format('L') + ' ' + moment(dateTime).format('LTS') : ''
    return dateTime ? this.intl.formatDate(dateTime, environment.dateTimeFormat) : '';
  }

  logDataItem(item) {
    console.log('logDataItem:', item);
  }
}
