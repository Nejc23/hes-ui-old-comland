import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CodelistPowerline } from 'src/app/shared/repository/interfaces/codelists/codelist-powerline.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { dcuStatuses, dcuTypes, dcuVendors, dcuTags } from 'src/app/core/repository/consts/data-concentrator-units.const';
import { meterUnitTypes } from 'src/app/core/repository/consts/meter-units.const';

@Injectable()
export class CodelistInterceptor {
  constructor() {}

  static interceptDcuStatus(): Observable<HttpEvent<any>> {
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

  static canInterceptDcuStatus(request: HttpRequest<any>): boolean {
    return new RegExp(dcuStatuses).test(request.url);
  }

  static interceptDcuType(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 1,
        value: 'G2-PLX'
      },
      {
        id: 2,
        value: 'G3-PLC'
      },
      {
        id: 3,
        value: 'G4-PLC'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptDcuType(request: HttpRequest<any>): boolean {
    return new RegExp(dcuTypes).test(request.url);
  }

  static interceptDcuVendor(): Observable<HttpEvent<any>> {
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

  static canInterceptDcuVendor(request: HttpRequest<any>): boolean {
    return new RegExp(dcuVendors).test(request.url);
  }

  static interceptDcuTag(): Observable<HttpEvent<any>> {
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

  static canInterceptDcuTag(request: HttpRequest<any>): boolean {
    return new RegExp(dcuTags).test(request.url);
  }
}
