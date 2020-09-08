import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';
import { schedulerJobsListByJobId } from 'src/app/core/repository/consts/jobs.const';

@Injectable()
export class AutoTemplatesReadingJobsListInterceptor {
  constructor() {}

  static interceptAutoTemplatesReadingJobsList(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    console.log('2222222222222222222222222222222222222222222222222222222222222');
    const body: SchedulerJobsList[] = [
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
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }

  static canInterceptAutoTemplatesReadingJobsList(request: HttpRequest<any>): boolean {
    console.log('ena ena');
    console.log(request.url);
    return new RegExp(`${schedulerJobsListByJobId}$`).test(request.url) && request.method.endsWith('POST');
  }
}
