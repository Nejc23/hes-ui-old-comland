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
    id: null,
    filter: {
      statuses: [{ id: 1, value: 'active' }],
      types: [1, 2],
      vendor: { id: 2, value: 'Vendor 2' },
      tags: [
        { id: 1, value: 'tag1' },
        { id: 2, value: 'tag2' }
      ]
    }
  };

  describe('Bulk delete data concentrator unit by filter', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_BULK_DELETE_DATA_CONCENTRATOR_UNIT_BY_FILTER',
          uponReceiving: 'a request to bulk delete data concentrator unit by filter',
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

    it('should make request to bulk delete data concentrator unit by filter', done => {
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
