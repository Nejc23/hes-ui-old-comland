import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { enumSearchFilterOperators } from 'src/environments/config';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: DataConcentratorUnitsService;

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
    service = getTestBed().inject(DataConcentratorUnitsService);
  });

  describe('Data concentrator units list get request', () => {
    const requestBody: GridRequestParams = {
      requestId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
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
        types: [1, 2],
        vendor: { id: 2, value: 'Vendor 2' },
        tags: [
          { id: 1, value: 'tag1' },
          { id: 2, value: 'tag2' }
        ],
        showOptionFilter: null
      }
    };

    const data: DataConcentratorUnitsList[] = [
      {
        concentratorId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
        status: 'Active',
        name: 'Cubis PLC temp 520',
        meters: 102,
        metersPercent: 93.4,
        metersUp: false,
        readStatusTimeStamp: '2020-05-05T03:21:19',
        readStatusColor: 'green',
        type: 'G0-PLC',
        vendor: 'Landis+Gy',
        id: '771929394001',
        ip: '234.88.127.4',
        lastCommunication: '2020-02-21T07:03:02',
        tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8', 'tag 05', 'tag 572'],
        jobStatus: 'Success',
        hasActiveJob: true
      },
      {
        concentratorId: 'ebeacc9d-744c-4a88-bb9c-625216ab99b9',
        status: 'Active',
        name: 'Cubis PLC temp 423',
        meters: 45,
        metersPercent: 32.3,
        metersUp: true,
        readStatusTimeStamp: '2020-01-16T23:00:03',
        readStatusColor: 'red',
        type: 'G0-PLC',
        vendor: 'Iskra',
        id: '210808585671',
        ip: null,
        lastCommunication: '2020-02-19T07:03:02',
        tags: null,
        jobStatus: 'Failed',
        hasActiveJob: true
      },
      {
        concentratorId: 'dewee32-744c-4a88-bb9c-625216ab99b9',
        status: 'Active',
        name: 'Cubis PLC temp 3423',
        meters: null,
        metersPercent: null,
        metersUp: null,
        readStatusTimeStamp: '2020-03-31T14:30:33',
        readStatusColor: 'yellow',
        type: 'G0-PLC',
        vendor: 'Iskra',
        id: '452804585671',
        ip: '932.32.32.2',
        lastCommunication: '2020-05-12T19:18:39',
        tags: null,
        jobStatus: 'Running',
        hasActiveJob: false
      }
    ];

    const responseBody: GridResponse<DataConcentratorUnitsList> = {
      data,
      totalCount: 2,
      summary: '',
      groupCount: 0
    };

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_DATA_CONCENTRATOR_UNITS',
          uponReceiving: 'a request for getting data concentrator units',
          withRequest: {
            method: service.getGridDcuRequest(requestBody).method,
            path: service.getGridDcuRequest(requestBody).url,
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

    it('should make request for fetching data concentrator units', done => {
      service.getGridDcu(requestBody).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
