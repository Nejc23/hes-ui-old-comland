import { jobsAssignExisting } from './../../../app/core/repository/consts/my-grid-link.const';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';

@Injectable()
export class MeterUnitsPlcActionsInterceptor {
  constructor() {}

  static canInterceptPostJobsAssignExisting(request: HttpRequest<any>): boolean {
    return new RegExp(`${jobsAssignExisting}`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptPostJobsAssignExisting(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body = null; // Report = request.body;

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }
}
