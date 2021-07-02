import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
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
