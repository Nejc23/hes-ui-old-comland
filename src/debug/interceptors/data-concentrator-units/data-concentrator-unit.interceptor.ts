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
      id: '48823a66-87f1-495d-bdcc-8d2ed06b0b14',
      name: 'My saved filter NEW',
      idNumber: '12345',
      ip: '127.0.0.1',
      tags: [
        { id: 1, value: 'tag 1' },
        { id: 2, value: 'tag 2' },
        { id: 1, value: 'tag 3' }
      ],
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
