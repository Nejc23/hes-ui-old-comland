// TODO: [8364] [8615]
/*import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { DashboardRepositoryService } from 'src/app/core/repository/services/dashboards/dashboard-repository.service';

describe('Pact consumer test', () => {
  let provider;
  let service: DashboardRepositoryService;

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
    service = getTestBed().get(DashboardRepositoryService);
  });

  const id = 1;

  describe('Dashboard delete', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_DELETE_DASHBOARD',
          uponReceiving: 'a request for deleting dashboard',
          withRequest: {
            method: service.deleteDashboardRequest(id).method,
            path: service.deleteDashboardRequest(id).url,
            headers: defaultRequestHeader
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

    it('should make request for deleting dashboard', done => {
      service.deleteDashboard(id).subscribe(
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
*/
