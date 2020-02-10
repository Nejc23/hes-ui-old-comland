import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class UserRequestResetPasswordInterceptor {
  constructor() {}

  static interceptUserRequestResetPassword(): Observable<HttpEvent<any>> {
    return of(
      new HttpResponse({
        status: 200,
        body: null
      })
    );
  }

  static canInterceptUserRequestResetPassword(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/users/request-password-reset$`).test(request.url) && request.method.endsWith('POST');
  }
}
