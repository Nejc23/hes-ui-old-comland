import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { enumSearchFilterOperators } from 'src/environments/config';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MeterUnitsList } from 'src/app/core/repository/interfaces/meter-units/meter-units-list.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: MeterUnitsService;

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
    service = getTestBed().inject(MeterUnitsService);
  });

  describe('Meter units list get request', () => {
    const requestBody: GridRequestParams = {
      requestId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
      typeId: 1,
      startRow: 0,
      endRow: 19,
      searchModel: [
        {
          colId: 'all',
          type: enumSearchFilterOperators.like,
          value: 'search text'
        }
      ],
      sortModel: [
        {
          colId: 'name',
          sort: 'desc'
        }
      ],
      filterModel: {
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
        ciiState: [
          { id: 0, value: 'on' },
          { id: 1, value: 'off' }
        ],
        showChildInfoMBus: true,
        showDeleted: true
      }
    };

    const data: MeterUnitsList[] = [
      {
        deviceId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
        status: 'Active',
        name: 'Cubis PLC temp 520',
        readStatusTimeStamp: '2020-05-05T03:21:19',
        readStatusColor: 'green',
        vendor: 'Landis+Gy',
        tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8', 'tag 05', 'tag 572'],
        disconnectorState: 'connected',
        childInfo: 12345,
        firmware: 'FM-123',
        id5: 'ID-12345',
        meterId: '123456',
        moduleId: '22222',
        parent: '77777',
        timeOfUseId: '5555',
        jobStatus: 'Success',
        configurationId: 'conf1',
        id1: 'id1',
        id2: 'id2',
        id3: 'id3',
        id4: 'id4',
        id6: 'id6',
        logicalDeviceName: 'device name 1',
        parametrisationId: 'param 1',
        readyForActivation: true,
        hasActiveJobs: false,
        ciiState: 'off'
      },
      {
        deviceId: 'ebeacc9d-744c-4a88-bb9c-625216ab99b9',
        status: 'Active',
        name: 'Cubis PLC temp 423',
        readStatusTimeStamp: '2020-03-15T03:21:19',
        readStatusColor: 'yellow',
        vendor: 'Landis+Gy',
        tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8'],
        disconnectorState: 'disconnected',
        childInfo: 12345,
        firmware: 'FM-223',
        id5: 'ID-12345',
        meterId: '1234456',
        moduleId: '22252',
        parent: '774777',
        timeOfUseId: '55455',
        jobStatus: 'Failed',
        configurationId: 'conf1',
        id1: 'id1',
        id2: 'id2',
        id3: 'id3',
        id4: 'id4',
        id6: 'id6',
        logicalDeviceName: 'device name 1',
        parametrisationId: 'param 1',
        readyForActivation: false,
        hasActiveJobs: true
      },
      {
        deviceId: 'ebeacc9d-744c-4a88-bb9c-625216ab99b9',
        status: 'Warehouse',
        name: 'Cubis PLC temp 642',
        readStatusTimeStamp: '2019-12-19T13:55:55',
        readStatusColor: 'red',
        vendor: 'Landis+Gy',
        tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8'],
        disconnectorState: 'disconnected',
        childInfo: 12345,
        firmware: 'FM-223',
        id5: 'ID-12345',
        meterId: '1234456',
        moduleId: '22252',
        parent: '774777',
        timeOfUseId: '55455',
        jobStatus: 'Running',
        configurationId: 'conf1',
        id1: 'id1',
        id2: 'id2',
        id3: 'id3',
        id4: 'id4',
        id6: 'id6',
        logicalDeviceName: 'device name 1',
        parametrisationId: 'param 1',
        readyForActivation: true,
        hasActiveJobs: true,
        ciiState: 'on'
      }
    ];

    const responseBody: GridResponse<MeterUnitsList> = {
      data,
      totalCount: 2,
      summary: '',
      groupCount: 0
    };

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_METER_UNITS',
          uponReceiving: 'a request for getting meter units',
          withRequest: {
            method: service.getGridMeterUnitsRequest(requestBody).method,
            path: service.getGridMeterUnitsRequest(requestBody).url,
            body: requestBody,
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

    it('should make request for fetching meter units', done => {
      service.getGridMeterUnits(requestBody).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
