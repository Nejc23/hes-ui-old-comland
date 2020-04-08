import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import * as _ from 'lodash';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';

describe('Pact consumer test', () => {
  let provider;
  let service: CodelistMeterUnitsRepositoryService;

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
    service = getTestBed().get(CodelistMeterUnitsRepositoryService);
  });

  describe('Codelist - meter unit braker states by type', () => {
    const meterUnitTypeId = 1;
    const responseBody: Codelist<number>[] = [
      {
        id: 1,
        value: 'on'
      },
      {
        id: 2,
        value: 'off'
      }
    ];
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_METER_UNIT_BREAKER_STATES_CODELIST_BY_TYPE',
          uponReceiving: 'a request for getting meter unit breaker states codelist by type',
          withRequest: {
            method: service.meterUnitBreakerStateCodelistRequest(meterUnitTypeId).method,
            path: service.meterUnitBreakerStateCodelistRequest(meterUnitTypeId).url,
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

    it('should make request for fetching meter units breaker states codelist by type', done => {
      service.meterUnitBreakerStateCodelist(meterUnitTypeId).subscribe(res => {
        expect(res).toEqual(responseBody);
        expect(res.length).toBeGreaterThan(1);
        done();
      });
    });
  });
});
