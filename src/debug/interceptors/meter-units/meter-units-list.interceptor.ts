import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/gris-request-params.interface';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { dataConcentratorUnits } from 'src/app/core/repository/consts/data-concentrator-units.const';
import { MeterUnitsList } from 'src/app/core/repository/interfaces/meter-units/meter-units-list.interface';
import { meterUnits } from 'src/app/core/repository/consts/meter-units.const';

@Injectable()
export class MeterUnitsListInterceptor {
  constructor() {}

  static interceptMeterUnitsList(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    console.log(request.body);
    let skip = 0;
    let take = 0;
    let sortColId = '';
    let sortedUsers = []; // data;
    let searched = data;
    if (request.body) {
      const params = request.body as GridRequestParams;
      if (params.searchModel && params.searchModel.length > 0) {
        searched = searchById(data, params.searchModel[0].value);
      }

      skip = params.startRow;
      take = params.endRow;

      if (params.sortModel) {
        params.sortModel.forEach(element => {
          sortColId = element.colId;

          if (element.sort === 'desc') {
            sortedUsers = _.sortBy(searched, sortColId).reverse();
          } else {
            sortedUsers = _.sortBy(searched, sortColId);
          }
        });
      }
    }

    const body: GridResponse<MeterUnitsList> = {
      data: sortedUsers.slice(skip, take), // sortedUsers.slice(request.body.startRow, request.body.endRow),
      totalCount: searched.length,
      summary: '',
      groupCount: 0
    };
    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }

  static canInterceptMeterUnitsList(request: HttpRequest<any>): boolean {
    return new RegExp(meterUnits).test(request.url) && request.method.endsWith('POST');
  }
}

function searchById(companies, filter) {
  let result;
  if (typeof filter === 'undefined' || filter.length == 0) {
    result = companies;
  } else {
    result = _.filter(companies, c => {
      const cProperties = _.keys(c);
      _.pull(cProperties, 'id');
      return _.find(cProperties, property => {
        if (c[property]) {
          return _.includes(_.lowerCase(c[property]), _.lowerCase(filter));
        }
      });
    });
  }
  return result;
}

