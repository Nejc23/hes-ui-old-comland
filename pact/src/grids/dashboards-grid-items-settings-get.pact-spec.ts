import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { TestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { dashboardGridResponse } from './helpers/dashboard-grid-items-helper';
import { GridRepositoryService } from 'src/app/core/repository/services/dashboards/grid-repository.service';

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
    service = TestBed.inject(GridRepositoryService);
  });

  describe('Grid widgets settings get request', () => {
    const id = 5;

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_WIDGETS_SETTINGS_ON_DASHBOARD',
          uponReceiving: 'a request for getting grid-widgets settings',
          withRequest: {
            method: service.getGridRequest(id).method,
            path: service.getGridRequest(id).url,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 200,
            headers: defaultResponseHeader,
            body: dashboardGridResponse
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

    it('should make request for fetching grid-widgets settings', done => {
      service.getGrid(id).subscribe(res => {
        expect(res).toEqual(dashboardGridResponse);
        done();
      });
    });
  });
});
