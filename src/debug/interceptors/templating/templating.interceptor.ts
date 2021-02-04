import { getTemplatingDefaultValues } from './../../../app/core/repository/consts/templating.const';
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

  static interceptGetGetDefaultValues(request: HttpRequest<any>): Observable<HttpEvent<GetDefaultInformationResponse>> {
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
}
