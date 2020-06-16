import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';

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

  const id = 'e7a59990-51e8-4fd5-994b-a3a102b42436';

  describe('Enable meter units scheduler job', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_ENABLE_METER_UNITS_SCHEDULER_JOB',
          uponReceiving: 'a request for enable meter units scheduler job',
          withRequest: {
            method: service.enableSchedulerJobRequest(id).method,
            path: service.enableSchedulerJobRequest(id).url,
            headers: {
              ...defaultRequestHeader
            }
          },
          willRespondWith: {
            status: 204,
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

    it('should make request for enable meter units scheduler job', done => {
      service.enableSchedulerJob(id).subscribe(
        res => {
          expect(res).toEqual(null);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
