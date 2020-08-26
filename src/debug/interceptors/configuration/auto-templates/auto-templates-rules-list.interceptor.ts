import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { autoTemplateRules } from 'src/app/core/repository/consts/auto-templates.const';
import { AutoTemplateRuleList } from 'src/app/core/repository/interfaces/auto-templates/auto-template-rule.interface';

@Injectable()
export class AutoTemplatesRulesListInterceptor {
  constructor() {}

  static interceptAutoTemplatesRulesList(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body: AutoTemplateRuleList[] = [
      {
        templateId: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        autoTemplateRules: [
          {
            autoTemplateRuleId: '99434-434-5532-1245-6frw4434455',
            propertyName: '1.0.0.2.3.3',
            propertyValue: 'regex 5'
          },
          {
            autoTemplateRuleId: 'mi43455-4443-434-5532-1245-6frw4434455',
            propertyName: '1.0.2.2.3.255',
            propertyValue: 'regex 11'
          }
        ]
      },
      {
        templateId: '089434-445k55-4f4b-a33f-0000000000',
        autoTemplateRules: [
          {
            autoTemplateRuleId: '111111-434-5532-1245-9494949494',
            propertyName: '12.0.223.2.3.233',
            propertyValue: 'regex 9'
          }
        ]
      },
      {
        templateId: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b00',
        autoTemplateRules: [
          {
            autoTemplateRuleId: '33444-434-5532-1245-44444',
            propertyName: '8.0.20.2.39.20',
            propertyValue: 'regex 59'
          }
        ]
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }

  static canInterceptAutoTemplatesRulesList(request: HttpRequest<any>): boolean {
    return new RegExp(`${autoTemplateRules}$`).test(request.url) && request.method.endsWith('GET');
  }
}
