import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { schedulerJobs, schedulerJobsList } from 'src/app/core/repository/consts/jobs.const';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { DeviceJobs } from 'src/app/core/repository/interfaces/jobs/device-jobs.interface';
import { SchedulerJob } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';
import { deviceJobs, notificationJobs, schedulerActiveJobs } from './../../../app/core/repository/consts/jobs.const';

@Injectable()
export class SchedulerJobsInterceptor {
  constructor() {}

  static interceptSchedulerJobsList(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: SchedulerJobsList[] = [
      {
        id: '06130d62-f67c-41a2-98f7-ef521db2cee7',
        active: true,
        type: 'alarmNotification',
        jobType: 6,
        description: 'Alarm Notification Job',
        nextRun: '2020-08-25T15:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 0
      },
      {
        id: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        active: true,
        type: 'Reading',
        jobType: 2,
        description: 'Daily read of 15 min energy (A+)',
        nextRun: '2020-08-25T15:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 138
      },
      {
        id: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b00',
        active: true,
        type: 'Reading',
        jobType: 2,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2021-07-26T05:45:45+00:00',
        owner: 'Miha Galičič',
        deviceCount: 15
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe54',
        active: true,
        type: 'Reading',
        jobType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2022-07-28T12:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 2
      },
      {
        id: 'c129f32f-33f8-4917-a190-53dfe388cc6d',
        active: true,
        type: 'Discovery',
        jobType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2021-08-28T12:45:45+00:00',
        owner: 'Miha Galičič',
        deviceCount: 0
      },
      {
        id: '5f128531-0bce-46f9-b8df-264d8a3945fb',
        active: true,
        type: 'Reading',
        jobType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2023-09-28T18:05:05+02:00',
        owner: 'Jan Benedičič',
        deviceCount: 1
      },
      {
        id: '2eee0a94-cb09-4334-b36f-796ef0e08983',
        active: false,
        type: 'Discovery',
        jobType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2023-07-28T15:08:05+02:00',
        owner: 'Miha Galičič',
        deviceCount: 2
      },
      {
        id: '6f3c7dc9-784e-4d8f-b6dc-913f116e94a6',
        active: true,
        type: 'Reading',
        jobType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2023-11-18T11:19:25+01:00',
        owner: 'Jan Benedičič',
        deviceCount: 0
      },
      {
        id: '845d8f84-705a-44bd-a5e1-e27cb705ecfc',
        active: false,
        type: 'Discovery',
        jobType: 1,
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

      sortedJobs = searched;
      if (params.sortModel) {
        if (params.sortModel.length > 0) {
          params.sortModel.forEach((element) => {
            sortColId = element.colId;

            if (element.sort === 'desc') {
              sortedJobs = _.sortBy(searched, sortColId).reverse();
            } else {
              sortedJobs = _.sortBy(searched, sortColId);
            }
          });
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
        jobType: 4,
        description: 'Daily read of 15 min energy (A+)',
        nextRun: '2020-08-25T15:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 25
      },
      {
        id: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b00',
        active: true,
        type: 'Discovery',
        jobType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2021-07-26T05:45:45+00:00',
        owner: 'Miha Galičič',
        deviceCount: 355
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe54',
        active: true,
        type: 'Reading',
        jobType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2022-07-28T12:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 15
      },
      {
        id: 'c129f32f-33f8-4917-a190-53dfe388cc6d',
        active: true,
        type: 'Discovery',
        jobType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2021-08-28T12:45:45+00:00',
        owner: 'Miha Galičič',
        deviceCount: 5
      },
      {
        id: '5f128531-0bce-46f9-b8df-264d8a3945fb',
        active: true,
        type: 'Reading',
        jobType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2023-09-28T18:05:05+02:00',
        owner: 'Jan Benedičič',
        deviceCount: 5
      },
      {
        id: '6f3c7dc9-784e-4d8f-b6dc-913f116e94a6',
        active: true,
        type: 'Reading',
        jobType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2020-07-18T09:17:25+01:00',
        owner: 'Jan Benedičič',
        deviceCount: 5
      },
      {
        id: '06130d62-f67c-41a2-98f7-ef521db2cee7',
        active: true,
        type: 'Reading',
        jobType: 4,
        description: 'Daily read of 15 min energy (B+)',
        nextRun: '2021-03-01T15:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 5
      },
      {
        id: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b01',
        active: true,
        type: 'Discovery',
        jobType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2020-05-11T05:45:45+00:00',
        owner: 'Miha Galičič',
        deviceCount: 523
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe55',
        active: true,
        type: 'Reading',
        jobType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2019-03-05T12:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 53
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe56',
        active: true,
        type: 'Reading',
        jobType: 4,
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
      registers: [{ type: '1', name: 'property3' }],
      description: 'desc 4444',
      active: true,
      cronExpression: '0 1 */3 * * * *',
      jobType: '1',
      readingProperties: {
        usePointer: true,
        intervalRange: 2,
        timeUnit: 1,
        iecPushEnabled: false
      },
      devices: {
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

  static interceptAddNewDeviceJobs(request: HttpRequest<DeviceJobs>): Observable<HttpEvent<DeviceJobs>> {
    const data: DeviceJobs = {
      scheduleJobIds: ['af9c4a3e-8080-4e09-ae44-f1928967d8eb'],
      deviceId: request.body.deviceId
    };

    return of(
      new HttpResponse({
        status: 201,
        body: data
      })
    );
  }

  static canInterceptCreateNotificationJob(request: HttpRequest<any>): boolean {
    return new RegExp(notificationJobs).test(request.url) && request.method.endsWith('POST');
  }

  static interceptCreateNotificationJob(request: HttpRequest<SchedulerJob>): Observable<HttpEvent<SchedulerJob>> {
    const data: SchedulerJob = {
      jobType: 6,
      active: true,
      description: 'Notify alarms',
      cronExpression: '* * 0 * * ?',
      startAt: '2021-01-14T08:44:00+01:00',
      endAt: null,
      addresses: ['gregor@ePoint.si', 'jan@ePoint.si'],
      filter: {
        alarmIds: [64, 128, 42], // integer alarm identifiers
        severities: [1, 2, 3], // enum - TODO get endpoint for list of enum values
        protocols: [2, 3],
        manufacturers: [1, 2],
        sources: [2, 3] // enum - TODO get endpoint for list of enum values
      }
    };

    return of(
      new HttpResponse({
        status: 201,
        body: data
      })
    );
  }

  static canInterceptUpdateNotificationJob(request: HttpRequest<any>): boolean {
    return new RegExp(`${notificationJobs}/`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptUpdateNotificationJob(request: HttpRequest<SchedulerJob>): Observable<HttpEvent<SchedulerJob>> {
    const data: SchedulerJob = {
      jobType: 6,
      active: true,
      description: 'Notify alarms',
      cronExpression: '* * 0 * * ?',
      startAt: '2021-01-14T08:44:00+01:00',
      endAt: null,
      addresses: ['gregor@ePoint.si', 'jan@ePoint.si'],
      filter: {
        alarmIds: [64, 128, 42], // integer alarm identifiers
        severities: [1, 2, 3], // enum - TODO get endpoint for list of enum values
        protocols: [2, 3],
        manufacturers: [1, 2],
        sources: [2, 3] // enum - TODO get endpoint for list of enum values
      }
    };

    return of(
      new HttpResponse({
        status: 201,
        body: data
      })
    );
  }

  static canInterceptGetNotificationJob(request: HttpRequest<any>): boolean {
    return new RegExp(`${notificationJobs}`).test(request.url) && request.method.endsWith('GET');
  }

  static interceptGetNotificationJob(request: HttpRequest<SchedulerJob>): Observable<HttpEvent<SchedulerJob>> {
    const data: SchedulerJob = {
      jobType: 6,
      active: true,
      description: 'Notify alarms - Fake',
      cronExpression: '* * 1 * * ?',
      startAt: '2021-01-14T08:44:00+01:00',
      endAt: null,
      addresses: ['gregor@ePoint.si', 'jan@ePoint.si'],
      filter: {
        alarmIds: [128, 42, 64],
        manufacturers: ['lgz', 'isk'],
        protocols: ['aC750', 'dlms'],
        severities: ['medium', 3, 'high']
        // sources: ['concentrator', 'meter']
      }
    };

    return of(
      new HttpResponse({
        status: 201,
        body: data
      })
    );
  }

  static canInterceptAddNewDeviceJobs(request: HttpRequest<any>): boolean {
    return new RegExp(deviceJobs).test(request.url);
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
