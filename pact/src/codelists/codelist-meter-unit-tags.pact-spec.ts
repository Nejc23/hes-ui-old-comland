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

  describe('Codelist - meter unit tags by type', () => {
    const meterUnitTypeId = 1;
    const responseBody: Codelist<number>[] = [
      {
        id: 1,
        value: 'tag1'
      },
      {
        id: 2,
        value: 'tag2'
      },
      {
        id: 3,
        value: 'tag3'
      },
      {
        id: 4,
        value: 'tag4'
      }
    ];
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_METER_UNIT_TAGS_CODELIST_BY_TYPE',
          uponReceiving: 'a request for getting meter unit tags codelist by type',
          withRequest: {
            method: service.meterUnitTagCodelistRequest(meterUnitTypeId).method,
            path: service.meterUnitTagCodelistRequest(meterUnitTypeId).url,
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

    it('should make request for fetching meter unit tags codelist by type', (done) => {
      service.meterUnitTagCodelist(meterUnitTypeId).subscribe((res) => {
        expect(res).toEqual(responseBody);
        expect(res.length).toBeGreaterThan(1);
        done();
      });
    });
  });
});
