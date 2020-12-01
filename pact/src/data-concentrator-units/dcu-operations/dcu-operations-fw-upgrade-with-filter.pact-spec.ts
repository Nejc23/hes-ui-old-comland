import { DataConcentratorUnitsOperationsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units-operations.service';
import {
  IActionRequestDcuFwUpgradeData,
  IActionResponseDcuFwUpgradeData
} from './../../../../src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import {
  IActionRequestTOUData,
  IActionResponseTOUData,
  IActionResponseParams
} from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: DataConcentratorUnitsOperationsService;

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
    service = getTestBed().inject(DataConcentratorUnitsOperationsService);
  });

  const requestBody: IActionRequestDcuFwUpgradeData = {
    image: 'cca9906e-929b-4104-ab54-f866df79b633',
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
      propNames: ['vendor', 'firmware', 'status'],
      useWildcards: false
    }
  };

  const responseBody: IActionResponseDcuFwUpgradeData = {
    requestId: 'cca9906e-929b-4104-ab54-f866df79b632'
  };

  describe('DCU operation for fw upgrade with filter request', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_DCU_OPERATION_FOR_FW_UPGRADE_WITH_FILTER',
          uponReceiving: 'a request for trigger dcu operation for FW upgrade with filter in request',
          withRequest: {
            method: service.postDcFwUpgradeRequest(requestBody).method,
            path: service.postDcFwUpgradeRequest(requestBody).url,
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

    it('should make request for trigger dcu operation for FW upgrade with filter in request', done => {
      service.postDcFwUpgrade(requestBody).subscribe(
        (res: IActionResponseDcuFwUpgradeData) => {
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
