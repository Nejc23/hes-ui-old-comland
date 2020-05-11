import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import * as _ from 'lodash';
import { meterUnitRegisters, activeJobs } from 'src/app/core/repository/consts/data-concentrator-units.const';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { ActiveJobsList } from 'src/app/core/repository/interfaces/jobs/active-jobs-list.interface';

@Injectable()
export class ActiveJobsInterceptor {
  constructor() {}

  static interceptActiveJobs(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body: ActiveJobsList[] = [
      {
        id: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        type: 'FW Upgrade',
        running: true,
        triggerInfo: 'Tiggered by Jan Benedicic less then 1h ago',
        timeInfo: 'Duration: 02m 45s'
      },
      {
        id: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b00',
        type: 'Reading configuration upload',
        running: false,
        triggerInfo: 'Tiggered by Jan Benedicic less then 1h ago',
        timeInfo: 'In queue: 01m 10s'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }

  static canInterceptActiveJobs(request: HttpRequest<any>): boolean {
    return new RegExp(activeJobs).test(request.url) && request.method.endsWith('GET');
  }
}
