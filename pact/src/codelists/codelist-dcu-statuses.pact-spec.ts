import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import * as _ from 'lodash';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: CodelistRepositoryService;

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
    service = getTestBed().inject(CodelistRepositoryService);
  });

  describe('Codelist - data concentrator unit statuses', () => {
    const responseBody: Codelist<number>[] = [
      {
        id: 1,
        value: 'Active'
      },
      {
        id: 2,
        value: 'Inactive'
      },
      {
        id: 3,
        value: 'Mouted'
      },
      {
        id: 4,
        value: 'Warehouse'
      }
    ];
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_DCU_STATUS_CODELISTS',
          uponReceiving: 'a request for getting data concentrator unit status codelists',
          withRequest: {
            method: service.dcuStatusCodelistRequest().method,
            path: service.dcuStatusCodelistRequest().url,
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

    it('should make request for fetching data concentrator unit status codelists', (done) => {
      service.dcuStatusCodelist().subscribe((res) => {
        expect(res).toEqual(responseBody);
        expect(res.length).toBeGreaterThan(1);
        done();
      });
    });
  });
});
