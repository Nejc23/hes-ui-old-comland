import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { OnDemandRequestData } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';

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
    service = getTestBed().get(MyGridLinkService);
  });

  const requestId = '0a09afe6-143e-4c9f-95dc-6f0b90f95455';
  const responseBody: OnDemandRequestData = {
    deviceId: '717d9fd6-478e-4c72-8a3a-0722d85a07b1',
    data: [
      {
        objectType: 'DisconnectorState',
        value: 'Disconnected'
      }
    ]
  };

  describe('myGrid.link get on demand data processing', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_GET_ON_DEMAND_DATA_PROCESSING',
          uponReceiving: 'a request for get on demand data processing of requested id from myGrid.link',
          withRequest: {
            method: service.getOnDemandDataProcessingRequest(requestId).method,
            path: service.getOnDemandDataProcessingRequest(requestId).url,
            body: null,
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

    it('should make request for get on demand data processing of requested id from myGrid.link', done => {
      service.geOnDemandDataProcessing(requestId).subscribe(
        (res: OnDemandRequestData) => {
          expect(res).toEqual(responseBody);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
