import { DataProcessingService } from '../../../../src/app/core/repository/services/data-processing/data-processing.service';
import { DataProcessingRequest } from '../../../../src/app/features/meter-units/registers/interfaces/data-processing-request.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { EventProfileDefinitionsForDevice } from 'src/app/core/repository/interfaces/data-processing/profile-definitions-for-device.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: DataProcessingService;

  beforeAll(done => {
    provider = setupPactProvider(done);
  });

  afterAll(done => {
    pactFinalize(provider, done);
  });

  afterEach(done => {
    pactVerify(provider, done);
  });

  beforeAll(() => {
    pactSetAngular();
    service = getTestBed().get(DataProcessingService);
  });

  describe('Data processing get events request', () => {
    const request: DataProcessingRequest = {
      deviceIds: ['4E43B249-BD4D-4B89-A32B-4D9002F3755F', '6EF65085-49F7-4457-A94A-6A846BC8D921'],
      profiles: [
        {
          profileId: '5E1C3073-AF91-4269-887A-3F6F9632DEA6',
          registerIds: ['30A24F4A-D21F-4BCE-9C98-E1D5A97D362C']
        },
        {
          profileId: 'F559AFD5-07F1-446D-B66C-890348335041',
          registerIds: ['B170E426-DDC3-46ED-979D-0A533B0AD6D8']
        }
      ],
      startTime: '2020-03-17 00:00:00.0000000 +00:00',
      endTime: '2020-03-19 00:00:00.0000000 +00:00'
    };

    const responseBody: EventProfileDefinitionsForDevice[] = [
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

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_DATA_PROCESSING_GET_EVENTS',
          uponReceiving: 'a request for getting data processing events',
          withRequest: {
            method: service.getEventsRequest(request).method,
            path: service.getEventsRequest(request).url,
            body: null,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 200,
            headers: {
              ...defaultResponseHeader
            },
            body: responseBody
          }
        })
        .then(
          () => {
            done();
          },
          err => {
            done.fail(err);
          }
        );
    });

    it('should make request for getting data processing profiles', done => {
      service.getEvents(request).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
