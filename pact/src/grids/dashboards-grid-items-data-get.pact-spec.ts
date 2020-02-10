import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { GridRepositoryService } from 'src/app/shared/repository/services/grid-repository.service';
import { responseDashboardData } from './helpers/dashboard-grid-items-data-hepler';

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

  describe('Grid widgets data get request', () => {
    const id = 5;
    const responseBody = responseDashboardData;

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_WIDGETS_DATA',
          uponReceiving: 'a request for getting widgets data',
          withRequest: {
            method: service.getGridItemsDataRequest(id).method,
            path: service.getGridItemsDataRequest(id).url,
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

    it('should make request for fetching widgets data', done => {
      service.getGridItemsData(id).subscribe(res => {
        expect(res).toEqual(responseBody);
        expect(res.length).toBeGreaterThan(0);
        done();
      });
    });
  });
});
