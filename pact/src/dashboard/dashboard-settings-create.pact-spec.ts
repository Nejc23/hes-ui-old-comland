// TODO: [8364] [8615]
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

  const requestBody: DashboardModel = {
    id: 0,
    dashboardName: 'Dasboard',
    refreshEveryMinute: true
  };

  const responseBody: DashboardModel = {
    id: 1,
    dashboardName: 'Dasboard',
    refreshEveryMinute: true
  };

  describe('Dashboard create', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_CREATE_DASHBOARD',
          uponReceiving: 'a request for creating dashboard',
          withRequest: {
            method: service.createDashboardRequest(requestBody).method,
            path: service.createDashboardRequest(requestBody).url,
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

    it('should make request for creating creating dashboard', done => {
      service.createDashboard(requestBody).subscribe(
        (res: DashboardModel) => {
          expect(res.id).toEqual(responseBody.id);
          expect(res.id).toBeGreaterThan(0);
          expect(res.dashboardName).toEqual(responseBody.dashboardName);
          expect(res.refreshEveryMinute).toEqual(responseBody.refreshEveryMinute);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
