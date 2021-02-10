import { GetKeyTypesResponse } from './../../../app/core/repository/interfaces/templating/get-key-types-reponse.interface';
import { SecurityClient } from './../../../app/core/repository/interfaces/templating/security-client.interface';
import { getTemplatingDefaultValues, getTemplateKeyTypes } from './../../../app/core/repository/consts/templating.const';
import { muCreate } from './../../../app/core/repository/consts/meter-units.const';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { MeterUnit } from 'src/app/core/repository/interfaces/meter-units/meter-unit.interface';
import { device, meterUnits } from 'src/app/core/repository/consts/meter-units.const';
import { GetDefaultInformationResponse } from 'src/app/core/repository/interfaces/templating/get-default-information.request.interface';

@Injectable()
export class TemplatingInterceptor {
  constructor(private router: ActivatedRoute) {}

  static canInterceptGetDefaultValues(request: HttpRequest<any>): boolean {
    return new RegExp(getTemplatingDefaultValues + `/`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptGetDefaultValues(request: HttpRequest<any>): Observable<HttpEvent<GetDefaultInformationResponse>> {
    const body: GetDefaultInformationResponse = {
      advancedInformation: {
        advancedInformationId: '523d6ed9-d06e-4c63-9606-29e858a7caa3',
        templateId: '7fb32618-d93e-4ee7-892d-b5df222ba733',
        advancedInformation: {
          startWithRelease: true,
          ldnAsSystitle: true,
          authenticationType: 3
        }
      },
      hdlcInformation: {
        hdlcInformationId: '360d2243-8c8c-4c59-bdb4-f61722991cd9',
        templateId: '7fb32618-d93e-4ee7-892d-b5df222ba733',
        hdlcInformation: {
          llsClientLow: 1,
          llsServerLow: 1,
          llsClientHigh: 1,
          llsServerHigh: 1,
          password: '12344567',
          publicClientLow: 1,
          publicServerLow: 1,
          publicClientHigh: 1,
          publicServerHigh: 1,
          hlsClientLow: 1,
          hlsServerLow: 1,
          hlsClientHigh: 1,
          hlsServerHigh: 1
        }
      },
      wrapperInformation: {
        wrapperInformationId: '4d7624e0-1b38-4934-b743-c1d685d3668a',
        templateId: '7fb32618-d93e-4ee7-892d-b5df222ba733',
        wrapperInformation: {
          llsClient: 1,
          llsServer: 1,
          password: '12345678',
          publicClient: 1,
          publicServer: 16,
          hlsClient: 1,
          hlsServer: 16,
          physicalAddress: 1
        }
      }
    };

    return of(
      new HttpResponse({
        status: body ? 200 : 204,
        body
      })
    );
  }

  static canInterceptGetSecurityClients(request: HttpRequest<any>): boolean {
    return new RegExp(getTemplatingDefaultValues + `/`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptGetSecurityClients(request: HttpRequest<any>): Observable<HttpEvent<SecurityClient[]>> {
    const body: SecurityClient[] = [
      {
        deviceId: 'ec2c5457-6ebc-48a1-a6a7-07b44937fc69',
        registerDefinitionId: '37d0f05a-9525-4076-9b2c-c5897385b180',
        registerName: 'Enable HLS 1',
        registerType: 'MANAGEMENT_SECURITY_SETUP'
      },
      {
        deviceId: 'd8a7c035-35ed-49f2-879e-0917eb1f56fe',
        registerDefinitionId: '37d0f05a-9525-4076-9b2c-c5897385b180',
        registerName: 'Enable HLS 2',
        registerType: 'MANAGEMENT_SECURITY_SETUP'
      },
      {
        deviceId: 'fb8c097a-2088-4d1e-8107-130a89eee156',
        registerDefinitionId: '37d0f05a-9525-4076-9b2c-c5897385b180',
        registerName: 'Enable HLS 3',
        registerType: 'MANAGEMENT_SECURITY_SETUP'
      }
    ];

    return of(
      new HttpResponse({
        status: body ? 200 : 204,
        body
      })
    );
  }

  static canInterceptGetKeyTypes(request: HttpRequest<any>): boolean {
    return new RegExp(getTemplateKeyTypes).test(request.url) && request.method.endsWith('GET');
  }

  static interceptGetKeyTypes(request: HttpRequest<any>): Observable<HttpEvent<GetKeyTypesResponse>> {
    const body: GetKeyTypesResponse = {
      keyTypes: ['GUEK', 'GAK', 'GBEK']
    };

    return of(
      new HttpResponse({
        status: body ? 200 : 204,
        body
      })
    );
  }
}
