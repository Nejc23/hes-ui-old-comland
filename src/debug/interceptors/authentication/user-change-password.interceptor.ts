import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable()
export class UserChangePasswordInterceptor {
  constructor() {}

  static interceptUserChangePassword(): Observable<HttpEvent<any>> {
    return of(
      new HttpResponse({
        status: 200,
        body: null
      })
    );
  }

  static canInterceptUserChangePassword(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/users/change-password$`).test(request.url) && request.method.endsWith('POST');
  }
}
