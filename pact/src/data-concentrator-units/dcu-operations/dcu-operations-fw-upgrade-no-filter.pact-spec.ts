import {
  IActionRequestDcuFwUpgradeData,
  IActionResponseDcuFwUpgradeData
} from './../../../../src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { DataConcentratorUnitsOperationsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units-operations.service';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { IActionRequestTOUData, IActionResponseTOUData } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';

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
      propNames: [],
      useWildcards: false
    },
    concentratorIds: [
      '0A4A1AE4-3964-47D3-9E38-C017833FFE0C',
      'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E',
      '15A607EA-DEB7-46E5-BD5D-F8A067AD2842'
    ],
    image: '717D9FD6-478E-4C72-8A3A-0722D85A07B1'
  };

  const responseBody: IActionResponseDcuFwUpgradeData = {
    requestId: '6211423d-0d7d-4f49-ae02-d681e1f051d1'
  };

  describe('DCU operation for fw upgrade with ids in request', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_DCU_OPERATION_FOR_FW_UPGRADE_WITH_IDS_IN_REQUEST',
          uponReceiving: 'a request for trigger dcu operation for FW upgrade with ids in request',
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

    it('should make request for trigger dcu operation for FW upgrade with ids in request', done => {
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
