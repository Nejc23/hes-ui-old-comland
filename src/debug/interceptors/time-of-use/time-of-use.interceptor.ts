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
        id: '1',
        description: 'ON-PEAK'
      },
      {
        id: '2',
        description: 'OFF-PEAK'
      },
      {
        id: '3',
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
