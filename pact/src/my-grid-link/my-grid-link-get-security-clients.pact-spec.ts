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
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { SecurityClient } from 'src/app/core/repository/interfaces/templating/security-client.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: MyGridLinkService;

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
    service = getTestBed().inject(MyGridLinkService);
  });

  describe('Get security clients', () => {
    const responseBody: SecurityClient[] = [
      {
        deviceId: 'ec2c5457-6ebc-48a1-a6a7-07b44937fc69',
        registerDefinitionId: '37d0f05a-9525-4076-9b2c-c5897385b180',
        registerName: 'Enable HLS',
        registerType: 'MANAGEMENT_SECURITY_SETUP'
      },
      {
        deviceId: 'd8a7c035-35ed-49f2-879e-0917eb1f56fe',
        registerDefinitionId: '37d0f05a-9525-4076-9b2c-c5897385b180',
        registerName: 'Enable HLS',
        registerType: 'MANAGEMENT_SECURITY_SETUP'
      },
      {
        deviceId: 'fb8c097a-2088-4d1e-8107-130a89eee156',
        registerDefinitionId: '37d0f05a-9525-4076-9b2c-c5897385b180',
        registerName: 'Enable HLS',
        registerType: 'MANAGEMENT_SECURITY_SETUP'
      }
    ];

    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GETTIING_SECURITY_CLIENTS',
          uponReceiving: 'a request for getting security clients',
          withRequest: {
            method: service.getSecurityClientsRequest().method,
            path: service.getSecurityClientsRequest().url,
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

    it('should make request for getting security clients', (done) => {
      service.getSecurityClients().subscribe((res) => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
