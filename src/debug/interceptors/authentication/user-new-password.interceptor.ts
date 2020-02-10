import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthenticatedUser } from 'src/app/core/auth/interfaces/authenticated-user.interface';

@Injectable()
export class UserNewPasswordInterceptor {
  constructor() {}

  static interceptUserNewPassword(): Observable<HttpEvent<any>> {
    const today = new Date();
    today.setHours(today.getHours() + 4);

    const data: AuthenticatedUser = {
      tokenType: 'bearer',
      accessToken: 'token 1',
      expireDate: today.toISOString(),
      refreshToken: '838238230000440',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@company.com',
      accessType: 'admin',
      userRights: [
        {
          functionality: 'dashboard',
          writeRights: true
        },
        {
          functionality: 'configuration',
          writeRights: true
        },
        {
          functionality: 'analytics',
          writeRights: true
        },
        {
          functionality: 'reports',
          writeRights: true
        },
        {
          functionality: 'users',
          writeRights: true
        }
      ]
    };

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptUserNewPassword(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/users/new-password$`).test(request.url) && request.method.endsWith('POST');
  }
}
