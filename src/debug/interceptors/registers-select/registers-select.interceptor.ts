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
        name: 'Register PLC temp 1',
        type: 'PLC',
        description: 'description plc 1'
      },
      {
        id: 2,
        name: 'Register PLC temp 2',
        type: 'PLC',
        description: 'description plc 2'
      },
      {
        id: 3,
        name: 'Register PLC temp 3',
        type: 'PLC',
        description: 'description plc 3'
      },
      {
        id: 4,
        name: 'Register PLC temp 4',
        type: 'PLC',
        description: 'description plc 4'
      },
      {
        id: 5,
        name: 'Register PLC temp 5',
        type: 'PLC',
        description: 'description plc 5'
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
