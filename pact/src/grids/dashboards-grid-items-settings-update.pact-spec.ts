import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { GridRepositoryService } from 'src/app/shared/repository/services/grid-repository.service';
import { DashboardGridResponse } from 'src/app/shared/repository/interfaces/responses/dashboard-grid-response.interface';
import { dashboardGridResponse } from './helpers/dashboard-grid-items-helper';

describe('Pact consumer test', () => {
  let provider;
  let service: GridRepositoryService;

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
    service = getTestBed().get(GridRepositoryService);
  });

  const id = 1;
  const requestBody = dashboardGridResponse;
  const responseBody = dashboardGridResponse;

  describe('Dashboard grid items settings update', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_UPDATE_DASHBOARD_GRID_ITEMS_SETTINGS',
          uponReceiving: 'a request for creating, updating grid items settings',
          withRequest: {
            method: service.saveGridRequest(id, requestBody).method,
            path: service.saveGridRequest(id, requestBody).url,
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

    it('should make request for creating, updating grid items settings', done => {
      service.saveGrid(id, requestBody).subscribe(
        (res: DashboardGridResponse) => {
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
