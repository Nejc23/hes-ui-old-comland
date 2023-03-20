import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { getTemplates } from 'src/app/core/repository/consts/auto-templates.const';
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
      },
      {
        templateId: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        name: 'Template one'
      },
      {
        templateId: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b01',
        name: 'template 100'
      },
      {
        templateId: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b02',
        name: 'template 101'
      },
      {
        templateId: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b03',
        name: 'Template 103'
      },
      {
        templateId: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b04',
        name: 'Template 104'
      },
      {
        templateId: '9986-4549-579909-kioop8989-77acb54a0b05',
        name: 'template 105'
      },
      {
        templateId: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        name: 'Template 106'
      },
      {
        templateId: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b07',
        name: 'template 107'
      },
      {
        templateId: '9986-4549-579909-kioop8989-77acb54a0b08',
        name: 'template 108'
      },
      {
        templateId: '06130d62-f67c-41a2-98f7-ef521db2cee9',
        name: 'Template 109'
      },
      {
        templateId: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b10',
        name: 'template 110'
      },
      {
        templateId: '9986-4549-579909-kioop8989-77acb54a0b11',
        name: 'template 111'
      },
      {
        templateId: '06130d62-f67c-41a2-98f7-ef521db2ce12',
        name: 'Template 112'
      },
      {
        templateId: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b13',
        name: 'template my 113'
      },
      {
        templateId: '9986-4549-579909-kioop8989-77acb54a0b14',
        name: 'template 114'
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
    return new RegExp(getTemplates).test(request.url) && request.method.endsWith('GET');
  }
}
