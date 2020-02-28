/*import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

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

  describe('Codelist - dashboards', () => {
    const responseBody: Codelist<number>[] = [
      {
        id: 1,
        value: 'dash board 12'
      }
    ];
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_DASHBOARD_CODELISTS',
          uponReceiving: 'a request for getting dashboard codelists',
          withRequest: {
            method: service.dashboardCodelistRequest().method,
            path: service.dashboardCodelistRequest().url,
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

    it('should make request for fetching dashboard codelists', done => {
      service.dashboardCodelist().subscribe(res => {
        expect(res.length).toBeGreaterThan(0);
        expect(res).toEqual(responseBody);
        expect(res[0].id).toBeDefined();
        expect(res[0].value).toBeDefined();
        done();
      });
    });
  });
});
*/
