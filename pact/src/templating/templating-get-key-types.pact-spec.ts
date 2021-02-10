import { TemplatingService } from 'src/app/core/repository/services/templating/templating.service';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import * as _ from 'lodash';
import { RegistersSelectService } from 'src/app/core/repository/services/registers-select/registers-select.service';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { GetDefaultInformationResponse } from 'src/app/core/repository/interfaces/templating/get-default-information.request.interface';
import { GetKeyTypesResponse } from 'src/app/core/repository/interfaces/templating/get-key-types-reponse.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: TemplatingService;

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
    service = getTestBed().inject(TemplatingService);
  });

  describe('Template key types', () => {
    const responseBody: GetKeyTypesResponse = {
      keyTypes: ['GUEK', 'GAK', 'GBEK']
    };

    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GETTIING_TEMPLATE_KEY_TYPES',
          uponReceiving: 'a request for getting template key types',
          withRequest: {
            method: service.getKeyTypesRequest().method,
            path: service.getKeyTypesRequest().url,
            // path: `/api/templating/registers`,
            // query: { type: 'schedulable' },
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

    it('should make request for fetching template key types', (done) => {
      service.getKeyTypes().subscribe((res) => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
