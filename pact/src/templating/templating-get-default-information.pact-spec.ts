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

  describe('Template default information', () => {
    const templateId = '7fb32618-d93e-4ee7-892d-b5df222ba733';

    const responseBody: GetDefaultInformationResponse = {
      advancedInformation: {
        advancedInformationId: '523d6ed9-d06e-4c63-9606-29e858a7caa3',
        templateId: '7fb32618-d93e-4ee7-892d-b5df222ba733',
        advancedInformation: {
          startWithRelease: true,
          ldnAsSystitle: true,
          authenticationType: 3
        }
      },
      hdlcInformation: {
        hdlcInformationId: '360d2243-8c8c-4c59-bdb4-f61722991cd9',
        templateId: '7fb32618-d93e-4ee7-892d-b5df222ba733',
        hdlcInformation: {
          clientLow: 1,
          serverLow: 1,
          clientHigh: 1,
          serverHigh: 1,
          publicClientLow: 1,
          publicServerLow: 1,
          publicClientHigh: 1,
          publicServerHigh: 1
        }
      },
      wrapperInformation: {
        wrapperInformationId: '4d7624e0-1b38-4934-b743-c1d685d3668a',
        templateId: '7fb32618-d93e-4ee7-892d-b5df222ba733',
        wrapperInformation: {
          clientAddress: 1,
          serverAddress: 1,
          publicClientAddress: 1,
          publicServerAddress: 16,
          physicalAddress: 1
        }
      }
    };

    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GETTIING_TEMPLATE_DEFAULT_INFORMATION',
          uponReceiving: 'a request for getting meter unit registers',
          withRequest: {
            method: service.getDefaultValuesRequest(templateId).method,
            path: service.getDefaultValuesRequest(templateId).url,
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

    it('should make request for fetching template default information', (done) => {
      service.getDefaultValues(templateId).subscribe((res) => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
