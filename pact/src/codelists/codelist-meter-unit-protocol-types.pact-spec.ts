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

  describe('Codelist - meter unit protocol type codelist', () => {
    const responseBody: Codelist<number>[] = [
      {
        id: 0,
        value: 'UNKNOWN'
      },
      {
        id: 1,
        value: 'DC450G3'
      },
      {
        id: 2,
        value: 'DLMS'
      },
      {
        id: 3,
        value: 'AC750'
      }
    ];
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_METER_UNIT_PROTOCOL_TYPES_CODELIST',
          uponReceiving: 'a request for getting meter unit protocol type codelist',
          withRequest: {
            method: service.meterUnitProtocolTypeCodelistRequest().method,
            path: service.meterUnitProtocolTypeCodelistRequest().url,
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

    it('should make request for fetching meter unit protocol type codelist', (done) => {
      service.meterUnitProtocolTypeCodelist().subscribe((res) => {
        expect(res).toEqual(responseBody);
        expect(res.length).toBeGreaterThan(1);
        done();
      });
    });
  });
});