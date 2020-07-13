import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { templates } from 'src/app/core/repository/consts/auto-templates.const';
import { TemplatesList } from 'src/app/core/repository/interfaces/auto-templates/templates-list.interface';

@Injectable()
export class AutoTemplatesListInterceptor {
  constructor() {}

  static interceptAutoTemplatesList(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body: TemplatesList[] = [
      {
        templateId: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        name: 'Template one'
      },
      {
        templateId: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b00',
        name: 'template my 3'
      },
      {
        templateId: '9986-4549-579909-kioop8989-77acb54a0b00',
        name: 'template 422'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }

  static canInterceptAutoTemplatesList(request: HttpRequest<any>): boolean {
    return new RegExp(templates).test(request.url) && request.method.endsWith('GET');
  }
}
