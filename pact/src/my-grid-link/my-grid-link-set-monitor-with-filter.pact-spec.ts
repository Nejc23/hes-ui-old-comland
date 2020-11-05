import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ResponseSetMonitor, RequestSetMonitor } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';

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

  const requestBody: RequestSetMonitor = {
    deviceIds: null,
    filter: {
      statuses: [{ id: 1, value: 'active' }],
      readStatus: {
        operation: { id: 'Greater Than', value: 'Greater Than' },
        value1: 12,
        value2: null
      },
      vendors: [{ id: 2, value: 'Vendor 2' }],
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
      showOptionFilter: [{ id: 2, value: 'Without template' }]
    },
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
    deviceIds: null,
    filter: {
      statuses: [{ id: 1, value: 'active' }],
      readStatus: {
        operation: { id: 'Greater Than', value: 'Greater Than' },
        value1: 12,
        value2: null
      },
      vendors: [{ id: 2, value: 'Vendor 2' }],
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
      showOptionFilter: [{ id: 2, value: 'Without template' }]
    },
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

  describe('myGrid.link set monitor with filter request', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_FOR_SET_MONITOR_WITH_FILTER',
          uponReceiving: 'a request for setting monitor with filter in request - myGrid.Link',
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
          err => {
            done.fail(err);
          }
        );
    });

    it('should make request for setting monitor with filter in request - myGrid.Link', done => {
      service.setMonitor(requestBody).subscribe(
        (res: ResponseSetMonitor) => {
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
