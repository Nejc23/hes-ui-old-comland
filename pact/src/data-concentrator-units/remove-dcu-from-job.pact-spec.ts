import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { RequestMeterUnitsForJob } from 'src/app/core/repository/interfaces/meter-units/meter-units-for-job.interface';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';

describe('Pact consumer test', () => {
  let provider;
  let service: DataConcentratorUnitsService;

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
    service = getTestBed().inject(DataConcentratorUnitsService);
  });

  describe('Remove Data Concentrators from Job request', () => {
    const data: RequestMeterUnitsForJob = {
      requestId: 'eb86212f-ba3b-49d6-bef5-eaca32b38a81',
      startRow: 0,
      endRow: 10,
      scheduleId: '82a70604-8fce-4d07-917f-368be21d6b9b',
      deviceIds: ['9b837e2d-957d-49e2-8d1d-a2e4b8440b77', 'ebeacc9d-744c-4a88-bb9c-625216ab99b9']
    };

    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_REMOVE_CONCENTRATORS_FROM_JOB',
          uponReceiving: 'a request for removing concentrators from job',
          withRequest: {
            method: service.removeConcentratorsFromJobRequest(data).method,
            path: service.removeConcentratorsFromJobRequest(data).url,
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request for removing Concentrators from job', (done) => {
      service.removeConcentratorsFromJob(data).subscribe((res) => {
        expect(res).toEqual(null);
        done();
      });
    });
  });
});
