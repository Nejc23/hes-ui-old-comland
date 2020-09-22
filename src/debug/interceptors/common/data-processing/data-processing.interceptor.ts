import { getProfiles, getEvents } from './../../../../app/core/repository/consts/data-processing.const';
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
                    value: 21.0,
                    status: 0,
                    timestamp: '2020-03-17T01:00:00+00:00'
                  },
                  {
                    value: 22.0,
                    status: 0,
                    timestamp: '2020-03-17T02:00:00+00:00'
                  },
                  {
                    value: 23.0,
                    status: 0,
                    timestamp: '2020-03-17T03:00:00+00:00'
                  }
                ]
              },
              {
                registerId: 'ebd79a85-9940-4377-9a64-912496e4be40',
                registerStatus: 'OK',
                registerValues: [
                  {
                    value: 21.0,
                    status: 0,
                    timestamp: '2020-03-17T01:00:00+00:00'
                  },
                  {
                    value: 22.0,
                    status: 0,
                    timestamp: '2020-03-17T02:00:00+00:00'
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
                    value: 21.0,
                    status: 0,
                    timestamp: '2020-03-17T01:00:00+00:00'
                  },
                  {
                    value: 22.0,
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
        deviceId: '4e43b249-bd4d-4b89-a32b-4d9002f3755f',
        eventProfileDefinitions: [
          {
            eventProfileId: '5e1c3073-af91-4269-887a-3f6f9632dea6',
            eventRegisterDefinition: [
              {
                registerId: '30a24f4a-d21f-4bce-9c98-e1d5a97d362c',
                registerStatus: 'OK',
                eventRegisterValues: [
                  {
                    value: 105.0,
                    timestamp: '2020-03-17T01:00:00+00:00'
                  },
                  {
                    value: 20.0,
                    timestamp: '2020-03-17T03:00:00+00:00'
                  },
                  {
                    value: 21.0,
                    timestamp: '2020-03-17T03:35:00+00:00'
                  }
                ]
              }
            ]
          }
        ]
      },
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
                    value: 202.0,
                    timestamp: '2020-03-17T00:00:00+00:00'
                  },
                  {
                    value: 105.0,
                    timestamp: '2020-03-17T01:00:00+00:00'
                  },
                  {
                    value: 20.0,
                    timestamp: '2020-03-17T03:00:00+00:00'
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
    return new RegExp(getEvents).test(request.url) && request.method.endsWith('POST');
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
                value: 356.0,
                status: 0,
                timestamp: '2020-03-17T01:02:00+00:00'
              },
              {
                value: 255.0,
                status: 0,
                timestamp: '2020-03-17T01:03:00+00:00'
              },
              {
                value: 256.0,
                status: 0,
                timestamp: '2020-03-17T01:08:00+00:00'
              },
              {
                value: 358.0,
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
