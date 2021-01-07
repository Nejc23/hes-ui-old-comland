import { DcLastStatusResponse } from './../../../../src/app/core/repository/interfaces/data-concentrator-units/dcu-operations/dcu-operations-params.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { LastStatus } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';
import { DataConcentratorUnitsOperationsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units-operations.service';

describe('Pact consumer test', () => {
  let provider;
  let service: DataConcentratorUnitsOperationsService;

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
    service = getTestBed().inject(DataConcentratorUnitsOperationsService);
  });

  const requestId = '0a09afe6-143e-4c9f-95dc-6f0b90f95455';
  const responseBody: DcLastStatusResponse = {
    requestId: 'acb1fd6f-62ca-461c-a22e-368dabb7cb22',
    tasks: [
      {
        taskId: '3361ca8e-78d5-45b4-a3d7-bbb121039c86',
        status: {
          attemptId: '0ff2070f-0ca7-41cb-8c87-12cb5cca4af7',
          timestamp: '2020-12-02T14:34:05.9052227+01:00',
          status: 'TASK_SUCCESS',
          description: ''
        }
      }
    ]
  };

  describe('dcu operations get last status', () => {
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_DCU_OPERATIONS_GET_LAST_STATUS',
          uponReceiving: 'a request for get last status of requested id for dcu operations',
          withRequest: {
            method: service.getDcLastStatusRequest(requestId).method,
            path: service.getDcLastStatusRequest(requestId).url,
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request for get last status of requested id from dcu operations', (done) => {
      service.getDcLastStatus(requestId).subscribe(
        (res: DcLastStatusResponse) => {
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
