import { alarmingAlarms } from './../../../app/core/repository/consts/alarms.const';
import { IAlarmsList } from './../../../app/core/repository/interfaces/alarming/alarms-list.interface';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';

@Injectable()
export class AlarmingInterceptor {
  constructor() {}

  static interceptGetAlarmsList(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: IAlarmsList[] = [
      {
        alarmId: '6997F403-23D0-437C-372A-08D8B8782BCB',
        deviceId: '2A14D2B3-2F7F-4E9A-9F33-B26DA1021BD4',
        alarmTimestamp: '2021-01-15T00:00:00+02:00',
        eventId: 1,
        severityId: 0,
        severity: 'HIGH',
        sourceId: '12345678',
        sourceTypeId: 1,
        sourceType: 'METER',
        protocolId: 2,
        protocol: 'DLMS',
        description: 'Cover opened',
        manufacturer: 'LGZ'
      },
      {
        alarmId: '1D47A5BC-ED65-4A4A-372B-08D8B8782BCB',
        deviceId: '2A14D2B3-2F7F-4E9A-9F33-B26DA1021BD4',
        alarmTimestamp: '2021-01-15T00:00:00+02:00',
        eventId: 64,
        severityId: 1,
        severity: 'MEDIUM',
        sourceId: '12345679',
        sourceTypeId: 1,
        sourceType: 'METER',
        protocolId: 2,
        protocol: 'DLMS',
        description: 'The meter fell off the wall',
        manufacturer: 'ISK'
      }
    ];

    let skip = 0;
    let take = 0;
    let sortColId = '';
    let sortedAlarms = []; // data;
    let searched = data;
    if (request.body) {
      const params = request.body as GridRequestParams;
      if (params.searchModel && params.searchModel.length > 0) {
        searched = searchById(data, params.searchModel[0].value);
      }

      skip = params.startRow;
      take = params.endRow;

      sortedAlarms = searched;
      if (params.sortModel) {
        if (params.sortModel.length > 0) {
          params.sortModel.forEach((element) => {
            sortColId = element.colId;

            if (element.sort === 'desc') {
              sortedAlarms = _.sortBy(searched, sortColId).reverse();
            } else {
              sortedAlarms = _.sortBy(searched, sortColId);
            }
          });
        }
      }
    }

    const body: GridResponse<SchedulerJobsList> = {
      data: sortedAlarms.slice(skip, take), // sortedUsers.slice(request.body.startRow, request.body.endRow),
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

  static canInterceptGetAlarmsList(request: HttpRequest<any>): boolean {
    return new RegExp(`${alarmingAlarms}$`).test(request.url) && request.method.endsWith('POST');
  }
}

function searchById(companies, filter) {
  let result;
  if (typeof filter === 'undefined' || !filter || filter.length === 0) {
    result = companies;
  } else {
    result = _.filter(companies, (c) => {
      const cProperties = _.keys(c);
      _.pull(cProperties, 'id');
      return _.find(cProperties, (property) => {
        if (c[property]) {
          return _.includes(_.lowerCase(c[property]), _.lowerCase(filter));
        }
      });
    });
  }
  return result;
}
