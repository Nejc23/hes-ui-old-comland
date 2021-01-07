import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import * as _ from 'lodash';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { CodelistMeterUnitsRepositoryService } from 'src/app/core/repository/services/codelists/codelist-meter-units-repository.service';

describe('Pact consumer test', () => {
  let provider;
  let service: CodelistMeterUnitsRepositoryService;

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
    service = getTestBed().inject(CodelistMeterUnitsRepositoryService);
  });

  describe('Codelist - meter units firmwares by type', () => {
    const meterUnitTypeId = 1;
    const responseBody: Codelist<number>[] = [
      {
        id: 1,
        value: '12.3.1'
      },
      {
        id: 2,
        value: '12.3.2'
      },
      {
        id: 3,
        value: '12.4.0'
      }
    ];
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_METER_UNIT_FIRMWARES_CODELIST_BY_TYPE',
          uponReceiving: 'a request for getting meter unit firmwares codelist by type',
          withRequest: {
            method: service.meterUnitFirmwareCodelistRequest(meterUnitTypeId).method,
            path: service.meterUnitFirmwareCodelistRequest(meterUnitTypeId).url,
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request for fetching meter unit firmwares codelist by type', (done) => {
      service.meterUnitFirmwareCodelist(meterUnitTypeId).subscribe((res) => {
        expect(res).toEqual(responseBody);
        expect(res.length).toBeGreaterThan(1);
        done();
      });
    });
  });
});
