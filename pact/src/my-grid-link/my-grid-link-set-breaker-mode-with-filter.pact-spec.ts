import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import {
  ResponseSetMonitor,
  RequestSetMonitor,
  RequestSetBreakerMode,
  ResponseSetBreakerMode
} from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';

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

  const requestBody: RequestSetBreakerMode = {
    deviceIds: null,
    filter: {
      statuses: [{ id: 1, value: 'active' }],
      readStatus: {
        operation: { id: 'Greater Than', value: 'Greater Than' },
        value1: 12,
        value2: null
      },
      vendor: { id: 2, value: 'Vendor 2' },
      tags: [
        { id: 1, value: 'tag1' },
        { id: 2, value: 'tag2' }
      ],
      firmware: [{ id: 1, value: '12.3.1' }],
      disconnectorState: [
        { id: 1, value: 'breaker 1' },
        { id: 5, value: 'breaker 5' }
      ],
      showChildInfoMBus: true,
      showDeleted: true
    },
    search: [{ colId: 'all', type: 'like', value: 'name' }],
    excludeIds: [],
    breakerMode: 1
  };

  const responseBody: ResponseSetBreakerMode = {
    requestId: 'cca9906e-929b-4104-ab54-f866df79b632',
    deviceIds: null,
    filter: {
      statuses: [{ id: 1, value: 'active' }],
      readStatus: {
        operation: { id: 'Greater Than', value: 'Greater Than' },
        value1: 12,
        value2: null
      },
      vendor: { id: 2, value: 'Vendor 2' },
      tags: [
        { id: 1, value: 'tag1' },
        { id: 2, value: 'tag2' }
      ],
      firmware: [{ id: 1, value: '12.3.1' }],
      disconnectorState: [
        { id: 1, value: 'breaker 1' },
        { id: 5, value: 'breaker 5' }
      ],
      showChildInfoMBus: true,
      showDeleted: true
    },
    search: [{ colId: 'all', type: 'like', value: 'name' }],
    excludeIds: [],
    breakerMode: 1
  };

  describe('myGrid.link set breaker mode with filter request', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_FOR_SET_BREAKER_MODE_WITH_FILTER',
          uponReceiving: 'a request for setting breaker mode with filter in request - myGrid.Link',
          withRequest: {
            method: service.setBreakerModeRequest(requestBody).method,
            path: service.setBreakerModeRequest(requestBody).url,
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

    it('should make request for setting breaker mode with filter in request - myGrid.Link', done => {
      service.setBreakerMode(requestBody).subscribe(
        (res: ResponseSetBreakerMode) => {
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
