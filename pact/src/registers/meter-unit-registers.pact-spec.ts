import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import * as _ from 'lodash';
import { RegistersSelectService } from 'src/app/core/repository/services/registers-select/registers-select.service';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: RegistersSelectService;

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
    service = getTestBed().inject(RegistersSelectService);
  });

  describe('Meter unit registers', () => {
    const requestBody: GridBulkActionRequestParams = {
      id: [],
      filter: {
        statuses: [
          {
            id: 0,
            value: ''
          }
        ],
        tags: [
          {
            id: 0,
            value: ''
          }
        ],
        vendors: [
          {
            id: 0,
            value: ''
          }
        ],
        readStatus: {
          operation: {
            id: '',
            value: ''
          },
          value1: 0,
          value2: null
        },
        firmware: [
          {
            id: 0,
            value: ''
          }
        ],
        disconnectorState: [
          {
            id: 0,
            value: ''
          }
        ],
        showChildInfoMBus: false,
        showOptionFilter: [{ id: 2, value: 'Without template' }]
      }
    };

    const responseBody: RegistersSelectList[] = [
      {
        id: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        name: 'Register abc 1',
        type: 'type A',
        description: 'description 1'
      },
      {
        id: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b00',
        name: 'Register def 2',
        type: 'type B',
        description: 'description 2'
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe54',
        name: 'Register def 3',
        type: 'type B',
        description: 'description 3'
      }
    ];

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_METER_UNIT_REGISTERS',
          uponReceiving: 'a request for getting meter unit registers',
          withRequest: {
            method: service.getDeviceRegistersRequest(requestBody).method,
            path: `/api/device-inventory-ui/registers`, // service.getDeviceRegistersRequest(requestBody).url,
            query: { '': 'data' },
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 200,
            headers: defaultResponseHeader,
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

    it('should make request for fetching meter unit registers', done => {
      service.getDeviceRegisters(requestBody).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
