import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { registers } from 'src/app/core/repository/consts/meter-units.const';
// import { registers } from 'src/app/core/repository/consts/auto-templates.const';

@Injectable()
export class RegistersSelectInterceptor {
  constructor() {}

  static interceptMeterUnitRegisters(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body: RegistersSelectList[] = [
      {
        id: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        name: 'Register abc 1',
        type: 'type A',
        description: 'description 1'
      },
      {
        id: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b00',
        name: 'Register def 2',
        type: 'type B',
        description: 'description 2'
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe54',
        name: 'Register def 3',
        type: 'type B',
        description: 'description 3'
      },
      {
        id: 'c129f32f-33f8-4917-a190-53dfe388cc6d',
        name: 'Register abc 4',
        type: 'type A',
        description: 'description 4'
      },
      {
        id: '5f128531-0bce-46f9-b8df-264d8a3945fb',
        name: 'Register temp 5',
        type: 'type C',
        description: 'description 5'
      },
      {
        id: '2eee0a94-cb09-4334-b36f-796ef0e08983',
        name: 'Register temp 6',
        type: 'type C',
        description: 'description 6'
      },
      {
        id: '6f3c7dc9-784e-4d8f-b6dc-913f116e94a6',
        name: 'Register temp 7',
        type: 'type C',
        description: 'description 7'
      },
      {
        id: '845d8f84-705a-44bd-a5e1-e27cb705ecfc',
        name: 'Register temp 8',
        type: 'type C',
        description: 'description 8'
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
    // return new RegExp(registers).test(request.url) && request.method.endsWith('POST');
    return new RegExp(registers).test(request.url) && request.method.endsWith('GET');
  }
}
