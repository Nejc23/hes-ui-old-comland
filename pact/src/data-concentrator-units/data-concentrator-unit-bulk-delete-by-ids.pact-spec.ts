import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: DataConcentratorUnitsService;

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
    service = getTestBed().get(DataConcentratorUnitsService);
  });

  const requestBody: GridBulkActionRequestParams = {
    id: [1, 34, 322, 44],
    filter: null
  };

  describe('Bulk delete data concentrator unit by ids', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_BULK_DELETE_DATA_CONCENTRATOR_UNIT_BY_IDS',
          uponReceiving: 'a request to bulk delete data concentrator unit by ids',
          withRequest: {
            method: service.deleteDcuRequest(requestBody).method,
            path: service.deleteDcuRequest(requestBody).url,
            body: requestBody,
            headers: {
              ...defaultRequestHeader
            }
          },
          willRespondWith: {
            status: 201,
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

    it('should make request to bulk delete data concentrator unit by ids', done => {
      service.deleteDcu(requestBody).subscribe(
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
