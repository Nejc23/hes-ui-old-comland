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

  describe('Codelist - meter unit device medium codelist', () => {
    const responseBody: Codelist<number>[] = [
      {
        id: 0,
        value: 'UNKNOWN'
      },
      {
        id: 1,
        value: 'ELECTRICITY'
      },
      {
        id: 2,
        value: 'WATER'
      },
      {
        id: 3,
        value: 'GAS'
      },
      {
        id: 4,
        value: 'HEAT'
      }
    ];
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_METER_UNIT_DEVICE_MEDIUM_CODELIST',
          uponReceiving: 'a request for getting meter unit device medium codelist',
          withRequest: {
            method: service.meterUnitDeviceMediumCodelistRequest().method,
            path: service.meterUnitDeviceMediumCodelistRequest().url,
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

    it('should make request for fetching meter unit device medium codelist', (done) => {
      service.meterUnitDeviceMediumCodelist().subscribe((res) => {
        expect(res).toEqual(responseBody);
        expect(res.length).toBeGreaterThan(1);
        done();
      });
    });
  });
});
