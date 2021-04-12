import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import * as _ from 'lodash';
import { RegistersSelectService } from 'src/app/core/repository/services/registers-select/registers-select.service';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { GridBulkActionRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-bulk-action-request-params.interface';
import { SchedulableRegistersResponse } from 'src/app/core/repository/interfaces/registers-select/schedulable-registers-response.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: RegistersSelectService;

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

    const responseBody: SchedulableRegistersResponse = {
      allHaveTemplate: true,
      templatelessDevices: null,
      schedulableRegistersType: [
        {
          name: 'loadprofilE1',
          isSelectable: true
        },
        {
          name: 'property',
          isSelectable: true
        }
      ]
    };

    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GETTING_SCHEDULABLE_REGISTERS',
          uponReceiving: 'a request for getting schedulable registers',
          withRequest: {
            method: service.getSchedulableRegistersRequest(requestBody).method,
            path: service.getSchedulableRegistersRequest(requestBody).url,
            // path: `/api/templating/registers`,
            // query: { type: 'schedulable' },
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request for getting schedulable registers', (done) => {
      service.getSchedulableRegisters(requestBody).subscribe((res) => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
