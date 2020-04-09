import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { meterUnitRegisters } from 'src/app/core/repository/consts/data-concentrator-units.const';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';

@Injectable()
export class RegistersSelectInterceptor {
  constructor() {}

  static interceptMeterUnitRegisters(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body: RegistersSelectList[] = [
      {
        id: 1,
        name: 'Register abc 1',
        type: 'type A',
        description: 'description 1'
      },
      {
        id: 2,
        name: 'Register def 2',
        type: 'type B',
        description: 'description 2'
      },
      {
        id: 3,
        name: 'Register def 3',
        type: 'type B',
        description: 'description 3'
      },
      {
        id: 4,
        name: 'Register abc 4',
        type: 'type A',
        description: 'description 4'
      },
      {
        id: 5,
        name: 'Register temp 5',
        type: 'type C',
        description: 'description 5'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }

  static canInterceptMeterUnitRegisters(request: HttpRequest<any>): boolean {
    return new RegExp(meterUnitRegisters).test(request.url) && request.method.endsWith('GET');
  }
}
