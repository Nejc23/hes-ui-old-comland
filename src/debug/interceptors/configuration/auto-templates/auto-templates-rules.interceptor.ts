import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import {
  autoTemplateRulesAdd,
  autoTemplateRulesDelete,
  autoTemplateRulesUpdate
} from 'src/app/core/repository/consts/auto-templates.const';

@Injectable()
export class AutoTemplatesRulesInterceptor {
  constructor() {}

  static canInterceptAutoTemplatesRulePost(request: HttpRequest<any>): boolean {
    return new RegExp(`${autoTemplateRulesAdd}`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptAutoTemplatesRulePost(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body = null;

    return of(
      new HttpResponse({
        status: 201,
        body
      })
    );
  }

  static canInterceptAutoTemplatesRuleDelete(request: HttpRequest<any>): boolean {
    return request.url.startsWith(`${autoTemplateRulesDelete}`) && request.method.endsWith('DELETE');
  }

  static interceptAutoTemplatesRuleDelete(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body = null;

    return of(
      new HttpResponse({
        status: 204,
        body
      })
    );
  }

  static canInterceptAutoTemplatesRuleUpdate(request: HttpRequest<any>): boolean {
    return request.url.startsWith(`${autoTemplateRulesUpdate}`) && request.method.endsWith('PUT');
  }

  static interceptAutoTemplatesRuleUpdate(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body = null;

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }
}
