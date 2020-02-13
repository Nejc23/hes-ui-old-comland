import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { DashboardRepositoryService } from 'src/app/core/repository/services/dashboards/dashboard-repository.service';
import { DashboardModel } from 'src/app/core/repository/interfaces/dashboards/dashboard.interface';

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

  describe('Dashboard settings get request', () => {
    const id = 5;
    const responseBody: DashboardModel = {
      id,
      dashboardName: 'dashboard',
      refreshEveryMinute: true
    };
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_DASHBOARD_SETTINGS',
          uponReceiving: 'a request for getting dashboard settings',
          withRequest: {
            method: service.getDashboardRequest(id).method,
            path: service.getDashboardRequest(id).url,
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

    it('should make request for fetching dashboard settings', done => {
      service.getDashboard(id).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
