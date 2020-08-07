import { RequestRemoveScheduleDevices } from './../../../src/app/core/repository/interfaces/jobs/remove-schedule-devices.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';

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

  describe('Remove schedule devices request', () => {
    const data: RequestRemoveScheduleDevices = {
      requestId: 'eb86212f-ba3b-49d6-bef5-eaca32b38a81',
      scheduleId: '82a70604-8fce-4d07-917f-368be21d6b9b',
      devices: ['b6802f30-0641-4ac8-9508-b0dbaf7acd80', '160c0cd4-908e-4f29-b81b-d98b79907b66']
    };

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_REMOVE_SCHEDULE_DEVICES_FROM_JOB',
          uponReceiving: 'a request for removing schedule devices from job',
          withRequest: {
            method: service.removeScheduleDevicesRequest(data).method,
            path: service.removeScheduleDevicesRequest(data).url,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 200,
            headers: {
              ...defaultResponseHeader
            },
            body: null
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

    it('should make request for fetching scheduled active jobs list', done => {
      service.removeScheduleDevices(data).subscribe(res => {
        expect(res).toEqual(null);
        done();
      });
    });
  });
});
