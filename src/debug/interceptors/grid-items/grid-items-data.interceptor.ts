import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { GridItemsCurrentDataService } from './services/graph-current.service';
import { DashboardItemDataResponse } from 'src/app/core/repository/interfaces/dashboards/dashboard-item-data-response.interface';

@Injectable()
export class GridItemsDataInterceptor {
  constructor() {}

  static interceptGridItems(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    let data: DashboardItemDataResponse[];

    // current 1
    const CurrCurrentValue = this.generateRandomInteger(0, 300);
    const currentGraphData = GridItemsCurrentDataService.getGraphCurrent();
    currentGraphData.shift();
    currentGraphData.push({ name: GridItemsCurrentDataService.getCurrentDateCurrent(), value: CurrCurrentValue });
    GridItemsCurrentDataService.setGraphCurrent(currentGraphData);

    data = [
      {
        // current
        id: '00101506-60a3-4973-b833-89a9b1fcaac7',
        value: this.generateRandomInteger(0, 500),
        deviceName: 'Device #53',
        powerlineName: 'PW27',
        lastUpdateTimestamp: moment().format(),
        unit: 'A'
      }
    ];
    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptGridItems(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/dashboards/[0-9]+/grid-items-data$`).test(request.url) && request.method.endsWith('GET');
  }

  static generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  static genRandDecimal(min, max, decimalPlaces) {
    const rand = Math.random() * (max - min) + min;
    const power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
  }
}
