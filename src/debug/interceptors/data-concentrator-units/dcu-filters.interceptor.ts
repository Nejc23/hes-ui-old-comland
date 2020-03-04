import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DcuFilter } from 'src/app/features/data-concentrator-units/interfaces/dcu-filter.interface';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { dcuFilters } from 'src/app/core/repository/consts/data-concentrator-units.const';

@Injectable()
export class DcuFiltersInterceptor {
  constructor() {}

  static interceptDcuFilters(): Observable<HttpEvent<any>> {
    const data: DcuFilter[] = [
      {
        id: 1,
        name: 'My saved filter 1',
        vendor: null,
        statuses: [],
        types: [1],
        tags: []
      },
      {
        id: 2,
        name: 'My saved filter 2',
        vendor: 1,
        statuses: [
          { id: 1, value: 'Active' },
          { id: 2, value: 'Inactive' }
        ],
        types: [2, 3],
        tags: [
          { id: 3, value: 'tag 3' },
          { id: 1, value: 'tag 1' }
        ]
      },
      {
        id: 3,
        name: 'My saved filter 3',
        vendor: 2,
        statuses: [],
        types: [1, 2],
        tags: []
      },
      {
        id: 4,
        name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        vendor: 2,
        statuses: [],
        types: [2],
        tags: []
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptDcuFilters(request: HttpRequest<any>): boolean {
    return new RegExp(dcuFilters).test(request.url);
  }
}