const data: MeterUnitsList[] = [
  {
    id: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
    status: 'Active',
    nextRead: null,
    name: 'Cubis PLC temp 520',
    readStatusDate: '2020-01-03T05:32:32',
    readStatusColor: 'alarm',
    vendor: 'Landis+Gy',
    tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8', 'tag 05', 'tag 572'],
    breakerState: 'on',
    childInfo: 12345,
    firmware: 'FM-123',
    id5: 'ID-12345',
    meterId: '123456',
    moduleId: '22222',
    parent: '77777',
    timeOfUseId: '5555',
    jobStatus: 'Running'
  },
  {
    id: 'ebeacc9d-744c-4a88-bb9c-625216ab99b9',
    status: 'Active',
    nextRead: '2020-03-03T15:35:29',
    name: 'Cubis PLC temp 423',
    readStatusDate: '2020-04-30T15:00:01',
    readStatusColor: 'ok',
    vendor: 'Landis+Gy',
    tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8'],
    breakerState: 'off',
    childInfo: 12345,
    firmware: 'FM-223',
    id5: 'ID-12345',
    meterId: '1234456',
    moduleId: '22252',
    parent: '774777',
    timeOfUseId: '55455',
    jobStatus: 'Running'
  },
  {
    id: '22cfeaae-463a-4055-8632-a6818ba77d81',
    status: 'Mouted',
    nextRead: '2020-05-06T11:02:50',
    name: 'Cubis PLC temp 753',
    readStatusDate: '2020-05-10T01:04:01',
    readStatusColor: 'ok',
    vendor: 'Landis+Gy',
    tags: ['tag 8', 'tag 05', 'tag 572'],
    breakerState: null,
    childInfo: 12345,
    firmware: 'FM-223',
    id5: 'ID-12345',
    meterId: '1233456',
    moduleId: '222522',
    parent: '774777',
    timeOfUseId: '53555',
    jobStatus: 'Running'
  },
  {
    id: '141c94ca-1838-42b5-8c8a-96c5e07cc155',
    status: 'Active',
    nextRead: '2020-03-29T17:39:41',
    name: 'Cubis PLC temp 844',
    readStatusDate: '2020-05-10T09:34:32',
    readStatusColor: 'warning',
    vendor: 'Landis+Gy',
    tags: ['tag 31', 'tag 572'],
    breakerState: 'on',
    childInfo: 12345,
    firmware: 'FM-324',
    id5: 'ID-12345',
    meterId: '1234456',
    moduleId: '225222',
    parent: '777677',
    timeOfUseId: '55455',
    jobStatus: 'Success'
  },
  {
    id: 'a8c35256-7960-4d0d-b4af-fdb2045378eb',
    status: 'Active',
    nextRead: null,
    name: 'Cubis PLC temp 344',
    readStatusDate: '2020-05-05T11:04:03',
    readStatusColor: 'warning',
    vendor: 'Landis+Gy',
    tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8', 'tag 05', 'tag 572'],
    breakerState: 'off',
    childInfo: 12345,
    firmware: 'FM-123',
    id5: 'ID-12345',
    meterId: '1232456',
    moduleId: '222522',
    parent: '776777',
    timeOfUseId: '5575',
    jobStatus: 'Success'
  },
  {
    id: 'de32daef-4766-4afc-aa5f-bba5822bf9b0',
    status: 'Active',
    nextRead: null,
    name: 'PLC dat 221',
    readStatusDate: '2020-02-17T04:26:37',
    readStatusColor: 'alarm',
    vendor: 'Iskra',
    breakerState: 'on',
    childInfo: 5,
    firmware: 'Firm Ware - 5',
    id5: '626516631021',
    meterId: 'M-Id694888174124',
    moduleId: 'Module-Id752225899452',
    parent: 'Parent - 2',
    timeOfUseId: 'TimeOfUse - 17',
    tags: null,
    jobStatus: 'Success'
  },
  {
    id: 'e4694732-a282-477c-9c47-79ca08f64911',
    status: 'Mouted',
    nextRead: null,
    name: 'PLC dat 915',
    readStatusDate: '2020-02-17T05:26:37',
    readStatusColor: 'alarm',
    vendor: 'Iskra',
    breakerState: 'off',
    childInfo: 3,
    firmware: 'Firm Ware - 1',
    id5: '977862534617',
    meterId: 'M-Id619256975638',
    moduleId: 'Module-Id932597197700',
    parent: 'Parent - 31',
    timeOfUseId: 'TimeOfUse - 21',
    tags: null,
    jobStatus: 'Failed'
  },
  {
    id: '4db50891-45dc-4910-bc8e-1d1c15862a68',
    status: 'Active',
    nextRead: '2020-04-11T23:40:46',
    name: 'PLC dat 387',
    readStatusDate: '2020-03-31T17:08:00',
    readStatusColor: 'alarm',
    vendor: 'Landis+Gy',
    breakerState: 'on',
    childInfo: 1,
    firmware: 'Firm Ware - 3',
    id5: '991196390689',
    meterId: 'M-Id282050186794',
    moduleId: 'Module-Id877053746619',
    parent: 'Parent - 36',
    timeOfUseId: 'TimeOfUse - 4',
    tags: ['tag1', 'tag3', 'tag5'],
    jobStatus: 'Pending'
  },
  {
    id: '7f7e9055-ad99-479f-956f-903022e1cccd',
    status: 'Warehouse',
    nextRead: null,
    name: 'PLC dat 626',
    readStatusDate: '2020-05-09T12:02:33',
    readStatusColor: 'ok',
    vendor: 'Landis+Gy',
    breakerState: 'off',
    childInfo: 4,
    firmware: 'Firm Ware - 1',
    id5: '645461952652',
    meterId: 'M-Id975014015573',
    moduleId: 'Module-Id772155035260',
    parent: 'Parent - 33',
    timeOfUseId: 'TimeOfUse - 15',
    tags: ['tag31', 'tag32'],
    jobStatus: 'Failed'
  },
  {
    id: 'f8eb8b9f-bd39-406c-8ebc-c2659ab48246',
    status: 'Warehouse',
    nextRead: null,
    name: 'PLC dat 623',
    readStatusDate: '2020-05-11T12:14:00',
    readStatusColor: 'ok',
    vendor: 'Iskra',
    breakerState: 'off',
    childInfo: 5,
    firmware: 'Firm Ware - 1',
    id5: '372969078122',
    meterId: 'M-Id874231899211',
    moduleId: 'Module-Id267729073259',
    parent: 'Parent - 13',
    timeOfUseId: 'TimeOfUse - 10',
    tags: ['tag1', 'tag3', 'tag5'],
    jobStatus: 'Pending'
  },
  {
    id: '74cc061f-69f4-48e3-8fb6-1a1e88cdd3d3',
    status: 'Warehouse',
    nextRead: null,
    name: 'PLC dat 345',
    readStatusDate: '2020-05-03T00:00:00',
    readStatusColor: 'ok',
    vendor: 'Iskra',
    breakerState: 'on',
    childInfo: 4,
    firmware: 'Firm Ware - 3',
    id5: '878565520965',
    meterId: 'M-Id141708173203',
    moduleId: 'Module-Id407426421248',
    parent: 'Parent - 30',
    timeOfUseId: 'TimeOfUse - 17',
    tags: null,
    jobStatus: 'Failed'
  },
  {
    id: 'bd50a59a-e791-470b-b328-7e3dc9b0a5df',
    status: 'Warehouse',
    nextRead: null,
    name: 'PLC dat 954',
    readStatusDate: '2019-12-14T03:12:11',
    readStatusColor: 'alarm',
    vendor: 'Iskra',
    breakerState: 'on',
    childInfo: 1,
    firmware: 'Firm Ware - 0',
    id5: '297789917782',
    meterId: 'M-Id464071230967',
    moduleId: 'Module-Id661863757617',
    parent: 'Parent - 29',
    timeOfUseId: 'TimeOfUse - 12',
    tags: ['tag1', 'tag3', 'tag5'],
    jobStatus: 'Failed'
  },
  {
    id: '18d2fcdc-0809-4fb3-8b68-bbe35262b344',
    status: 'Active',
    nextRead: '2020-05-06T13:52:33',
    name: 'PLC dat 233',
    readStatusDate: '2019-12-20T20:20:20',
    readStatusColor: 'alarm',
    vendor: 'Landis+Gy',
    breakerState: 'off',
    childInfo: 1,
    firmware: 'Firm Ware - 5',
    id5: '833452712479',
    meterId: 'M-Id995410774000',
    moduleId: 'Module-Id432607105778',
    parent: 'Parent - 12',
    timeOfUseId: 'TimeOfUse - 33',
    tags: null,
    jobStatus: null
  },
  {
    id: 'f790398c-5dc3-4511-ba8b-4b281b78fc49',
    status: 'Warehouse',
    nextRead: '2020-05-15T19:38:31',
    name: 'PLC dat 659',
    readStatusDate: '2019-10-02T05:09:23',
    readStatusColor: 'alarm',
    vendor: 'Iskra',
    breakerState: 'off',
    childInfo: 0,
    firmware: 'Firm Ware - 5',
    id5: '770053695430',
    meterId: 'M-Id578229577695',
    moduleId: 'Module-Id127686024141',
    parent: 'Parent - 44',
    timeOfUseId: 'TimeOfUse - 13',
    tags: ['tag31', 'tag32'],
    jobStatus: null
  },
  {
    id: '26dd5e0a-4342-496a-93c7-a0ee8ac94a33',
    status: 'Mouted',
    nextRead: '2020-02-25T10:01:04',
    name: 'PLC dat 519',
    readStatusDate: '2019-09-18T19:18:59',
    readStatusColor: 'alarm',
    vendor: 'Landis+Gy',
    breakerState: 'on',
    childInfo: 0,
    firmware: 'Firm Ware - 1',
    id5: '591174417896',
    meterId: 'M-Id616485091080',
    moduleId: 'Module-Id469940096397',
    parent: 'Parent - 24',
    timeOfUseId: 'TimeOfUse - 26',
    tags: null,
    jobStatus: null
  },
  {
    id: 'bc8b49f4-f3b3-4975-8a6e-05134d1cd350',
    status: 'Mouted',
    nextRead: null,
    name: 'PLC dat 656',
    readStatusDate: '2020-01-18T19:18:59',
    readStatusColor: 'alarm',
    vendor: 'Landis+Gy',
    breakerState: 'on',
    childInfo: 4,
    firmware: 'Firm Ware - 3',
    id5: '335885084936',
    meterId: 'M-Id591841760319',
    moduleId: 'Module-Id693512246543',
    parent: 'Parent - 48',
    timeOfUseId: 'TimeOfUse - 27',
    tags: ['tag1', 'tag3', 'tag5'],
    jobStatus: 'Running'
  },
  {
    id: '9b56c3b3-0ba2-4103-ac77-c8732ffb3472',
    status: 'Warehouse',
    nextRead: '2020-03-05T08:33:05',
    name: 'PLC dat 773',
    readStatusDate: '2020-05-05T03:29:19',
    readStatusColor: 'ok',
    vendor: 'Iskra',
    breakerState: 'off',
    childInfo: 2,
    firmware: 'Firm Ware - 4',
    id5: '755019885413',
    meterId: 'M-Id704325148357',
    moduleId: 'Module-Id843682967652',
    parent: 'Parent - 30',
    timeOfUseId: 'TimeOfUse - 3',
    tags: null,
    jobStatus: 'Failed'
  },
  {
    id: '5e8639d1-9c3d-46ea-bbdd-4770baefafbf',
    status: 'Active',
    nextRead: null,
    name: 'PLC dat 284',
    readStatusDate: '2020-05-05T03:21:19',
    readStatusColor: 'ok',
    vendor: 'Iskra',
    breakerState: 'off',
    childInfo: 4,
    firmware: 'Firm Ware - 3',
    id5: '778012660138',
    meterId: 'M-Id420898080004',
    moduleId: 'Module-Id982525535419',
    parent: 'Parent - 34',
    timeOfUseId: 'TimeOfUse - 32',
    tags: null,
    jobStatus: 'Success'
  },
  {
    id: 'r42234-9c3d-46ea-bbdd-4770baefafbf',
    status: 'Mouted',
    nextRead: null,
    name: 'PLC dat 2824',
    readStatusDate: '2020-04-02T12:33:12',
    readStatusColor: 'warning',
    vendor: 'Iskra',
    breakerState: 'off',
    childInfo: 14,
    firmware: 'Firm Ware - 3',
    id5: '778012660138',
    meterId: 'M-Id420898080004',
    moduleId: 'Module-Id98332525535419',
    parent: 'Parent - 134',
    timeOfUseId: 'TimeOfUse - 322',
    tags: null,
    jobStatus: 'Pending'
  },
  {
    id: '90976-9c3d-46ea-bbdd-4770baefafbf',
    status: 'Active',
    nextRead: null,
    name: 'PLC dat 22384',
    readStatusDate: '2020-01-24T04:31:00',
    readStatusColor: 'alarm',
    vendor: 'Iskra',
    breakerState: 'off',
    childInfo: 3,
    firmware: 'Firm Ware - 312',
    id5: '3q233112',
    meterId: 'M-Id420898080004',
    moduleId: 'Module-Id98332525535419',
    parent: 'Parent - 331',
    timeOfUseId: 'TimeOfUse - 2123',
    tags: null,
    jobStatus: 'Pending'
  },
  {
    id: '90976-9c3d-46ea-642234-4770baefafbf',
    status: 'Active',
    nextRead: null,
    name: 'PLC dat 543',
    readStatusDate: '2020-05-10T10:00:03',
    readStatusColor: 'ok',
    vendor: 'Iskra',
    breakerState: 'off',
    childInfo: 3,
    firmware: 'Firm Ware - 312',
    id5: '3q233112',
    meterId: 'M-Id420898080004',
    moduleId: 'Module-Id98332525535419',
    parent: 'Parent - 12',
    timeOfUseId: 'TimeOfUse - 22',
    tags: null,
    jobStatus: null
  }
];
