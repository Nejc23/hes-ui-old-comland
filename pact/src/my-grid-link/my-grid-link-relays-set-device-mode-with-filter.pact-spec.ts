import { RelayMode } from './../../../src/app/core/repository/interfaces/myGridLink/action-prams.interface';
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
    filter: [
      {
        propName: 'Vendor',
        propValue: '2',
        filterOperation: 'Equal'
      },
      {
        propName: 'Status',
        propValue: '2',
        filterOperation: 'Equal'
      },
      {
        propName: 'Firmware',
        propValue: '2',
        filterOperation: 'Contains'
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
      value: '1234',
      propNames: ['vendor', 'firmware', 'status']
    }
  };

  const responseBody: IActionResponseRelaysMode = {
    requestId: 'cca9906e-929b-4104-ab54-f866df79b632',
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
    filter: [
      {
        propName: 'Vendor',
        propValue: '2',
        filterOperation: 'Equal'
      },
      {
        propName: 'Status',
        propValue: '2',
        filterOperation: 'Equal'
      },
      {
        propName: 'Firmware',
        propValue: '2',
        filterOperation: 'Contains'
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
      value: '1234',
      propNames: ['vendor', 'firmware', 'status']
    }
  };

  describe('myGrid.link trigger set device mode with filter request', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_FOR_TRIGGER_RELAYS_SET_DEVICE_MODE_WITH_FILTER',
          uponReceiving: 'a request for trigger relays set device mode with filter in request - myGrid.Link',
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

    it('should make request for trigger relays set device mode with filter in request - myGrid.Link', done => {
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
