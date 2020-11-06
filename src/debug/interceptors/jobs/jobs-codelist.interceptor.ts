import { CodelistExt } from 'src/app/shared/repository/interfaces/codelists/codelist-ext.interface';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { timeUnitCodes, schedulerJobs } from 'src/app/core/repository/consts/jobs.const';

@Injectable()
export class JobsCodelistInterceptor {
  constructor() {}

  static canInterceptTimeUnitCode(request: HttpRequest<any>): boolean {
    return new RegExp(timeUnitCodes).test(request.url);
  }

  static interceptTimeUnitCode(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 1,
        value: 'Minute'
      },
      {
        id: 2,
        value: 'Hour'
      },
      {
        id: 3,
        value: 'Day'
      },
      {
        id: 4,
        value: 'Month'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptJobsDiscoveryJobs(request: HttpRequest<any>): boolean {
    console.log('canInterceptJobsDiscoveryJobs', request);
    return new RegExp(`${schedulerJobs}\\?type=1&type=3`).test(request.url);
  }

  static interceptJobsDiscoveryJobs(): Observable<HttpEvent<any>> {
    const data: CodelistExt<string>[] = [
      {
        id: 'd8c8763d-4eff-4692-bdc5-58a05d54ed1b',
        value: 'PLC discovery job 1',
        nextRun: '2020-07-23T09:00:00+00:00'
      },
      {
        id: 'd8c8763d-4eff-4692-bdc5-58a05d54ed1c',
        value: 'PLC discovery job 2',
        nextRun: '2021-07-24T08:30:30+00:00'
      },
      {
        id: 'd8c8763d-4eff-4692-bdc5-58a05d54ed1d',
        value: 'PLC discovery job 3',
        nextRun: '2022-07-25T15:45:45+00:00'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }
}
