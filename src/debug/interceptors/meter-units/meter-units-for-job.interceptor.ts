import { meterUnitsForJob } from '../../../app/core/repository/consts/meter-units.const';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http';
import { ResponseMeterUnitsForJob } from 'src/app/core/repository/interfaces/meter-units/meter-units-for-job.interface';
import { of, Observable } from 'rxjs';

@Injectable()
export class MeterUnitsForJobInterceptor {
  constructor() {}

  static canInterceptMeterUnitsForJob(request: HttpRequest<any>): boolean {
    return new RegExp(`${meterUnitsForJob}`).test(request.url) && request.method.endsWith('POST');
  }

  static interceptMeterUnitsForJobPost(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: ResponseMeterUnitsForJob = {
      jobDescription: 'Reading job 1',
      grid: {
        totalCount: 193,
        summary: '',
        groupCount: 0,
        data: [
          {
            id: 'de32daef-4766-4afc-aa5f-bba5822bf9b0',
            name: 'PLC dat 221',
            vendor: 'Iskra',
            id5: '626516631021'
          },
          {
            id: 'e4694732-a282-477c-9c47-79ca08f64911',
            name: 'PLC dat 915',
            vendor: 'Iskra',
            id5: '977862534617'
          },
          {
            id: '4db50891-45dc-4910-bc8e-1d1c15862a68',
            name: 'PLC dat 387',
            vendor: 'Landis+Gy',
            id5: '991196390689'
          },
          {
            id: '7f7e9055-ad99-479f-956f-903022e1cccd',
            name: 'PLC dat 626',
            vendor: 'Landis+Gy',
            id5: '645461952652'
          },
          {
            id: 'f8eb8b9f-bd39-406c-8ebc-c2659ab48246',
            name: 'PLC dat 623',
            vendor: 'Iskra',
            id5: '372969078122'
          },
          {
            id: '74cc061f-69f4-48e3-8fb6-1a1e88cdd3d3',
            name: 'PLC dat 345',
            vendor: 'Iskra',
            id5: '878565520965'
          },
          {
            id: 'bd50a59a-e791-470b-b328-7e3dc9b0a5df',
            name: 'PLC dat 954',
            vendor: 'Iskra',
            id5: '297789917782'
          },
          {
            id: '18d2fcdc-0809-4fb3-8b68-bbe35262b344',
            name: 'PLC dat 233',
            vendor: 'Landis+Gy',
            id5: '833452712479'
          },
          {
            id: 'f790398c-5dc3-4511-ba8b-4b281b78fc49',
            name: 'PLC dat 659',
            vendor: 'Iskra',
            id5: '770053695430'
          },
          {
            id: '26dd5e0a-4342-496a-93c7-a0ee8ac94a33',
            name: 'PLC dat 519',
            vendor: 'Landis+Gy',
            id5: '591174417896'
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
