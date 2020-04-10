import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import { meterUnitsScheduler } from 'src/app/core/repository/consts/meter-units.const';
import { MeterUnitsReadSchedule } from 'src/app/core/repository/interfaces/meter-units/meter-units-read-schedule.interface';

@Injectable()
export class MeterUnitsSchedulerInterceptor {
  constructor() {}

  static canInterceptMutLayoutPost(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitsScheduler}`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptMutLayoutPost(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: MeterUnitsReadSchedule = {
      readOptions: 5,
      nMinutes: 0,
      nHours: 0,
      time: {
        hour: 13,
        minute: 18,
        second: 0
      },
      weekDays: [],
      monthDays: [1, 7, 31],
      registers: [1, 4, 5],
      bulkActionsRequestParam: {
        id: [262, 146, 304],
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
}
