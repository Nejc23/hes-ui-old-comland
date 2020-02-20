import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse, HttpXhrBackend, HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { WidgetType } from 'src/app/features/widgets/enums/widget-type.enum';
import { PictureWidgetContent } from 'src/app/features/widgets/interfaces/widget-content/picture-widget-content';
import { DashboardGridResponse } from 'src/app/core/repository/interfaces/dashboards/dashboard-grid-response.interface';

@Injectable()
export class GridInterceptor {
  constructor() {}

  static interceptGrid(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const pictureReadings: PictureWidgetContent = {
      currentValue: '',
      deviceName: 'Device #329',
      powerlineName: 'PW1113',
      lastUpdateTimestamp: moment().format(),
      unitOfMeasure: '%'
    };

    let data: DashboardGridResponse;
    if (request.url.startsWith('/api/dashboards/2/grid-items-settings')) {
      data = {
        items: [
          {
            cols: 3,
            rows: 2,
            widgetType: WidgetType.current,
            x: 3,
            y: 4,
            id: 'graph-current',
            properties: {
              powerline: 1,
              device: 1,
              displayGraph: true,
              displayPrediction: false,
              displayHistory: false
            }
          }
        ],
        refreshIntervalActive: true
      };
    } else {
      data = {
        items: [
          {
            cols: 1,
            rows: 1,
            widgetType: WidgetType.current,
            x: 2,
            y: 0,
            id: '00101506-60a3-4973-b833-89a9b1fcaac7',
            properties: null
          },
          {
            cols: 2,
            rows: 2,
            widgetType: WidgetType.current,
            x: 0,
            y: 0,
            id: 'g3',
            properties: null
          }
        ],
        refreshIntervalActive: true
      };
    }
    /*
    const httpClient = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
    httpClient.get('assets/images/powerline.jpg', { responseType: 'blob' }).subscribe(res => {
      const reader = new FileReader();
      reader.onloadend = () => {
        pictureReadings.currentValue = reader.result.toString();
      };
      reader.readAsDataURL(res);
    });
*/
    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptGrid(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/dashboards/[0-9]+/grid-items-settings$`).test(request.url) && request.method.endsWith('GET');
  }

  /// PUT
  static interceptGridPut(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    let data: DashboardGridResponse;
    if (request.url.startsWith('/api/dashboards/2/grid-items-settings')) {
      data = {
        items: [
          {
            cols: 3,
            rows: 2,
            widgetType: WidgetType.current,
            x: 3,
            y: 4,
            id: 'graph-current',
            properties: {
              powerline: 1,
              device: 1,
              displayGraph: true,
              displayPrediction: false,
              displayHistory: false
            }
          }
        ],
        refreshIntervalActive: true
      };
    } else {
      data = {
        items: [
          {
            cols: 1,
            rows: 1,
            widgetType: WidgetType.current,
            x: 2,
            y: 0,
            id: '00101506-60a3-4973-b833-89a9b1fcaac7',
            properties: null
          },
          {
            cols: 2,
            rows: 2,
            widgetType: WidgetType.current,
            x: 0,
            y: 0,
            id: 'g3',
            properties: null
          }
        ],
        refreshIntervalActive: true
      };
    }

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptGridPut(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/dashboards/[0-9]+/grid-items-settings$`).test(request.url) && request.method.endsWith('PUT');
  }

  static generateRandomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }
}
