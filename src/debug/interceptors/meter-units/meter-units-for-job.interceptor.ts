import { meterUnitsForJob } from '../../../app/core/repository/consts/meter-units.const';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http';
import { ResponseMeterUnitsForJob } from 'src/app/core/repository/interfaces/meter-units/meter-units-for-job.interface';
import { of, Observable } from 'rxjs';

@Injectable()
export class MeterUnitsForJobInterceptor {
  constructor() {}

  static canInterceptMeterUnitsForJob(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitsForJob}/.+`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptMeterUnitsForJobPost(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: ResponseMeterUnitsForJob = {
      jobDescription: 'Reading job 1',
      grid: {
        totalCount: 3,
        summary: '',
        groupCount: 0,
        data: [
          {
            id: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
            name: 'Cubis PLC temp 520',
            vendor: 'Landis+Gy',
            id5: 'ID-12345'
          },
          {
            id: 'ebeacc9d-744c-4a88-bb9c-625216ab99b9',
            name: 'Cubis PLC temp 423',
            vendor: 'Landis+Gy',
            id5: 'ID-12345'
          },
          {
            id: 'ebeacc9d-744c-4a88-bb9c-625216ab99b9',
            name: 'Cubis PLC temp 642',
            vendor: 'Landis+Gy',
            id5: 'ID-12345'
          }
        ]
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
