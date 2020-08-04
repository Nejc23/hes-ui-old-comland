import {
  DcuManagementActivateTriggerDeviceUpgradeRequest,
  DcuManagementActivateTriggerDeviceUpgradeResponse
} from './../../../src/app/core/repository/interfaces/dcu-management/dcu-management-trigger-device-upgrade.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { DcuManagementService } from 'src/app/core/repository/services/dcu-management/dcu-management.service';

describe('Pact consumer test', () => {
  let provider;
  let service: DcuManagementService;

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
    service = getTestBed().get(DcuManagementService);
  });

  describe('Data concentrator management activate trigger device upgrade request', () => {
    const requestBody: DcuManagementActivateTriggerDeviceUpgradeRequest = {
      deviceIds: ['2e9a0af2-cc88-43e0-9dfd-4cb1d7457ed6', 'd4c180db-f5f2-4c99-937e-9b92200d5526']
    };

    const responseBody: DcuManagementActivateTriggerDeviceUpgradeResponse = {
      requestId: 'ceb64f17-1d49-4532-830f-55c15e1b88ff',
      deviceIds: ['2e9a0af2-cc88-43e0-9dfd-4cb1d7457ed6', 'd4c180db-f5f2-4c99-937e-9b92200d5526']
    };

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_ACTIVATE_TRIGGER_DEVICE_UPGRADE',
          uponReceiving: 'a request for activate trigger device uprade',
          withRequest: {
            method: service.activateTriggerDeviceUpgradeRequest(requestBody).method,
            path: service.activateTriggerDeviceUpgradeRequest(requestBody).url,
            body: requestBody,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 201,
            headers: {
              ...defaultResponseHeader
            },
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

    it('should make request for activating trigger device upgrade', done => {
      service.activateTriggerDeviceUpgrade(requestBody).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
