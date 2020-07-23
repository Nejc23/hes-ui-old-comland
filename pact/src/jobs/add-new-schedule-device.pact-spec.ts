import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { ScheduleDevice } from 'src/app/core/repository/interfaces/jobs/schedule-device.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: JobsService;

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
    service = getTestBed().get(JobsService);
  });

  const responseId = 'af9c4a3e-8080-4e09-ae44-f1928967d8eb';
  const requestBody: ScheduleDevice = {
    scheduleDeviceId: null,
    scheduleId: 'ca8525ed-d74e-4d6b-9754-3fdde08589bb',
    deviceId: 'd8c8763d-4eff-4692-bdc5-58a05d54ed1b',
    readingId: null,
    templateId: null,
    registerGroupName: null,
    registerGroupType: null
  };

  const responseBody: ScheduleDevice = {
    scheduleDeviceId: responseId,
    scheduleId: 'ca8525ed-d74e-4d6b-9754-3fdde08589bb',
    deviceId: 'd8c8763d-4eff-4692-bdc5-58a05d54ed1b',
    readingId: null,
    templateId: null,
    registerGroupName: null,
    registerGroupType: null
  };

  describe('Schedule device manually create', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_ADD_SCHEDULE_DEVICE',
          uponReceiving: 'a request for adding schedule device',
          withRequest: {
            method: service.addNewScheduleDeviceRequest(requestBody).method,
            path: service.addNewScheduleDeviceRequest(requestBody).url,
            body: requestBody,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 201,
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

    it('should make request for adding schedule device', done => {
      service.addNewScheduleDevice(requestBody).subscribe(
        (res: ScheduleDevice) => {
          expect(res).toEqual(responseBody);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
