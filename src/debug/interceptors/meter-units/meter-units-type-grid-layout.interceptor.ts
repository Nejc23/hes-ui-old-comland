import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { meterUnits, meterUnitsLayout } from 'src/app/core/repository/consts/meter-units.const';

@Injectable()
export class MeterUnitsTypeGridLayoutInterceptor {
  constructor() {}

  static interceptMutLayoutGet(): Observable<HttpEvent<any>> {
    const data: MeterUnitsLayout[] = [
      {
        id: 1,
        name: 'My saved filter 1',
        vendorsFilter: null,
        statusesFilter: [
          { id: 1, value: 'Active' },
          { id: 3, value: 'Mouted' }
        ],
        readStatusFilter: {
          operation: { id: 'In Range', value: 'In Range' },
          value1: 10,
          value2: 30
        },
        tagsFilter: [
          { id: 3, value: 'tag 3' },
          { id: 2, value: 'tag 2' },
          { id: 1, value: 'tag 1' }
        ],
        appFirmwareFilter: [{ id: 1, value: 'frmware 1' }],
        breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
        ciiStateFilter: [{ id: 1, value: 'cii state 1' }],
        showOptionFilter: [{ id: 1, value: `With template` }],
        showMeterUnitsWithoutTemplateFilter: false,
        showOnlyMeterUnitsWithMBusInfoFilter: false,
        showOnlyImageReadyForActivationFilter: false,
        mediumFilter: [
          { id: 1, value: 'ELECTRICITY' },
          { id: 2, value: 'WATER' }
        ],
        protocolFilter: [
          { id: 0, value: 'UNKNOWN' },
          { id: 1, value: 'DC450G3' }
        ],
        gridLayout:
          '%5B%7B%22colId%22%3A%22id%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A45%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22parent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22moduleId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A142%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22meterId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22firmware%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22timeOfUseId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id5%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22childInfo%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22breakerState%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
      },
      {
        id: 2,
        name: 'My saved filter 2',
        vendorsFilter: [{ id: 1, value: 'Vendor 1' }],
        statusesFilter: [
          { id: 1, value: 'Active' },
          { id: 2, value: 'Inactive' }
        ],
        readStatusFilter: {
          operation: { id: '', value: '' },
          value1: 0,
          value2: null
        },
        tagsFilter: [
          { id: 3, value: 'tag 3' },
          { id: 1, value: 'tag 1' }
        ],
        appFirmwareFilter: [{ id: 1, value: 'frmware 1' }],
        breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
        ciiStateFilter: [{ id: 1, value: 'cii state 1' }],
        showOptionFilter: [{ id: 1, value: `With template` }],
        showMeterUnitsWithoutTemplateFilter: true,
        showOnlyMeterUnitsWithMBusInfoFilter: true,
        showOnlyImageReadyForActivationFilter: false,
        mediumFilter: [
          { id: 1, value: 'ELECTRICITY' },
          { id: 2, value: 'WATER' }
        ],
        protocolFilter: [
          { id: 0, value: 'UNKNOWN' },
          { id: 1, value: 'DC450G3' }
        ],
        gridLayout:
          '%5B%7B%22colId%22%3A%22id%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A45%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22parent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22moduleId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A142%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22meterId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22firmware%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22timeOfUseId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id5%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22childInfo%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22breakerState%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
      },
      {
        id: 3,
        name: 'My saved filter 3',
        vendorsFilter: [{ id: 2, value: 'Vendor 2' }],
        statusesFilter: [{ id: 2, value: 'Inactive' }],
        readStatusFilter: {
          operation: { id: 'Less Than', value: 'Less Than' },
          value1: 30,
          value2: null
        },
        tagsFilter: [],
        appFirmwareFilter: [{ id: 1, value: 'frmware 1' }],
        breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
        ciiStateFilter: [{ id: 1, value: 'cii state 1' }],
        showOptionFilter: [{ id: 1, value: `With template` }],
        showMeterUnitsWithoutTemplateFilter: true,
        showOnlyMeterUnitsWithMBusInfoFilter: false,
        showOnlyImageReadyForActivationFilter: false,
        mediumFilter: [
          { id: 1, value: 'ELECTRICITY' },
          { id: 2, value: 'WATER' }
        ],
        protocolFilter: [
          { id: 0, value: 'UNKNOWN' },
          { id: 1, value: 'DC450G3' }
        ],
        gridLayout:
          '%5B%7B%22colId%22%3A%22id%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A45%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22parent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22moduleId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A142%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22meterId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22firmware%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22timeOfUseId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id5%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22childInfo%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22breakerState%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
      },
      {
        id: 4,
        name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        vendorsFilter: [{ id: 2, value: 'Vendor 2' }],
        statusesFilter: [],
        readStatusFilter: {
          operation: { id: 'Greater Than', value: 'Greater Than' },
          value1: 43,
          value2: null
        },
        tagsFilter: [],
        appFirmwareFilter: [{ id: 1, value: 'frmware 1' }],
        breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
        ciiStateFilter: [{ id: 1, value: 'cii state 1' }],
        showOptionFilter: [{ id: 2, value: `Without template` }],
        showMeterUnitsWithoutTemplateFilter: false,
        showOnlyMeterUnitsWithMBusInfoFilter: true,
        showOnlyImageReadyForActivationFilter: false,
        mediumFilter: [
          { id: 1, value: 'ELECTRICITY' },
          { id: 2, value: 'WATER' }
        ],
        protocolFilter: [
          { id: 0, value: 'UNKNOWN' },
          { id: 1, value: 'DC450G3' }
        ],
        gridLayout:
          '%5B%7B%22colId%22%3A%22id%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A45%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22parent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22moduleId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A142%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22meterId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22firmware%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22timeOfUseId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id5%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22childInfo%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22breakerState%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
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
    return new RegExp(`${meterUnits}/[0-9]+$` && `/${meterUnitsLayout}`).test(request.url) && request.method.endsWith('GET');
  }

  static canInterceptMutLayoutPost(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnits}/[0-9]+$` && `/${meterUnitsLayout}`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptMutLayoutPost(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: MeterUnitsLayout = {
      id: 5,
      name: 'My saved filter NEW',
      vendorsFilter: null,
      statusesFilter: [{ id: 3, value: 'Mouted' }],
      readStatusFilter: {
        operation: { id: 'Greater Than', value: 'Greater Than' },
        value1: 43,
        value2: null
      },
      tagsFilter: [
        { id: 3, value: 'tag 3' },
        { id: 1, value: 'tag 1' }
      ],
      appFirmwareFilter: [{ id: 1, value: 'frmware 1' }],
      breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
      ciiStateFilter: [{ id: 1, value: 'cii state 1' }],
      showOptionFilter: [{ id: 2, value: `Without template` }],
      showMeterUnitsWithoutTemplateFilter: false,
      showOnlyMeterUnitsWithMBusInfoFilter: true,
      showOnlyImageReadyForActivationFilter: false,
      mediumFilter: [
        { id: 1, value: 'ELECTRICITY' },
        { id: 2, value: 'WATER' }
      ],
      protocolFilter: [
        { id: 0, value: 'UNKNOWN' },
        { id: 1, value: 'DC450G3' }
      ],
      gridLayout:
        '%5B%7B%22colId%22%3A%22id%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A45%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22parent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22moduleId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22meterId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22firmware%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22timeOfUseId%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id5%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22childInfo%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22breakerState%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A118%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
    };

    return of(
      new HttpResponse({
        status: 201,
        body: data
      })
    );
  }

  static canInterceptMutLayoutPut(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnits}/[0-9]+$` && `/${meterUnitsLayout}/[0-9]+$`).test(request.url) && request.method.endsWith('PUT');
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
    return new RegExp(`${meterUnits}/[0-9]+$` && `/${meterUnitsLayout}/[0-9]+$`).test(request.url) && request.method.endsWith('DELETE');
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
