import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/gris-request-params.interface';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { dataConcentratorUnits } from 'src/app/core/repository/consts/data-concentrator-units.const';
import { MeterUnitsList } from 'src/app/core/repository/interfaces/meter-units/meter-units-list.interface';

@Injectable()
export class MeterUnitsListInterceptor {
  constructor() {}

  static interceptMeterUnitsList(request: HttpRequest<any>): Observable<HttpEvent<any>> {
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
    return new RegExp(dataConcentratorUnits).test(request.url) && request.method.endsWith('POST');
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
    id: 11111,
    status: 'Active',
    nextRead: null,
    name: 'Cubis PLC temp 520',
    readStatusPercent: 93.5,
    vendor: 'Landis+Gy',
    tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8', 'tag 05', 'tag 572'],
    breakerState: true,
    childInfo: 12345,
    firmware: 'FM-123',
    id5: 'ID-12345',
    meterId: '123456',
    moduleId: '22222',
    parent: '77777',
    timeOfUseId: '5555'
  },
  {
    id: 22222,
    status: 'Active',
    nextRead: '2020-03-03T15:35:29',
    name: 'Cubis PLC temp 423',
    readStatusPercent: 13.5,
    vendor: 'Landis+Gy',
    tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8'],
    breakerState: true,
    childInfo: 12345,
    firmware: 'FM-223',
    id5: 'ID-12345',
    meterId: '1234456',
    moduleId: '22252',
    parent: '774777',
    timeOfUseId: '55455'
  },
  {
    id: 33333,
    status: 'Mouted',
    nextRead: '2020-05-06T11:02:50',
    name: 'Cubis PLC temp 753',
    readStatusPercent: 33.5,
    vendor: 'Landis+Gy',
    tags: ['tag 8', 'tag 05', 'tag 572'],
    breakerState: true,
    childInfo: 12345,
    firmware: 'FM-223',
    id5: 'ID-12345',
    meterId: '1233456',
    moduleId: '222522',
    parent: '774777',
    timeOfUseId: '53555'
  },
  {
    id: 44444,
    status: 'Active',
    nextRead: '2020-03-29T17:39:41',
    name: 'Cubis PLC temp 844',
    readStatusPercent: 53.5,
    vendor: 'Landis+Gy',
    tags: ['tag 31', 'tag 572'],
    breakerState: true,
    childInfo: 12345,
    firmware: 'FM-324',
    id5: 'ID-12345',
    meterId: '1234456',
    moduleId: '225222',
    parent: '777677',
    timeOfUseId: '55455'
  },
  {
    id: 55555,
    status: 'Active',
    nextRead: null,
    name: 'Cubis PLC temp 344',
    readStatusPercent: 73.5,
    vendor: 'Landis+Gy',
    tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8', 'tag 05', 'tag 572'],
    breakerState: true,
    childInfo: 12345,
    firmware: 'FM-123',
    id5: 'ID-12345',
    meterId: '1232456',
    moduleId: '222522',
    parent: '776777',
    timeOfUseId: '5575'
  }
];
