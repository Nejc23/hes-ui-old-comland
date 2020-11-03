import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { LastStatus } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';

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

  const requestId = '0a09afe6-143e-4c9f-95dc-6f0b90f95455';
  const responseBody: LastStatus[] = [
    {
      requestId: '0a09afe6-143e-4c9f-95dc-6f0b90f95455',
      timestamp: '2020-03-17T16:14:15.7854196+00:00',
      status: 'TASK_PREREQ_FAILURE',
      isFinished: true,
      id: '0a4a1ae4-3964-47d3-9e38-c017833ffe0c',
      description: 'DEVICE_NOT_FOUND'
    },
    {
      requestId: '0a09afe6-143e-4c9f-95dc-6f0b90f95455',
      timestamp: '2020-03-17T16:14:15.7854196+00:00',
      status: 'TASK_SUCCESS',
      isFinished: true,
      id: '0a4a1ae4-3964-47d3-9e38-c017833ffe0c',
      description: 'DEVICE_NOT_FOUND'
    }
  ];

  describe('myGrid.link get last status', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_GET_LAST_STATUS',
          uponReceiving: 'a request for get last status of requested id from myGrid.link',
          withRequest: {
            method: service.getMyGridLastStatusRequest(requestId).method,
            path: service.getMyGridLastStatusRequest(requestId).url,
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

    it('should make request for get last status of requested id from myGrid.link', done => {
      service.getMyGridLastStatus(requestId).subscribe(
        (res: LastStatus[]) => {
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
