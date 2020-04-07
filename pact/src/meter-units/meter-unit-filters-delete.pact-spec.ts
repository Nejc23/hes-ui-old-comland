import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';

describe('Pact consumer test', () => {
  let provider;
  let service: MeterUnitsService;

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
    service = getTestBed().get(MeterUnitsService);
  });

  const meterUnitTypeId = 1;
  const id = 1;

  describe('Delete meter unit filter by type', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_DELETE_METER_UNIT_FILTER_BY_TYPE',
          uponReceiving: 'a request to delete meter unit filter by type',
          withRequest: {
            method: service.deleteMeterUnitsLayoutRequest(meterUnitTypeId, id).method,
            path: service.deleteMeterUnitsLayoutRequest(meterUnitTypeId, id).url,
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
          err => {
            done.fail(err);
          }
        );
    });

    it('should make request to delete meter unit filter by type', done => {
      service.deleteMeterUnitsLayout(meterUnitTypeId, id).subscribe(
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
