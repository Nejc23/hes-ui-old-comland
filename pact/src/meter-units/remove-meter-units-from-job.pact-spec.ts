import { RequestMeterUnitsForJob } from 'src/app/core/repository/interfaces/meter-units/meter-units-for-job.interface';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { RequestRemoveMeterUnitsFromJob } from 'src/app/core/repository/interfaces/meter-units/remove-meter-units-from-job.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: MeterUnitsService;

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
    service = getTestBed().inject(MeterUnitsService);
  });

  describe('Remove Meter Units from Job request', () => {
    const data: RequestMeterUnitsForJob = {
      requestId: 'eb86212f-ba3b-49d6-bef5-eaca32b38a81',
      startRow: 0,
      endRow: 10,
      scheduleId: '82a70604-8fce-4d07-917f-368be21d6b9b',
      deviceIds: ['b6802f30-0641-4ac8-9508-b0dbaf7acd80', '160c0cd4-908e-4f29-b81b-d98b79907b66']
    };

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_REMOVE_SCHEDULE_DEVICES_FROM_JOB',
          uponReceiving: 'a request for removing schedule devices from job',
          withRequest: {
            method: service.removeMeterUnitsFromJobRequest(data).method,
            path: service.removeMeterUnitsFromJobRequest(data).url,
            headers: defaultRequestHeader,
            body: data
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
      service.removeMeterUnitsFromJob(data).subscribe(res => {
        expect(res).toEqual(null);
        done();
      });
    });
  });
});
