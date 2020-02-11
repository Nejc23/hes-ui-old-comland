import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { UserRepository } from 'src/app/core/repository/interfaces/users/user-repository.interface';

@Injectable()
export class UserInterceptor {
  constructor() {}

  static canInterceptUserGetOne(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/users/[0-9]+$`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptUserGetOne(): Observable<HttpEvent<any>> {
    const data: UserRepository = {
      id: 1,
      firstName: 'Baker',
      lastName: 'Johnson',
      userName: 'BakerJ',
      email: 'baker.johnson@company.com',
      accessTypeId: 1,
      gsmNumber: '031 031 031',
      officeNumber: '080 080 080'
    };

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptUserPost(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/users$`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptUserPost(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: UserRepository = {
      id: 1,
      firstName: 'Baker',
      lastName: 'Johnson',
      userName: 'BakerJ',
      email: 'baker.johnson@company.com',
      accessTypeId: 1,
      gsmNumber: '031 031 031',
      officeNumber: '080 080 080'
    };

    return of(
      new HttpResponse({
        status: 201,
        body: data
      })
    );
  }

  static canInterceptUserPut(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/users/[0-9]+$`).test(request.url) && request.method.endsWith('PUT');
  }

  static interceptUserPut(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body = null; // Report = request.body;

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }

  static canInterceptUserDelete(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/users/[0-9]+$`).test(request.url) && request.method.endsWith('DELETE');
  }

  static interceptUserDelete(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body = null; // Report = request.body;

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }
}
