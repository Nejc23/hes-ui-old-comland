import { DataConcentratorUnitsComponent } from './../../../app/features/data-concentrator-units/components/data-concentrator-units.component';
import { addNewScheduleDevice, schedulerActiveJobs } from './../../../app/core/repository/consts/jobs.const';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { schedulerJobsList, schedulerJobs } from 'src/app/core/repository/consts/jobs.const';
import { SchedulerJob } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
import { ScheduleDevice } from 'src/app/core/repository/interfaces/jobs/schedule-device.interface';

@Injectable()
export class SchedulerJobsInterceptor {
  constructor() {}

  static interceptSchedulerJobsList(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: SchedulerJobsList[] = [
      {
        id: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Daily read of 15 min energy (A+)',
        nextRun: '2020-08-25T15:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 138
      },
      {
        id: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b00',
        active: true,
        type: 'Discovery',
        actionType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2021-07-26T05:45:45+00:00',
        owner: 'Miha Galičič',
        deviceCount: 15
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe54',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2022-07-28T12:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 2
      },
      {
        id: 'c129f32f-33f8-4917-a190-53dfe388cc6d',
        active: true,
        type: 'Discovery',
        actionType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2021-08-28T12:45:45+00:00',
        owner: 'Miha Galičič',
        deviceCount: 0
      },
      {
        id: '5f128531-0bce-46f9-b8df-264d8a3945fb',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2023-09-28T18:05:05+02:00',
        owner: 'Jan Benedičič',
        deviceCount: 1
      },
      {
        id: '2eee0a94-cb09-4334-b36f-796ef0e08983',
        active: false,
        type: 'Discovery',
        actionType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2023-07-28T15:08:05+02:00',
        owner: 'Miha Galičič',
        deviceCount: 2
      },
      {
        id: '6f3c7dc9-784e-4d8f-b6dc-913f116e94a6',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2023-11-18T11:19:25+01:00',
        owner: 'Jan Benedičič',
        deviceCount: 0
      },
      {
        id: '845d8f84-705a-44bd-a5e1-e27cb705ecfc',
        active: false,
        type: 'Discovery',
        actionType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2025-11-18T09:17:25+01:00',
        owner: 'Miha Galičič',
        deviceCount: 0
      }
    ];

    let skip = 0;
    let take = 0;
    let sortColId = '';
    let sortedJobs = []; // data;
    let searched = data;
    if (request.body) {
      const params = request.body as GridRequestParams;
      if (params.searchModel && params.searchModel.length > 0) {
        searched = searchById(data, params.searchModel[0].value);
      }

      skip = params.startRow;
      take = params.endRow;

      if (params.sortModel) {
        if (params.sortModel.length > 0) {
          params.sortModel.forEach(element => {
            sortColId = element.colId;

            if (element.sort === 'desc') {
              sortedJobs = _.sortBy(searched, sortColId).reverse();
            } else {
              sortedJobs = _.sortBy(searched, sortColId);
            }
          });
        } else {
          sortedJobs = searched;
        }
      }
    }

    const body: GridResponse<SchedulerJobsList> = {
      data: sortedJobs.slice(skip, take), // sortedUsers.slice(request.body.startRow, request.body.endRow),
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

  static canInterceptSchedulerJobsList(request: HttpRequest<any>): boolean {
    return new RegExp(`${schedulerJobsList}$`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptSchedulerActiveJobsList(request: HttpRequest<any>): Observable<HttpEvent<SchedulerJobsList[]>> {
    const data: SchedulerJobsList[] = [
      {
        id: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Daily read of 15 min energy (A+)',
        nextRun: '2020-08-25T15:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 25
      },
      {
        id: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b00',
        active: true,
        type: 'Discovery',
        actionType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2021-07-26T05:45:45+00:00',
        owner: 'Miha Galičič',
        deviceCount: 355
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe54',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2022-07-28T12:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 15
      },
      {
        id: 'c129f32f-33f8-4917-a190-53dfe388cc6d',
        active: true,
        type: 'Discovery',
        actionType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2021-08-28T12:45:45+00:00',
        owner: 'Miha Galičič',
        deviceCount: 5
      },
      {
        id: '5f128531-0bce-46f9-b8df-264d8a3945fb',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2023-09-28T18:05:05+02:00',
        owner: 'Jan Benedičič',
        deviceCount: 5
      },
      {
        id: '6f3c7dc9-784e-4d8f-b6dc-913f116e94a6',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2020-07-18T09:17:25+01:00',
        owner: 'Jan Benedičič',
        deviceCount: 5
      },
      {
        id: '06130d62-f67c-41a2-98f7-ef521db2cee7',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Daily read of 15 min energy (B+)',
        nextRun: '2021-03-01T15:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 5
      },
      {
        id: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b01',
        active: true,
        type: 'Discovery',
        actionType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2020-05-11T05:45:45+00:00',
        owner: 'Miha Galičič',
        deviceCount: 523
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe55',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2019-03-05T12:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 53
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe56',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2020-04-28T12:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 5
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptSchedulerActiveJobsList(request: HttpRequest<any>): boolean {
    return new RegExp(schedulerActiveJobs).test(request.url) && request.method.endsWith('GET');
  }

  static interceptSchedulerJobs(): Observable<HttpEvent<any>> {
    const data: SchedulerJob = {
      readOptions: 1,
      nHours: null,
      nMinutes: null,
      weekDays: [],
      monthDays: [],
      registers: [],
      description: 'desc 4444',
      iec: true,
      enable: true,
      dateTime: '2020-03-01T00:00:00+01:00',
      usePointer: true,
      intervalRange: 2,
      timeUnit: 1,
      actionType: 1,
      bulkActionsRequestParam: {
        id: ['AC9D7C4F-08C7-46A0-930B-61A0B1FE678D', 'de32daef-4766-4afc-aa5f-bba5822bf9b0']
      }
    };

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }
  static canInterceptSchedulerJobs(request: HttpRequest<any>): boolean {
    return new RegExp(`${schedulerJobs}/`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptAddNewScheduleDevice(request: HttpRequest<ScheduleDevice>): Observable<HttpEvent<ScheduleDevice>> {
    const data: ScheduleDevice = {
      scheduleDeviceId: 'af9c4a3e-8080-4e09-ae44-f1928967d8eb',
      scheduleId: request.body.scheduleId,
      deviceId: request.body.deviceId,
      readingId: request.body.readingId,
      templateId: request.body.templateId,
      registerGroupName: request.body.registerGroupName,
      registerGroupType: request.body.registerGroupType
    };

    return of(
      new HttpResponse({
        status: 201,
        body: data
      })
    );
  }

  static canInterceptAddNewScheduleDevice(request: HttpRequest<any>): boolean {
    return new RegExp(addNewScheduleDevice).test(request.url);
  }
}

function searchById(companies, filter) {
  let result;
  if (typeof filter === 'undefined' || !filter || filter.length === 0) {
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
