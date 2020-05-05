import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { meterUnitRegisters, scheduledJobs } from 'src/app/core/repository/consts/data-concentrator-units.const';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { ScheduledJobsList } from 'src/app/core/repository/interfaces/scheduled-jobs/scheduled-jobs-list.interface';

@Injectable()
export class ScheduledJobsInterceptor {
  constructor() {}

  static interceptScheduledJobsList(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body: ScheduledJobsList[] = [
      {
        id: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        type: 'Reading',
        description: 'Daily read of 15 min energy (A+)',
        nextRun: 'In 15 minutes',
        owner: 'Jan Benedičič'
      },
      {
        id: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b00',
        type: 'FW Upgrade',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 30 minutes',
        owner: 'Miha Galičič'
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe54',
        type: 'Reading',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 18 hours',
        owner: 'Jan Benedičič'
      },
      {
        id: 'c129f32f-33f8-4917-a190-53dfe388cc6d',
        type: 'FW Upgrade',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 1 day',
        owner: 'Miha Galičič'
      },
      {
        id: '5f128531-0bce-46f9-b8df-264d8a3945fb',
        type: 'Reading',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 1 day',
        owner: 'Jan Benedičič'
      },
      {
        id: '2eee0a94-cb09-4334-b36f-796ef0e08983',
        type: 'FW Upgrade',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 3 days',
        owner: 'Miha Galičič'
      },
      {
        id: '6f3c7dc9-784e-4d8f-b6dc-913f116e94a6',
        type: 'Reading',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 5 days',
        owner: 'Jan Benedičič'
      },
      {
        id: '845d8f84-705a-44bd-a5e1-e27cb705ecfc',
        type: 'FW Upgrade',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 7 days',
        owner: 'Miha Galičič'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }

  static canInterceptScheduledJobsList(request: HttpRequest<any>): boolean {
    return new RegExp(scheduledJobs).test(request.url) && request.method.endsWith('GET');
  }
}
