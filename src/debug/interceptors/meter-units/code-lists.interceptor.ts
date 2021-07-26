import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  meterUnitCiiStates,
  meterUnitDisconnectorStates,
  meterUnitFirmwares,
  meterUnitsProtocolType,
  meterUnitStatuses,
  meterUnitTags,
  meterUnitTypes,
  meterUnitVendors
} from 'src/app/core/repository/consts/meter-units.const';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import {
  meterUnitsAlarmSeverityType,
  meterUnitsAlarmSourceType,
  meterUnitsDeviceMedium
} from './../../../app/core/repository/consts/meter-units.const';

@Injectable()
export class MeterUnitCodelistInterceptor {
  constructor() {}

  static interceptMeterUnitType(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 1,
        value: 'G3-PLC'
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
      },
      {
        id: 4,
        value: 'lgz'
      },
      {
        id: 5,
        value: 'isk'
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
        value: 'Connected'
      },
      {
        id: 2,
        value: 'Disconnected'
      },
      {
        id: 3,
        value: 'ReadyForReConnection'
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
    return new RegExp(`${meterUnitDisconnectorStates}/[0-9]+$`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptMeterUnitCiiState(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 1,
        value: 'on'
      },
      {
        id: 2,
        value: 'off'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptMeterUnitCiiState(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitCiiStates}/[0-9]+$`).test(request.url) && request.method.endsWith('GET');
  }

  static canInterceptMeterUnitProtocolType(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitsProtocolType}$`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptMeterUnitProtocolType(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 0,
        value: 'UNKNOWN'
      },
      {
        id: 1,
        value: 'DC450G3'
      },
      {
        id: 2,
        value: 'DLMS'
      },
      {
        id: 3,
        value: 'AC750'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptMeterUnitDeviceMedium(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitsDeviceMedium}$`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptMeterUnitDeviceMedium(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 0,
        value: 'UNKNOWN'
      },
      {
        id: 1,
        value: 'ELECTRICITY'
      },
      {
        id: 2,
        value: 'WATER'
      },
      {
        id: 3,
        value: 'GAS'
      },
      {
        id: 4,
        value: 'HEAT'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptMeterUnitAlarmSeverityType(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitsAlarmSeverityType}$`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptMeterUnitAlarmSeverityType(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 0,
        value: 'UNKNOWN'
      },
      {
        id: 1,
        value: 'HIGH'
      },
      {
        id: 2,
        value: 'MEDIUM'
      },
      {
        id: 3,
        value: 'LOW'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptMeterUnitAlarmSourceType(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitsAlarmSourceType}$`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptMeterUnitAlarmSourceType(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 0,
        value: 'UNKNOWN'
      },
      {
        id: 1,
        value: 'SYSTEM'
      },
      {
        id: 2,
        value: 'concentrator'
      },
      {
        id: 3,
        value: 'METER'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }
}
