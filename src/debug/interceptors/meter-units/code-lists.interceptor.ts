import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import {
  meterUnitTypes,
  meterUnits,
  meterUnitStatuses,
  meterUnitVendors,
  meterUnitTags,
  meterUnitFirmwares,
  meterUnitBreakerStates
} from 'src/app/core/repository/consts/meter-units.const';

@Injectable()
export class MeterUnitCodelistInterceptor {
  constructor() {}

  static interceptMeterUnitType(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 1,
        value: 'PLC-G3'
      },
      {
        id: 2,
        value: 'M-Bus'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptMeterUnitType(request: HttpRequest<any>): boolean {
    return new RegExp(meterUnitTypes).test(request.url);
  }

  static interceptMeterUnitStatus(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 1,
        value: 'Active'
      },
      {
        id: 2,
        value: 'Inactive'
      },
      {
        id: 3,
        value: 'Mouted'
      },
      {
        id: 4,
        value: 'Warehouse'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptMeterUnitStatus(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitStatuses}/[0-9]+$`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptMeterUnitVendor(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 1,
        value: 'Vendor 1'
      },
      {
        id: 2,
        value: 'Vendor 2'
      },
      {
        id: 3,
        value: 'Vendor 3'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptMeterUnitVendor(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitVendors}/[0-9]+$`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptMeterUnitTag(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 1,
        value: 'tag 1'
      },
      {
        id: 2,
        value: 'tag 2'
      },
      {
        id: 3,
        value: 'tag 3'
      },
      {
        id: 4,
        value: 'tag 4'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptMeterUnitTag(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitTags}/[0-9]+$`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptMeterUnitFirmware(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 1,
        value: '12.2.1'
      },
      {
        id: 2,
        value: '12.3.2'
      },
      {
        id: 3,
        value: '12.4.0'
      },
      {
        id: 4,
        value: '13.0.0'
      },
      {
        id: 5,
        value: '13.1.1'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptMeterUnitFirmware(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitFirmwares}/[0-9]+$`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptMeterUnitBreakerState(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 1,
        value: 'on'
      },
      {
        id: 2,
        value: 'off'
      },
      {
        id: 3,
        value: 'undefined'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptMeterUnitBreakerState(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitBreakerStates}/[0-9]+$`).test(request.url) && request.method.endsWith('GET');
  }
}
