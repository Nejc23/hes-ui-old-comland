import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { Sample } from 'src/app/core/repository/interfaces/samples/samples-interface';

@Injectable()
export class SampleInterceptor {
  constructor() {}

  static interceptSample(): Observable<HttpEvent<any>> {
    const data: Sample[] = [
      {
        status: 'Active',
        name: 'CUBIS PLC test 5',
        meters: 22,
        readStatus: 100,
        readStatusColor: 'g',
        type: 'G3-PLC',
        vendor: 'Landis+Gy',
        id: '0932334345546',
        ip: '23.1.23.4',
        lastCommunication: '5 mins ago',
        tags: null
      },
      {
        status: 'Active',
        name: 'CUBIS PLC test 6',
        meters: 12,
        readStatus: 98,
        readStatusColor: 'g',
        type: 'G3-PLC',
        vendor: 'Landis+Gy',
        id: '03923477234',
        ip: '21.12.245.4',
        lastCommunication: '5 mins ago',
        tags: ['tag1, tag2']
      },
      {
        status: 'Active',
        name: 'CUBIS PLC test 15',
        meters: 4,
        readStatus: 20,
        readStatusColor: 'r',
        type: 'G3-PLC',
        vendor: 'Iskra',
        id: '093344356666',
        ip: '6.12.577.1',
        lastCommunication: '1 day ago',
        tags: null
      },
      {
        status: 'Inactive',
        name: 'CUBIS PLC test 3',
        meters: 2,
        readStatus: 10,
        readStatusColor: 'r',
        type: 'G3-PLC',
        vendor: 'Iskra',
        id: '09343t5t566',
        ip: '16.212.53.14',
        lastCommunication: '1 day ago',
        tags: ['tag, tag 5']
      },
      {
        status: 'Inactive',
        name: 'CUBIS PLC test 223',
        meters: 22.3,
        readStatus: 0.43,
        readStatusColor: 'y',
        type: 'G3-PLC',
        vendor: 'Iskra',
        id: 'rr48485t566',
        ip: '42.22.33.454',
        lastCommunication: '1 hour ago',
        tags: ['tag, tag 5']
      },
      {
        status: 'active',
        name: 'CUBIS PLC test 121',
        meters: 12.3,
        readStatus: 3.43,
        readStatusColor: 'g',
        type: 'G3-PLC',
        vendor: 'N/A',
        id: '112q344111',
        ip: 'N/A',
        lastCommunication: '1 hour ago',
        tags: ['tag, tag 5']
      },
      {
        status: 'active',
        name: 'CUBIS PLC test 357',
        meters: 121.3,
        readStatus: 32.43,
        readStatusColor: 'g',
        type: 'G3-PLC',
        vendor: 'N/A',
        id: '344567688998',
        ip: 'N/A',
        lastCommunication: '1 hour ago',
        tags: ['tag, tag 5']
      }
    ];
    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptSample(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/sample`).test(request.url);
  }
}
