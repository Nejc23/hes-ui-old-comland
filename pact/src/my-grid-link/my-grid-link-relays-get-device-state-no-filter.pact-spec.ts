import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { IActionRequestRelays, IActionResponseRelays } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';

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

  const requestBody: IActionRequestRelays = {
    RelaysObjects: ['relay 1', 'relay 2'],
    pageSize: 1,
    pageNumber: 1,
    sort: [
      {
        index: 0,
        propName: 'Firmware',
        sortOrder: 'Ascending'
      }
    ],
    textSearch: '',
    deviceIds: ['0A4A1AE4-3964-47D3-9E38-C017833FFE0C', 'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E', '15A607EA-DEB7-46E5-BD5D-F8A067AD2842']
  };

  const responseBody: IActionResponseRelays = {
    RelaysObjects: ['relay 1', 'relay 2'],
    pageSize: 1,
    pageNumber: 1,
    sort: [
      {
        index: 0,
        propName: 'Firmware',
        sortOrder: 'Ascending'
      }
    ],
    textSearch: '',
    requestId: 'cca9906e-929b-4104-ab54-f866df79b632',
    deviceIds: ['0A4A1AE4-3964-47D3-9E38-C017833FFE0C', 'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E', '15A607EA-DEB7-46E5-BD5D-F8A067AD2842']
  };

  describe('myGrid.link trigger relays get device state with device ids', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_FOR_TRIGGER_RELAYS_GET_DEVICE_STATE_WITH_IDS',
          uponReceiving: 'a request for trigger relays get device state with ids in request - myGrid.Link',
          withRequest: {
            method: service.getRelaysStateRequest(requestBody).method,
            path: service.getRelaysStateRequest(requestBody).url,
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

    it('should make request for trigger relays get device state with ids in request - myGrid.Link', done => {
      service.getRelaysState(requestBody).subscribe(
        (res: IActionResponseRelays) => {
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
