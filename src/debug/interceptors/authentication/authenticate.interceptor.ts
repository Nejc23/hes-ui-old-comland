import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthenticatedUser } from 'src/app/core/auth/interfaces/authenticated-user.interface';

@Injectable()
export class AuthenticateInterceptor {
  constructor() {}

  static interceptAuthenticateUser(): Observable<HttpEvent<any>> {
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

  static canInterceptAuthenticateUser(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/users/authenticate$`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptRefreshToken(): Observable<HttpEvent<any>> {
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

  static canInterceptRefreshToken(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/users/refresh$`).test(request.url) && request.method.endsWith('POST');
  }
}
