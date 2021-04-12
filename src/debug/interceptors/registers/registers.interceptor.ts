import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { SchedulableRegistersResponse } from 'src/app/core/repository/interfaces/registers-select/schedulable-registers-response.interface';
import { deviceRegisters } from 'src/app/core/repository/consts/meter-units.const';

@Injectable()
export class RegistersInterceptor {
  constructor() {}

  static interceptGetSchedulableRegisters(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: SchedulableRegistersResponse = {
      allHaveTemplate: false,
      templatelessDevices: null,
      schedulableRegistersType: [
        {
          name: 'property1',
          isSelectable: false
        },
        {
          name: 'loadprofilE1',
          isSelectable: false
        },
        {
          name: 'property2',
          isSelectable: true
        },
        {
          name: 'property3',
          isSelectable: true
        },
        {
          name: 'property4',
          isSelectable: true
        },
        {
          name: 'property5',
          isSelectable: true
        }
      ]
    };

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptGetSchedulableRegisters(request: HttpRequest<any>): boolean {
    return new RegExp(`${deviceRegisters}$`).test(request.url) && request.method.endsWith('POST');
  }
}
