import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { IActionRequestRelaysMode, IActionResponseRelaysMode } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';

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

  const requestBody: IActionRequestRelaysMode = {
    relayMode: [
      {
        relayGroupId: 'relay 1',
        relayMode: 1
      },
      {
        relayGroupId: 'relay 2',
        relayMode: 2
      }
    ],
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
      propNames: []
    },
    deviceIds: ['0A4A1AE4-3964-47D3-9E38-C017833FFE0C', 'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E', '15A607EA-DEB7-46E5-BD5D-F8A067AD2842']
  };

  const responseBody: IActionResponseRelaysMode = {
    relayMode: [
      {
        relayGroupId: 'relay 1',
        relayMode: 1
      },
      {
        relayGroupId: 'relay 2',
        relayMode: 2
      }
    ],
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
      propNames: []
    },
    requestId: 'cca9906e-929b-4104-ab54-f866df79b632',
    deviceIds: ['0A4A1AE4-3964-47D3-9E38-C017833FFE0C', 'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E', '15A607EA-DEB7-46E5-BD5D-F8A067AD2842']
  };

  describe('myGrid.link trigger relays set device mode with device ids', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_FOR_TRIGGER_RELAYS_SET_DEVICE_MODE_WITH_IDS',
          uponReceiving: 'a request for trigger relays set device mode with ids in request - myGrid.Link',
          withRequest: {
            method: service.setRelaysModeRequest(requestBody).method,
            path: service.setRelaysModeRequest(requestBody).url,
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

    it('should make request for trigger relays set device mode with ids in request - myGrid.Link', done => {
      service.setRelaysMode(requestBody).subscribe(
        (res: IActionResponseRelaysMode) => {
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
