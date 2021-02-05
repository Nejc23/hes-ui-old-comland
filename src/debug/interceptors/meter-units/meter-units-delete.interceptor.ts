import { IActionResponseDeleteDevice } from './../../../app/core/repository/interfaces/myGridLink/action-prams.interface';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { fwUpgrade, meterUnits, fwUploadFile } from 'src/app/core/repository/consts/meter-units.const';
import * as _ from 'lodash';
import { FileGuid } from 'src/app/core/repository/interfaces/meter-units/meter-units-fw-upgrade.interface';
import { IActionResponseFwUpgradeData, IActionResponseParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';

@Injectable()
export class MeterUnitsFwUpgradeInterceptor {
  constructor() {}

  static canInterceptDeleteDevice(request: HttpRequest<any>): boolean {
    return new RegExp(meterUnits + `/`).test(request.url) && request.method.endsWith('DELETE');
  }

  static interceptDeleteDevice(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: IActionResponseDeleteDevice = {
      pageSize: 1,
      pageNumber: 1,
      sort: [
        {
          index: 0,
          propName: 'Firmware',
          sortOrder: 'Ascending'
        }
      ],
      textSearch: {
        value: '',
        propNames: [],
        useWildcards: false
      },
      requestId: 'cca9906e-929b-4104-ab54-f866df79b632',
      includedIds: ['0A4A1AE4-3964-47D3-9E38-C017833FFE0C', 'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E', '15A607EA-DEB7-46E5-BD5D-F8A067AD2842']
    };

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }
}
