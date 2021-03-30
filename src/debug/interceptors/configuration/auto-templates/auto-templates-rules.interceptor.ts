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
          propertyValue: 'rule 22212',
          jobIds: ['ff11d571-8ff7-4c1a-aaa2-61c6bfdd2383', 'b8342f41-4131-4e43-8ea7-71da78636420']
        },
        {
          autoTemplateRuleId: '5456643-957d-49e2-8d1d-a2e4b843rrr79',
          propertyName: 'obis3322',
          propertyValue: 'rule2',
          jobIds: ['e27d45fd-8f27-4593-a70c-6bf3369fd379', '75279ce2-1f34-4f32-8075-6193225d4917']
        },
        {
          autoTemplateRuleId: '5456643-957d-49e2-8d1d-a2e4b843rrr79',
          propertyName: 'obis3323',
          propertyValue: 'rule23',
          jobIds: ['e27d45fd-8f27-4593-a70c-6bf3369fd379', '75279ce2-1f34-4f32-8075-6193225d4917']
        },
        {
          autoTemplateRuleId: '5456643-957d-49e2-8d1d-a2e4b843rrr80',
          propertyName: 'obis3324',
          propertyValue: 'rule24',
          jobIds: ['e27d45fd-8f27-4593-a70c-6bf3369fd379', '75279ce2-1f34-4f32-8075-6193225d4917']
        },
        {
          autoTemplateRuleId: '5456643-957d-49e2-8d1d-a2e4b843rrr81',
          propertyName: 'obis3325',
          propertyValue: 'rule25',
          jobIds: ['e27d45fd-8f27-4593-a70c-6bf3369fd379', '75279ce2-1f34-4f32-8075-6193225d4917']
        },
        {
          autoTemplateRuleId: '5456643-957d-49e2-8d1d-a2e4b843rrr82',
          propertyName: 'obis3326',
          propertyValue: 'rule26',
          jobIds: ['e27d45fd-8f27-4593-a70c-6bf3369fd379', '75279ce2-1f34-4f32-8075-6193225d4917']
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
