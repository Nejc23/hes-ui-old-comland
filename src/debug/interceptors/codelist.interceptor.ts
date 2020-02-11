import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CodelistPowerline } from 'src/app/core/repository/interfaces/codelists/codelist-powerline.interface';
import { Codelist } from 'src/app/core/repository/interfaces/codelists/codelist.interface';

@Injectable()
export class CodelistInterceptor {
  constructor() {}

  static interceptPowerlines(): Observable<HttpEvent<any>> {
    const data: CodelistPowerline[] = [
      {
        id: 1,
        value: 'Powerline 1',
        devices: [
          {
            id: 1,
            value: 'Device 1'
          },
          {
            id: 2,
            value: 'Device 2'
          }
        ]
      },
      {
        id: 2,
        value: 'Powerline 2',
        devices: [
          {
            id: 1,
            value: 'Device 3'
          },
          {
            id: 2,
            value: 'Device 4'
          }
        ]
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptPowerlines(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/codelists/powerlines`).test(request.url);
  }

  static interceptDevicesWithPhotos(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      { id: 1, value: 'Device 1' },
      { id: 2, value: 'Device 2' }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptDevicesWithPhotos(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/codelists/devicesWithPhotos`).test(request.url);
  }

  static interceptVoltageLevel(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      { id: 1, value: '101 kv' },
      { id: 2, value: '110 kv' },
      { id: 3, value: '150 kv' },
      { id: 4, value: '200 kv' },
      { id: 5, value: '1 Mv' }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptVoltageLevel(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/codelists/voltage-levels`).test(request.url);
  }

  static interceptWireType(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      { id: 1, value: 'HVDC' },
      { id: 2, value: 'HVAC' },
      { id: 3, value: 'NA2XSY' },
      { id: 4, value: 'NA2XS(FL)2Y' },
      { id: 5, value: 'N2XSEY' }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptWireType(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/codelists/wire-types`).test(request.url);
  }

  static interceptReportType(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      { id: 1, value: 'Availability' },
      { id: 2, value: 'Device status' },
      { id: 3, value: 'Warnings or error on devices' }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptReportType(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/codelists/report-types`).test(request.url);
  }

  static interceptAccessType(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      { id: 1, value: 'User' },
      { id: 2, value: 'Super user' }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptAccessType(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/codelists/access-types`).test(request.url);
  }
}
