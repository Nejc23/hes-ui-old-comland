import { getProfiles, getEvents, getInstantaneousValues } from './../../../../app/core/repository/consts/data-processing.const';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpEvent, HttpResponse, HttpRequest } from '@angular/common/http';
import {
  EventProfileDefinitionsForDevice,
  ProfileDefinitionsForDevice,
  RegisterDefinitionsForDevice
} from 'src/app/core/repository/interfaces/data-processing/profile-definitions-for-device.interface';

@Injectable()
export class DataProcessingInterceptor {
  constructor() {}

  static canInterceptGetProfiles(request: HttpRequest<any>): boolean {
    return new RegExp(getProfiles).test(request.url) && request.method.endsWith('POST');
  }

  static interceptGetProfiles(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: ProfileDefinitionsForDevice[] = [
      {
        deviceId: '4e43b249-bd4d-4b89-a32b-4d9002f3755c',
        profileDefinitions: [
          {
            profileId: 'be0be035-0027-4ad3-876c-24d703b12360',
            registerDefinitions: [
              {
                registerId: 'a2a91387-cce2-477f-8ab9-ec2d847191e8',
                registerStatus: 'OK',
                registerValues: [
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T01:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T02:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T03:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '13.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T04:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T05:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T06:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T07:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T08:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '5.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T09:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T10:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '8.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T11:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '3.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T12:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T13:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T14:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T15:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '13.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T16:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T17:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T18:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T19:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T20:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '5.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T21:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T22:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '8.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T23:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '3.0'
                    },
                    status: 0,
                    timestamp: '2020-03-18T00:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-18T01:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-19T02:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T03:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '13.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T04:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T05:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T06:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T07:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T08:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '5.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T09:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T10:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '8.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T11:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '3.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T12:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T13:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T14:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T15:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '13.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T16:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T17:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T18:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T19:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T20:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '5.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T21:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T22:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '8.0'
                    },
                    status: 0,
                    timestamp: '2020-03-20T23:00:00+00:00'
                  },

                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T01:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T02:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T03:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '13.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T04:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T05:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T06:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T07:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T08:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '5.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T09:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T10:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '8.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T11:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '3.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T12:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T13:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T14:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T15:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '13.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T16:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '39.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T17:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '0.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T18:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T19:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T20:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '5.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T21:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T22:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '8.0'
                    },
                    status: 0,
                    timestamp: '2020-03-21T23:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '3.0'
                    },
                    status: 0,
                    timestamp: '2020-03-22T00:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-23T01:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-24T02:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T03:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '13.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T04:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T05:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T06:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T07:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T08:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '5.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T09:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T10:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '40.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T11:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '3.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T12:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T13:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T14:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T15:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '13.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T16:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T17:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '38.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T18:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T19:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T20:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '5.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T21:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '23.0'
                    },
                    status: 0,
                    timestamp: '2020-03-29T22:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '8.0'
                    },
                    status: 0,
                    timestamp: '2020-03-30T08:00:00+00:00'
                  }
                ]
              },
              {
                registerId: 'ebd79a85-9940-4377-4-912496e4be40',
                registerStatus: 'OK',
                registerValues: [
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03T01:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03T02:00:00+00:00'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        deviceId: '6ef65085-49f7-4457-a94a-6a846bc8d921',
        profileDefinitions: [
          {
            profileId: '8830fddc-9e08-4a46-b99e-2dd1987307a8',
            registerDefinitions: [
              {
                registerId: '98ff9a58-40fb-4683-8dcd-2e1745b01c29',
                registerStatus: 'OK',
                registerValues: [
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '21.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T01:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '22.0'
                    },
                    status: 0,
                    timestamp: '2020-03-17T02:00:00+00:00'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptGetEvents(request: HttpRequest<any>): boolean {
    return new RegExp(getEvents).test(request.url) && request.method.endsWith('POST');
  }

  static interceptGetEvents(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: EventProfileDefinitionsForDevice[] = [
      {
        deviceId: '6ef65085-49f7-4457-a94a-6a846bc8d921',
        eventProfileDefinitions: [
          {
            eventProfileId: 'f559afd5-07f1-446d-b66c-890348335041',
            eventRegisterDefinition: [
              {
                registerId: 'b170e426-ddc3-46ed-979d-0a533b0ad6d8',
                registerStatus: 'OK',
                eventRegisterValues: [
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '202.0'
                    },
                    timestamp: '2020-03-17T00:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '105.0'
                    },
                    timestamp: '2020-03-17T01:00:00+00:00'
                  },
                  {
                    valueWithUnit: {
                      unit: '',
                      value: '20.0'
                    },
                    timestamp: '2020-03-17T03:00:00+00:00'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        requestId: null,
        deviceId: '6704c042-5457-4450-a691-359ab3c6b696',
        eventProfileDefinitions: [
          {
            requestId: null,
            eventProfileId: 'fd6241a3-9328-461d-8c41-e380b00ff71d',
            eventRegisterDefinition: [
              {
                requestId: null,
                registerId: 'c3c151ed-7596-4189-bf3a-186df3b85d89',
                registerStatus: 'OK',
                eventRegisterValues: [
                  {
                    requestId: null,
                    valueWithUnit: {
                      unit: '',
                      value: '83.0'
                    },
                    timestamp: '2020-10-29T08:46:17+01:00'
                  },
                  {
                    requestId: null,
                    valueWithUnit: {
                      unit: '',
                      value: '84.0'
                    },
                    timestamp: '2020-10-29T08:46:17+01:00'
                  },
                  {
                    requestId: null,
                    valueWithUnit: {
                      unit: '',
                      value: '249.0'
                    },
                    timestamp: '2020-10-29T09:36:17+01:00',
                    description: 'test description 1'
                  },
                  {
                    requestId: null,
                    valueWithUnit: {
                      unit: '',
                      value: '250.0'
                    },
                    timestamp: '2020-10-29T09:36:17+01:00'
                  },
                  {
                    requestId: null,
                    valueWithUnit: {
                      unit: '',
                      value: '86.0'
                    },
                    timestamp: '2020-10-29T09:46:17+01:00'
                  },
                  {
                    requestId: null,
                    valueWithUnit: {
                      unit: '',
                      value: '87.0'
                    },
                    timestamp: '2020-10-29T09:46:17+01:00'
                  },
                  {
                    requestId: null,
                    valueWithUnit: {
                      unit: '',
                      value: '93.0'
                    },
                    timestamp: '2020-10-30T00:00:02+01:00'
                  },
                  {
                    requestId: null,
                    valueWithUnit: {
                      unit: '',
                      value: '94.0'
                    },
                    timestamp: '2020-10-30T00:00:02+01:00'
                  },
                  {
                    requestId: null,
                    valueWithUnit: {
                      unit: '',
                      value: '93.0'
                    },
                    timestamp: '2020-10-31T00:00:02+01:00'
                  },
                  {
                    requestId: null,
                    valueWithUnit: {
                      unit: '',
                      value: '94.0'
                    },
                    timestamp: '2020-10-31T00:00:02+01:00'
                  },
                  {
                    requestId: null,
                    valueWithUnit: {
                      unit: '',
                      value: '93.0'
                    },
                    timestamp: '2020-11-01T00:00:02+01:00'
                  },
                  {
                    requestId: null,
                    valueWithUnit: {
                      unit: '',
                      value: '94.0'
                    },
                    timestamp: '2020-11-01T00:00:02+01:00'
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptGetInstantaneousValues(request: HttpRequest<any>): boolean {
    return new RegExp(getInstantaneousValues).test(request.url) && request.method.endsWith('POST');
  }

  static interceptGetInstantaneousValues(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const data: RegisterDefinitionsForDevice[] = [
      {
        deviceId: '6ef65085-49f7-4457-a94a-6a846bc8d921',
        registerDefinitions: [
          {
            registerId: '4cd5a425-221a-4cee-b1c6-8903425456c7',
            registerStatus: 'OK',
            registerValues: [
              {
                valueWithUnit: {
                  unit: '',
                  value: '356.0'
                },
                status: 0,
                timestamp: '2020-03-17T01:02:00+00:00'
              },
              {
                valueWithUnit: {
                  unit: '',
                  value: '255.0'
                },
                status: 0,
                timestamp: '2020-03-17T01:03:00+00:00'
              },
              {
                valueWithUnit: {
                  unit: '',
                  value: '256.0'
                },
                status: 0,
                timestamp: '2020-03-17T01:08:00+00:00'
              },
              {
                valueWithUnit: {
                  unit: '',
                  value: '358.0'
                },
                status: 0,
                timestamp: '2020-03-17T01:09:00+00:00'
              }
            ]
          }
        ]
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
