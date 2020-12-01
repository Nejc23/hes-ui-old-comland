import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { IActionRequestParams, IActionResponseParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: MyGridLinkService;

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
    service = getTestBed().inject(MyGridLinkService);
  });

  describe('Data concentrator management activate device upgrade request', () => {
    const requestBody: IActionRequestParams = {
      pageSize: 1,
      pageNumber: 1,
      sort: [
        {
          index: 0,
          propName: 'Firmware',
          sortOrder: 'Ascending'
        }
      ],
      textSearch: {
        value: '',
        propNames: [],
        useWildcards: false
      },
      deviceIds: ['2e9a0af2-cc88-43e0-9dfd-4cb1d7457ed6', 'd4c180db-f5f2-4c99-937e-9b92200d5526']
    };

    const responseBody: IActionResponseParams = {
      requestId: 'ceb64f17-1d49-4532-830f-55c15e1b88ff',
      deviceIds: ['2e9a0af2-cc88-43e0-9dfd-4cb1d7457ed6', 'd4c180db-f5f2-4c99-937e-9b92200d5526'],
      pageSize: 1,
      pageNumber: 1,
      sort: [
        {
          index: 0,
          propName: 'Firmware',
          sortOrder: 'Ascending'
        }
      ],
      textSearch: {
        value: '',
        propNames: [],
        useWildcards: false
      }
    };

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_ACTIVATE_DEVICE_UPGRADE',
          uponReceiving: 'a request for activate device uprade',
          withRequest: {
            method: service.activateDeviceUpgradeRequest(requestBody).method,
            path: service.activateDeviceUpgradeRequest(requestBody).url,
            body: requestBody,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 200,
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

    it('should make request for activating device upgrade', done => {
      service.activateDeviceUpgrade(requestBody).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
