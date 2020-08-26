import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import * as _ from 'lodash';
import { CodelistExt } from 'src/app/shared/repository/interfaces/codelists/codelist-ext.interface';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';

describe('Pact consumer test', () => {
  let provider;
  let service: CodelistRepositoryService;

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
    service = getTestBed().get(CodelistRepositoryService);
  });

  describe('Codelist - reading jobs', () => {
    const responseBody: CodelistExt<string>[] = [
      {
        id: 'd8c8763d-4eff-4692-bdc5-58a05d54ed1b',
        value: 'Job 1',
        nextRun: '2021-07-24T08:30:30+00:00'
      },
      {
        id: 'd8c8763d-4eff-4692-bdc5-58a05d54ed1c',
        value: 'Job 2',
        nextRun: '2021-07-24T08:30:30+00:00'
      },
      {
        id: 'd8c8763d-4eff-4692-bdc5-58a05d54ed1d',
        value: 'Job 3',
        nextRun: '2022-07-25T15:45:45+00:00'
      }
    ];
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_READING_JOBS',
          uponReceiving: 'a request for getting reading jobs',
          withRequest: {
            method: service.jobsDiscoveryJobsCodelistRequest().method,
            path: service.jobsDiscoveryJobsCodelistRequest().url,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 200,
            headers: defaultResponseHeader,
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

    it('should make a request for fetching reading jobs', done => {
      service.jobsDiscoveryJobsCodelist().subscribe(res => {
        expect(res).toEqual(responseBody);
        expect(res.length).toBeGreaterThan(1);
        done();
      });
    });
  });
});
