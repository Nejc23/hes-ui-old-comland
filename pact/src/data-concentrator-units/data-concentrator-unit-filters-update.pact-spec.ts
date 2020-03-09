import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { UserRepository } from 'src/app/core/repository/interfaces/users/user-repository.interface';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DcuFilter } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-filter.interface';

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

  const id = 1;
  const requestBody: DcuFilter = {
    id: 1,
    name: 'Test filter 1',
    statuses: [{ id: 1, value: 'Active' }],
    tags: [{ id: 1, value: 'tag 1' }],
    types: [1],
    vendor: { id: 1, value: 'Vendor 1' }
  };

  const responseBody: DcuFilter = {
    id: 1,
    name: 'Test filter 1',
    statuses: [{ id: 1, value: 'Active' }],
    tags: [{ id: 1, value: 'tag 1' }],
    types: [1],
    vendor: { id: 1, value: 'Vendor 1' }
  };

  describe('Data concentrator unit filter update', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_UPDATE_DATA_CONCENTRATOR_UNIT_FILTER',
          uponReceiving: 'a request for updating data concentrator unit filter',
          withRequest: {
            method: service.saveDcuFilterRequest(id, requestBody).method,
            path: service.saveDcuFilterRequest(id, requestBody).url,
            body: requestBody,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 200,
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

    it('should make request for updating data concentrator unit filter', done => {
      service.saveDcuFilter(id, requestBody).subscribe(
        (res: DcuFilter) => {
          expect(res.id).toEqual(responseBody.id);
          expect(res.id).toBeGreaterThan(0);
          expect(res.name).toEqual(responseBody.name);
          expect(res.statuses).toEqual(responseBody.statuses);
          expect(res.tags).toEqual(responseBody.tags);
          expect(res.types).toEqual(responseBody.types);
          expect(res.vendor).toEqual(responseBody.vendor);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
