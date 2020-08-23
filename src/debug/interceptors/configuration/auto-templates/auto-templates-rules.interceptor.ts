import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import {
  autoTemplateRulesAdd,
  autoTemplateRulesDelete,
  autoTemplateRulesUpdate,
  autoTemplateRules
} from 'src/app/core/repository/consts/auto-templates.const';
import { AutoTemplateRuleList } from 'src/app/core/repository/interfaces/auto-templates/auto-template-rule.interface';

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

  static canInterceptAutoTemplatesRuleGet(request: HttpRequest<any>): boolean {
    return RegExp(`${autoTemplateRules}/[0-9a-fA-F\-]+`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptAutoTemplatesRuleGet(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const responseBody: AutoTemplateRuleList = {
      templateId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
      autoTemplateRules: [
        {
          autoTemplateRuleId: '9b837e2d-957d-49e2-8d1d-a2e4b843rrr77',
          propertyName: 'obis2',
          propertyValue: 'rule 22212'
        },
        {
          autoTemplateRuleId: '5456643-957d-49e2-8d1d-a2e4b843rrr77',
          propertyName: 'obis3322',
          propertyValue: 'rule2'
        }
      ]
    };

    return of(
      new HttpResponse({
        status: 200,
        body: responseBody
      })
    );
  }
}
