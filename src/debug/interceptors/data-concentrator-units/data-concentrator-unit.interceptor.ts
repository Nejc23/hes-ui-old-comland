import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { dcuCreate } from 'src/app/core/repository/consts/data-concentrator-units.const';
import { DcuForm } from 'src/app/features/data-concentrator-units/interfaces/dcu-form.interface';

@Injectable()
export class DataConcentratorUnitInterceptor {
  constructor() {}

  static canInterceptDcuCreatePost(request: HttpRequest<any>): boolean {
    return new RegExp(dcuCreate).test(request.url) && request.method.endsWith('POST');
  }

  static interceptDcuCreatePost(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: DcuForm = {
      id: 5,
      name: 'My saved filter NEW',
      idNumber: '12345',
      ip: '127.0.0.1',
      tags: [1, 3, 4, 5],
      type: 3,
      vendor: 1
    };

    return of(
      new HttpResponse({
        status: 201,
        body: data
      })
    );
  }
}
