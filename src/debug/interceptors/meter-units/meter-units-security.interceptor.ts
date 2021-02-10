import { securityEnableHls } from './../../../app/core/repository/consts/my-grid-link.const';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';

@Injectable()
export class MeterUnitsTypeSecurityInterceptor {
  constructor() {}

  static canInterceptSecurityEnableHls(request: HttpRequest<any>): boolean {
    return new RegExp(`${securityEnableHls}`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptSecurityEnableHls(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body = null; // Report = request.body;

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }
}
