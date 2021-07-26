import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { device, meterUnits } from 'src/app/core/repository/consts/meter-units.const';
import { MeterUnitDetails } from 'src/app/core/repository/interfaces/meter-units/meter-unit-details.interface';
import { AuthenticationTypeEnum } from '../../../app/core/repository/interfaces/meter-units/mu-advanced-information.interface';
import { ReferenceType } from '../../../app/core/repository/interfaces/meter-units/reference-type.enum';
import { getDevice, muCreate, muUpdate } from './../../../app/core/repository/consts/meter-units.const';

@Injectable()
export class MeterUnitInterceptor {
  constructor(private router: ActivatedRoute) {}

  static interceptGetMeterUnit(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: MeterUnitDetails = {
      deviceId: 'b295a3ec-f335-4f22-a1ee-bacf723ec343',
      name: 'Meter Unit Test',
      serialNumber: 'Serial_0124',
      templateName: 'Template one',
      protocol: 'dlms',
      manufacturer: 'Vendor 1',
      ip: '192.168.94.145',
      port: 1001,
      isGateWay: null,
      deviceStatus: 'active',
      hdlcInformation: null,
      wrapperInformation: {
        publicClientAddress: 18,
        publicServerAddress: null,
        clientAddress: 1,
        serverAddress: 1,
        physicalAddress: null
      },
      advancedInformation: {
        startWithRelease: true,
        ldnAsSystitle: true,
        authenticationType: AuthenticationTypeEnum.NONE
      },
      referencingType: ReferenceType.COSEM_SHORT_NAME
    };

    // let deviceId = request.url.split('/').pop();

    // if (!deviceId || deviceId.length === 0) {
    //   return of(
    //     new HttpResponse({
    //       status: 204
    //     })
    //   );
    // }

    // deviceId = deviceId.toLowerCase();
    // const body = data.find((d) => d.deviceId.toLowerCase() === deviceId);
    return of(
      new HttpResponse({
        status: data ? 200 : 204,
        body: data
      })
    );
  }

  static interceptGetMeterUnitFromConcentrator(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: MeterUnitDetails = {
      deviceId: 'b295a3ec-f335-4f22-a1ee-bacf723ec343',
      name: 'Meter Unit Test',
      serialNumber: 'Serial_0124',
      templateName: 'Template one',
      protocol: 'dlms',
      manufacturer: 'Vendor 1',
      ip: '192.168.94.145',
      port: 1001,
      isGateWay: null,
      deviceStatus: 'active',
      hdlcInformation: null,
      wrapperInformation: {
        publicClientAddress: 18,
        publicServerAddress: null,
        clientAddress: 1,
        serverAddress: 1,
        physicalAddress: null
      },
      advancedInformation: {
        startWithRelease: true,
        ldnAsSystitle: true,
        authenticationType: AuthenticationTypeEnum.NONE
      },
      referencingType: ReferenceType.COSEM_LOGICAL_NAME
    };

    // let deviceId = request.url.split('/').pop();

    // if (!deviceId || deviceId.length === 0) {
    //   return of(
    //     new HttpResponse({
    //       status: 204
    //     })
    //   );
    // }

    // deviceId = deviceId.toLowerCase();
    // const body = data.find((d) => d.deviceId.toLowerCase() === deviceId);
    return of(
      new HttpResponse({
        status: data ? 200 : 204,
        body: data
      })
    );
  }

  static canInterceptGetMeterUnit(request: HttpRequest<any>): boolean {
    return new RegExp(device + `/`).test(request.url) && request.method.endsWith('GET');
  }

  static canInterceptGetMeterUnitFromConcentrator(request: HttpRequest<any>): boolean {
    return new RegExp(getDevice + `/`).test(request.url) && request.method.endsWith('GET');
  }

  static canInterceptDeleteDevice(request: HttpRequest<any>): boolean {
    return new RegExp(meterUnits).test(request.url) && request.method.endsWith('DELETE');
  }

  static interceptDeleteDevice(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    return of(
      new HttpResponse({
        status: 204,
        body: null
      })
    );
  }

  static canInterceptCreateMuPost(request: HttpRequest<any>): boolean {
    return new RegExp(muCreate).test(request.url) && request.method.endsWith('POST');
  }

  static interceptCreateMuPost(request: HttpRequest<any>): Observable<HttpEvent<string>> {
    return of(
      new HttpResponse({
        status: 200,
        body: 'd18b2e3-f0e0-48fd-a0df-b30513f17556'
      })
    );
  }

  static canInterceptUpdateMuPost(request: HttpRequest<any>): boolean {
    return new RegExp(muUpdate + `/`).test(request.url) && request.method.endsWith('PUT');
  }

  static interceptUpdateMuPost(request: HttpRequest<any>): Observable<HttpEvent<string>> {
    return of(
      new HttpResponse({
        status: 200,
        body: 'd18b2e3-f0e0-48fd-a0df-b30513f17557'
      })
    );
  }
}
