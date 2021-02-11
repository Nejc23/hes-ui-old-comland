import { SecurityClient } from './../../../app/core/repository/interfaces/templating/security-client.interface';
import { muCreate } from './../../../app/core/repository/consts/meter-units.const';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { MeterUnit } from 'src/app/core/repository/interfaces/meter-units/meter-unit.interface';
import { device, meterUnits } from 'src/app/core/repository/consts/meter-units.const';
import { GetDefaultInformationResponse } from 'src/app/core/repository/interfaces/templating/get-default-information.request.interface';
import { getTemplateKeyTypes } from 'src/app/core/repository/consts/templates.const';
import { GetKeyTypesResponse } from 'src/app/core/repository/interfaces/templates/get-key-types-reponse.interface';

@Injectable()
export class TemplatesInterceptor {
  constructor(private router: ActivatedRoute) {}

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
