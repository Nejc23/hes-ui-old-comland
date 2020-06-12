import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { timeUnitCodes } from 'src/app/core/repository/consts/jobs.const';

@Injectable()
export class JobsCodelistInterceptor {
  constructor() {}

  static canInterceptTimeUnitCode(request: HttpRequest<any>): boolean {
    return new RegExp(timeUnitCodes).test(request.url);
  }

  static interceptTimeUnitCode(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 1,
        value: 'Minute'
      },
      {
        id: 2,
        value: 'Hour'
      },
      {
        id: 3,
        value: 'Day'
      },
      {
        id: 4,
        value: 'Month'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }
}
