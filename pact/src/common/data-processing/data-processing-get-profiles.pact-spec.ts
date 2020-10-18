import { ProfileDefinitionsForDevice } from '../../../../src/app/core/repository/interfaces/data-processing/profile-definitions-for-device.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { DataProcessingService } from 'src/app/core/repository/services/data-processing/data-processing.service';
import { DataProcessingRequest } from 'src/app/core/repository/interfaces/data-processing/data-processing-request.interface';

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
    service = getTestBed().inject(DataProcessingService);
  });

  describe('Data processing get profiles request', () => {
    const request: DataProcessingRequest = {
      deviceIds: ['4E43B249-BD4D-4B89-A32B-4D9002F3755C', '6EF65085-49F7-4457-A94A-6A846BC8D921'],
      profiles: [
        {
          profileId: 'BE0BE035-0027-4AD3-876C-24D703B12360',
          registerIds: ['A2A91387-CCE2-477F-8AB9-EC2D847191E8', 'EBD79A85-9940-4377-9A64-912496E4BE40']
        },
        {
          profileId: '8830FDDC-9E08-4A46-B99E-2DD1987307A8',
          registerIds: ['98FF9A58-40FB-4683-8DCD-2E1745B01C29']
        }
      ],
      startTime: '2020-03-17 00:00:00.0000000 +00:00',
      endTime: '2020-03-19 00:00:00.0000000 +00:00'
    };

    const responseBody: ProfileDefinitionsForDevice[] = [
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

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_DATA_PROCESSING_GET_PROFILES',
          uponReceiving: 'a request for getting data processing profiles',
          withRequest: {
            method: service.getProfilesRequest(request).method,
            path: service.getProfilesRequest(request).url,
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
      service.getProfiles(request).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
