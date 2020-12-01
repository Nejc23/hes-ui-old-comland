import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import {
  IActionRequestSetDisconnectorMode,
  IActionResponseSetDisconnectorMode
} from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';

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

  const requestBody: IActionRequestSetDisconnectorMode = {
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
      propNames: ['vendor', 'firmware', 'status'],
      enableWildcards: false
    },
    deviceIds: ['0A4A1AE4-3964-47D3-9E38-C017833FFE0C', 'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E', '15A607EA-DEB7-46E5-BD5D-F8A067AD2842'],
    breakerMode: 1
  };

  const responseBody: IActionResponseSetDisconnectorMode = {
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
      propNames: ['vendor', 'firmware', 'status'],
      enableWildcards: true
    },
    requestId: 'cca9906e-929b-4104-ab54-f866df79b632',
    deviceIds: ['0A4A1AE4-3964-47D3-9E38-C017833FFE0C', 'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E', '15A607EA-DEB7-46E5-BD5D-F8A067AD2842'],
    breakerMode: 1
  };

  describe('myGrid.link set breaker mode with no filter request', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_FOR_SET_BREAKER_MODE_WITH_NO_FILTER',
          uponReceiving: 'a request for setting breaker mode with no filter in request - myGrid.Link',
          withRequest: {
            method: service.setDisconnectorModeRequest(requestBody).method,
            path: service.setDisconnectorModeRequest(requestBody).url,
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

    it('should make request for setting breaker mode with no filter in request - myGrid.Link', done => {
      service.setDisconnectorMode(requestBody).subscribe(
        (res: IActionResponseSetDisconnectorMode) => {
          expect(res.requestId).toEqual(responseBody.requestId);
          expect(res.deviceIds).toEqual(responseBody.deviceIds);
          expect(res.filter).toEqual(responseBody.filter);
          expect(res.breakerMode).toEqual(responseBody.breakerMode);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
