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

  const requestBody: IActionRequestParams = {
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
    textSearch: '1234'
  };

  const responseBody: IActionResponseParams = {
    requestId: 'cca9906e-929b-4104-ab54-f866df79b632',
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
    textSearch: '1234'
  };

  describe('myGrid.link get disconnector state with filter request', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_FOR_GET_DISCONNECTOR_STATE_WITH_FILTER',
          uponReceiving: 'a request for getting disconnector state with filter in request - myGrid.Link',
          withRequest: {
            method: service.getDisconnectorStateRequest(requestBody).method,
            path: service.getDisconnectorStateRequest(requestBody).url,
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

    it('should make request for getting disconnector state with filter in request - myGrid.Link', done => {
      service.getDisconnectorState(requestBody).subscribe(
        (res: IActionResponseParams) => {
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
