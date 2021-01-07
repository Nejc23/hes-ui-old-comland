import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { RegisterDefinitionsForDevice } from 'src/app/core/repository/interfaces/data-processing/profile-definitions-for-device.interface';
import { DataProcessingService } from 'src/app/core/repository/services/data-processing/data-processing.service';
import { DataProcessingRequest } from 'src/app/core/repository/interfaces/data-processing/data-processing-request.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: DataProcessingService;

  beforeAll((done) => {
    provider = setupPactProvider(done);
  });

  afterAll((done) => {
    pactFinalize(provider, done);
  });

  afterEach((done) => {
    pactVerify(provider, done);
  });

  beforeAll(() => {
    pactSetAngular();
    service = getTestBed().inject(DataProcessingService);
  });

  describe('Data processing get instantaneous values request', () => {
    const request: DataProcessingRequest = {
      deviceIds: ['4E43B249-BD4D-4B89-A32B-4D9002F3755F', '6EF65085-49F7-4457-A94A-6A846BC8D921'],
      registerIds: ['4CD5A425-221A-4CEE-B1C6-8903425456C7'],
      startTime: '2020-03-17 00:00:00.0000000 +00:00',
      endTime: '2020-03-19 00:00:00.0000000 +00:00'
    };

    const responseBody: RegisterDefinitionsForDevice[] = [
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

    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_DATA_PROCESSING_GET_INSTANTANEOUS_VALUES',
          uponReceiving: 'a request for getting data processing instantaneous values',
          withRequest: {
            method: service.getInstantaneousValuesRequest(request).method,
            path: service.getInstantaneousValuesRequest(request).url,
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request for getting data processing profiles', (done) => {
      service.getInstantaneousValues(request).subscribe((res) => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
