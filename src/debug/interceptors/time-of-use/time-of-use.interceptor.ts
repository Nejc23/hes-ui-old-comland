import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { touConfigurations } from 'src/app/core/repository/consts/data-concentrator-units.const';
import { TimeOfUseConfigList } from 'src/app/core/repository/interfaces/time-of-use/time-of-use-config-list.interface';

@Injectable()
export class TimeOfUseInterceptor {
  constructor() {}

  static interceptTouConfigList(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body: TimeOfUseConfigList[] = [
      {
        id: '1',
        externalId: 's2w2d2',
        description: 'ON-PEAK'
      },
      {
        id: '2',
        externalId: 's2w2d2',
        description: 'OFF-PEAK'
      },
      {
        id: '3',
        externalId: 's3w3d2',
        description: 'PARTIAL-PEAK'
      },
      {
        id: '4',
        externalId: 's3w3d3',
        description: 'PARTIAL-PEAK'
      },
      {
        id: '5',
        externalId: 's3w3d3',
        description: 'PARTIAL-PEAK'
      },
      {
        id: '6',
        externalId: 's3w3d3',
        description: 'PARTIAL-PEAK'
      },
      {
        id: '7',
        externalId: 's3w3d3',
        description: 'PARTIAL-PEAK'
      },
      {
        id: '8',
        externalId: 's3w3d3',
        description: 'PARTIAL-PEAK'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }

  static canInterceptTouConfigList(request: HttpRequest<any>): boolean {
    return new RegExp(touConfigurations).test(request.url) && request.method.endsWith('GET');
  }
}
