import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AuthenticatedUser } from 'src/app/core/auth/interfaces/authenticated-user.interface';
import { User } from 'oidc-client';

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
          writeRights: true,
          action: []
        },
        {
          functionality: 'configuration',
          writeRights: true,
          action: []
        },
        {
          functionality: 'analytics',
          writeRights: true,
          action: []
        },
        {
          functionality: 'reports',
          writeRights: true,
          action: []
        },
        {
          functionality: 'users',
          writeRights: true,
          action: []
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
          writeRights: true,
          action: []
        },
        {
          functionality: 'configuration',
          writeRights: true,
          action: []
        },
        {
          functionality: 'analytics',
          writeRights: true,
          action: []
        },
        {
          functionality: 'reports',
          writeRights: true,
          action: []
        },
        {
          functionality: 'users',
          writeRights: true,
          action: []
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

  static interceptAuthenticateDevelopUser(): Observable<HttpEvent<any>> {
    const today = new Date();
    today.setHours(today.getHours() + 4);
    const data: User = {
      access_token: undefined,
      expires_at: undefined,
      id_token:
        'eyJhbGciOiJSUzI1NiIsImtpZCI6IjZjNjJlZTMxYTkzMGRiZTVkZjhmNTE0M2NlNzZiOTExIiwidHlwIjoiSldUIn0.eyJuYmYiOjE1ODc1NDY1OTQsImV4cCI6MTU4NzU0Njg5NCwiaXNzIjoiaHR0cDovLzg5LjIxMi4yMDEuMjAyOjgwODEiLCJhdWQiOiJlcG9pbnQyIiwibm9uY2UiOiJiZDk2ZWI1ZmNlMzM0NDY3ODIxMzQ4OGJiZjQ2NTk2NCIsImlhdCI6MTU4NzU0NjU5NCwic2lkIjoiOGU3OWIyNWFiMjMwZjBiYWVlNDk4N2RmZWVhYmY4YzQiLCJzdWIiOiI3NjgyYjE4NC1lNmE2LTRkZDctOTNjZi1kOGZhODFiZjA1MzYiLCJhdXRoX3RpbWUiOjE1ODc1NDY1OTQsImlkcCI6ImxvY2FsIiwibmFtZSI6ImRhbWlqYW4ua2F2c0Bjb21sYW5kLnNpIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiRGFtaWphbiBLYXZzIiwiem9uZWluZm8iOiJFdXJvcGUvUHJhZ3VlIiwiYmlydGhkYXRlIjoiIiwiZmFtaWx5X25hbWUiOiJLYXZzIiwiZ2l2ZW5fbmFtZSI6IkRhbWlqYW4iLCJ3ZWJzaXRlIjoiIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6ImRhbWlqYW4ua2F2c0Bjb21sYW5kLnNpIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjpbIlBhcnRuZXIiLCJVc2VyIiwiUmVnaXN0ZXJlZFVzZXIiXSwiY29tcGFueV9pZGVudCI6Ijk4NjNiMzU2LTg5ZjctNGY1Ny04MTUwLTJlNGFjYTEwOTliMyIsImNvbXBhbnlfbmFtZSI6IkNvbWxhbmQiLCJhbXIiOlsicHdkIl19.bgylRYlJtP5nUJZKxQOW9KHk0HOhSoqgnA-Q0rjZuOqiArLGP5Yhy7S8QGT3BXNxpBT-H9M06XAL-uoupS2hwNy7sUOJzhRdsCZBc9X_tIHWu9sbJYY3cBaXznX7drXnAveCQJOJzEfEJyW9WZlC9Xmc2Nt_PSVB8c319WmmqPUkNUUCRUPgRn1pgqAxCX_GNmQ0Ti6akW28mgxAcj5N8Dr1iUoUwbZ8fx9590kVDd6PaSe8R8Kxub7o-RzoJUJwM2iv08GC7a-XUB2LiaKaC8IaDu0yWShxJvul5qj1j7mNOgEqcEZzy-ZKLiKavvVOqPdRqp6MsZSLTyf_mdX6nQ',

      refresh_token: undefined,
      scope: 'openid profile roles company offline_access',
      session_state: 'FvSB6_uNDiY8DX86nZU_1G_AEsPpLZjPcUKEsJ731Ek.ebeebe4ae130099a87f0d1f94c6154f1',
      state: undefined,
      token_type: undefined,
      profile: {
        amr: ['pwd'],
        auth_time: 1587546594,
        birthdate: '',
        company_ident: '9863b356-89f7-4f57-8150-2e4aca1099b3',
        company_name: 'Comland',
        family_name: 'Develop',
        given_name: 'User',
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': ['SuperAdmin', 'User', 'RegisteredUser'],
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': 'damijan.kavs@comland.si',
        idp: 'local',
        name: 'damijan.kavs@comland.si',
        preferred_username: 'Damijan Kavs',
        sid: '8e79b25ab230f0baee4987dfeeabf8c4',
        sub: '7682b184-e6a6-4dd7-93cf-d8fa81bf0536',
        website: '',
        zoneinfo: 'Europe/Prague',
        iss: '323233',
        aud: '3333',
        exp: 1,
        iat: 2
      },
      expires_in: undefined,
      toStorageString: undefined,
      expired: undefined,
      scopes: []
    };

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptAuthenticateDevelopUser(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/users/authenticateIdentityDevelop$`).test(request.url) && request.method.endsWith('POST');
  }
}
