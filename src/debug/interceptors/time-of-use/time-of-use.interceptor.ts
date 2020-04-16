import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { meterUnitRegisters, touConfigurations } from 'src/app/core/repository/consts/data-concentrator-units.const';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { TimeOfUseConfigList } from 'src/app/core/repository/interfaces/time-of-use/time-of-use-config-list.interface';

@Injectable()
export class TimeOfUseInterceptor {
  constructor() {}

  static interceptTouConfigList(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body: TimeOfUseConfigList[] = [
      {
        guid: '5e2bc633-fd66-4b5b-888d-77ce1bf7111e',
        description: 'ON-PEAK'
      },
      {
        guid: 'ead2e345-c1df-46c9-843a-af427ae6436a',
        description: 'OFF-PEAK'
      },
      {
        guid: 'aafc795f-3c7c-4bff-802d-a9f654200b2b',
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
