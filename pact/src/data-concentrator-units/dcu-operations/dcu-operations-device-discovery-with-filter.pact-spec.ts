import { DataConcentratorUnitsOperationsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units-operations.service';
import { IActionRequestParams } from './../../../../src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { ResponseData } from 'src/app/core/repository/interfaces/data-concentrator-units/dc-operation-simple.interface';

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
    textSearch: {
      value: '1234',
      propNames: ['vendor', 'firmware', 'status'],
      useWildcards: false
    }
  };

  const responseBody: ResponseData = {
    requestId: '6211423d-0d7d-4f49-ae02-d681e1f051d1',
    concentratorIds: [
      '0A4A1AE4-3964-47D3-9E38-C017833FFE0C',
      'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E',
      '15A607EA-DEB7-46E5-BD5D-F8A067AD2842'
    ]
  };

  describe('DCU operation for device discovery with filter in request', () => {
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_DCU_OPERATION_FOR_DEVICE_DISCOVERY_WITH_FILTER_IN_REQUEST',
          uponReceiving: 'a request for trigger dcu operation for device discovery with filter in request',
          withRequest: {
            method: service.postDcDeviceDiscoveryRequest(requestBody).method,
            path: service.postDcDeviceDiscoveryRequest(requestBody).url,
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request for trigger dcu operation for device discovery with filter in request', (done) => {
      service.postDcDeviceDiscovery(requestBody).subscribe(
        (res: ResponseData) => {
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
