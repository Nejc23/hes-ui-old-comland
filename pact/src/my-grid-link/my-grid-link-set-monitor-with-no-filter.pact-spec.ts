import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ResponseSetMonitor, RequestSetMonitor } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';

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

  const requestBody: RequestSetMonitor = {
    deviceIds: ['0A4A1AE4-3964-47D3-9E38-C017833FFE0C', 'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E', '15A607EA-DEB7-46E5-BD5D-F8A067AD2842'],
    filter: null,
    monitorObjects: [
      {
        name: 'Phase 1',
        threshold: 50
      },
      {
        name: 'Phase 2',
        threshold: 150
      },
      {
        name: 'Phase 3',
        threshold: 983
      }
    ]
  };

  const responseBody: ResponseSetMonitor = {
    requestId: 'cca9906e-929b-4104-ab54-f866df79b632',
    deviceIds: ['0A4A1AE4-3964-47D3-9E38-C017833FFE0C', 'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E', '15A607EA-DEB7-46E5-BD5D-F8A067AD2842'],
    filter: null,
    monitorObjects: [
      {
        name: 'Phase 1',
        threshold: 50
      },
      {
        name: 'Phase 2',
        threshold: 150
      },
      {
        name: 'Phase 3',
        threshold: 983
      }
    ]
  };

  describe('myGrid.link set monitor with device ids request', () => {
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_FOR_SET_MONITOR_WITH_DEVICE_IDS',
          uponReceiving: 'a request for setting monitor with device ids in request - myGrid.Link',
          withRequest: {
            method: service.setMonitorRequest(requestBody).method,
            path: service.setMonitorRequest(requestBody).url,
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request for setting monitor with device ids in request - myGrid.Link', (done) => {
      service.setMonitor(requestBody).subscribe(
        (res: ResponseSetMonitor) => {
          expect(res).toEqual(responseBody);
          done();
        },
        (err) => {
          done.fail(err);
        }
      );
    });
  });
});
