import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';

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

  const id = 1;

  describe('Delete data concentrator unit filter', () => {
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_DELETE_DATA_CONCENTRATOR_UNIT_FILTER',
          uponReceiving: 'a request to delete data concentrator unit filter',
          withRequest: {
            method: service.deleteDcuLayoutRequest(id).method,
            path: service.deleteDcuLayoutRequest(id).url,
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request to delete data concentrator unit filter', (done) => {
      service.deleteDcuLayout(id).subscribe(
        (res) => {
          expect(res).toEqual(null);
          done();
        },
        (err) => {
          done.fail(err);
        }
      );
    });
  });
});
