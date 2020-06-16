import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { meterUnitsScheduler, deleteJob } from 'src/app/core/repository/consts/meter-units.const';
import { SchedulerJob } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
import { enableJob, executeJob } from 'src/app/core/repository/consts/jobs.const';

@Injectable()
export class MeterUnitsSchedulerInterceptor {
  constructor() {}

  static canInterceptMeterUnitSchedulerPost(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitsScheduler}`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptMeterUnitSchedulerPost(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: SchedulerJob = {
      readOptions: 5,
      nMinutes: 0,
      nHours: 0,
      weekDays: [],
      monthDays: [1, 7, 31],
      registers: ['guid-1', 'guid-4', 'guid-5'],
      dateTime: '2020-05-22 10:02',
      description: '',
      iec: false,
      enable: false,
      usePointer: false,
      intervalRange: 1440,
      timeUnit: 1,
      bulkActionsRequestParam: {
        id: ['9b837e2d-957d-49e2-8d1d-a2e4b8440b77', 'ebeacc9d-744c-4a88-bb9c-625216ab99b9', '22cfeaae-463a-4055-8632-a6818ba77d81'],
        filter: {
          statuses: [
            {
              id: 0,
              value: ''
            }
          ],
          tags: [
            {
              id: 0,
              value: ''
            }
          ],
          vendor: {
            id: 0,
            value: ''
          },
          readStatus: {
            operation: {
              id: '',
              value: ''
            },
            value1: 0,
            value2: null
          },
          firmware: [
            {
              id: 0,
              value: ''
            }
          ],
          breakerState: [
            {
              id: 0,
              value: ''
            }
          ],
          showChildInfoMBus: false,
          showDeleted: false
        }
      }
    };

    return of(
      new HttpResponse({
        status: 201,
        body: data
      })
    );
  }

  static canInterceptSchedulerJobDelete(request: HttpRequest<any>): boolean {
    return request.url.startsWith(`${meterUnitsScheduler}/${deleteJob}`) && request.method.endsWith('DELETE');
  }

  static interceptSchedulerJobDelete(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body = null;

    return of(
      new HttpResponse({
        status: 204,
        body
      })
    );
  }

  static canInterceptSchedulerJobExecute(request: HttpRequest<any>): boolean {
    return request.url.startsWith(`${meterUnitsScheduler}/${executeJob}`) && request.method.endsWith('PUT');
  }

  static interceptSchedulerJobExecute(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body = null;

    return of(
      new HttpResponse({
        status: 204,
        body
      })
    );
  }

  static canInterceptSchedulerJobEnable(request: HttpRequest<any>): boolean {
    return request.url.startsWith(`${enableJob}`) && request.url.endsWith('1') && request.method.endsWith('PUT');
  }

  static interceptSchedulerJobEnable(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body = null;

    return of(
      new HttpResponse({
        status: 204,
        body
      })
    );
  }

  static canInterceptSchedulerJobDisable(request: HttpRequest<any>): boolean {
    return request.url.startsWith(`${enableJob}`) && request.url.endsWith('0') && request.method.endsWith('PUT');
  }

  static interceptSchedulerJobDisable(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body = null;

    return of(
      new HttpResponse({
        status: 204,
        body
      })
    );
  }
}
