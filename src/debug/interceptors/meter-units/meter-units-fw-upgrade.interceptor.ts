import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { fwUpgrade, meterUnits, fwUploadFile } from 'src/app/core/repository/consts/meter-units.const';
import * as _ from 'lodash';
import { FileGuid, DcResponse } from 'src/app/core/repository/interfaces/meter-units/meter-units-fw-upgrade.interface';

@Injectable()
export class MeterUnitsFwUpgradeInterceptor {
  constructor() {}

  static canInterceptMeterUniFwUpgradeUploadPost(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnits}/${fwUploadFile}`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptMeterUniFwUpgradeUploadPost(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    const uuid = s.join('');

    const data: FileGuid = {
      imageGuid: uuid
    };

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptMeterUniFwUpgradePost(request: HttpRequest<any>): boolean {
    return request.url.startsWith(`${meterUnits}/${fwUpgrade}`) && request.method.endsWith('POST');
  }

  static interceptMeterUniFwUpgradePost(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body: DcResponse = {
      status: 'waiting for activiation'
    };
    return of(
      new HttpResponse({
        status: 201,
        body
      })
    );
  }
}
