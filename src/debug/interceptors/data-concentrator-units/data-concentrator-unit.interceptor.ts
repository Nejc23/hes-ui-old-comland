import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { addConcentrator } from 'src/app/core/repository/consts/data-concentrator-units.const';

@Injectable()
export class DataConcentratorUnitInterceptor {
  constructor() {}

  static canInterceptDcuCreatePost(request: HttpRequest<any>): boolean {
    return new RegExp(addConcentrator).test(request.url) && request.method.endsWith('POST');
  }

  static interceptDcuCreatePost(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    return of(
      new HttpResponse({
        status: 201,
        body: 'd18b2e3-f0e0-48fd-a0df-b30513f17555'
      })
    );
  }
}
