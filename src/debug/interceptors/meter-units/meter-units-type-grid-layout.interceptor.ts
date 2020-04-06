import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { meterUnitsTypeLayout, meterUnits } from 'src/app/core/repository/consts/data-concentrator-units.const';
import { MeterUnitsTypeLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-type-layout.interface';

@Injectable()
export class MeterUnitsTypeGridLayoutInterceptor {
  constructor() {}

  static interceptMutLayoutGet(): Observable<HttpEvent<any>> {
    const data: MeterUnitsTypeLayout[] = [
      {
        id: 1,
        name: 'My saved filter 1',
        vendorFilter: null,
        statusesFilter: [
          { id: 1, value: 'Active' },
          { id: 3, value: 'Mouted' }
        ],
        typesFilter: [1],
        tagsFilter: [
          { id: 3, value: 'tag 3' },
          { id: 2, value: 'tag 2' },
          { id: 1, value: 'tag 1' }
        ],
        firmwareFilter: [{ id: 1, value: 'frmware 1' }],
        breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
        gridLayout:
          '%5B%7B%22colId%22%3A%220%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A27%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id%22%2C%22hide%22%3Atrue%2C%22aggFunc%22%3Anull%2C%22width%22%3A20%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A130%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22metersValue%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22type%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A53%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22idNumber%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22ip%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22lastCommunication%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A266%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
      },
      {
        id: 2,
        name: 'My saved filter 2',
        vendorFilter: { id: 1, value: 'Vendor 1' },
        statusesFilter: [
          { id: 1, value: 'Active' },
          { id: 2, value: 'Inactive' }
        ],
        typesFilter: [2, 3],
        tagsFilter: [
          { id: 3, value: 'tag 3' },
          { id: 1, value: 'tag 1' }
        ],
        firmwareFilter: [{ id: 1, value: 'frmware 1' }],
        breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
        gridLayout:
          '%5B%7B%22colId%22%3A%220%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A27%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id%22%2C%22hide%22%3Atrue%2C%22aggFunc%22%3Anull%2C%22width%22%3A20%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A130%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22metersValue%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22type%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A53%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22idNumber%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22ip%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22lastCommunication%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A266%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
      },
      {
        id: 3,
        name: 'My saved filter 3',
        vendorFilter: { id: 2, value: 'Vendor 2' },
        statusesFilter: [{ id: 2, value: 'Inactive' }],
        typesFilter: [1, 2],
        tagsFilter: [],
        firmwareFilter: [{ id: 1, value: 'frmware 1' }],
        breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
        gridLayout:
          '%5B%7B%22colId%22%3A%220%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A27%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id%22%2C%22hide%22%3Atrue%2C%22aggFunc%22%3Anull%2C%22width%22%3A20%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A130%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22metersValue%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22type%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A53%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22idNumber%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22ip%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22lastCommunication%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A266%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
      },
      {
        id: 4,
        name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        vendorFilter: { id: 2, value: 'Vendor 2' },
        statusesFilter: [],
        typesFilter: [2],
        tagsFilter: [],
        firmwareFilter: [{ id: 1, value: 'frmware 1' }],
        breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
        gridLayout:
          '%5B%7B%22colId%22%3A%220%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A27%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id%22%2C%22hide%22%3Atrue%2C%22aggFunc%22%3Anull%2C%22width%22%3A20%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A130%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22metersValue%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22type%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A53%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22idNumber%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22ip%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22lastCommunication%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A266%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptMutLayoutGet(request: HttpRequest<any>): boolean {
    console.log(request.url);
    return new RegExp(`${meterUnits}/[0-9]+$` && `/${meterUnitsTypeLayout}`).test(request.url) && request.method.endsWith('GET');
  }

  static canInterceptMutLayoutPost(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnits}/[0-9]+$` && `/${meterUnitsTypeLayout}`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptMutLayoutPost(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: MeterUnitsTypeLayout = {
      id: 5,
      name: 'My saved filter NEW',
      vendorFilter: null,
      statusesFilter: [{ id: 3, value: 'Mouted' }],
      typesFilter: [3],
      tagsFilter: [
        { id: 3, value: 'tag 3' },
        { id: 1, value: 'tag 1' }
      ],
      firmwareFilter: [{ id: 1, value: 'frmware 1' }],
      breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
      gridLayout:
        '%5B%7B%22colId%22%3A%220%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A27%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id%22%2C%22hide%22%3Atrue%2C%22aggFunc%22%3Anull%2C%22width%22%3A20%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A130%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22metersValue%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22type%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A53%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22idNumber%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22ip%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22lastCommunication%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A266%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
    };

    return of(
      new HttpResponse({
        status: 201,
        body: data
      })
    );
  }

  static canInterceptMutLayoutPut(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnits}/[0-9]+$` && `/${meterUnitsTypeLayout}/[0-9]+$`).test(request.url) && request.method.endsWith('PUT');
  }

  static interceptMutLayoutPut(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body = null; // Report = request.body;

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }

  static canInterceptMutLayoutDelete(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnits}/[0-9]+$` && `/${meterUnitsTypeLayout}/[0-9]+$`).test(request.url) && request.method.endsWith('DELETE');
  }

  static interceptMutLayoutDelete(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body = null; // Report = request.body;

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }
}
