import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/gris-request-params.interface';
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
    service = getTestBed().get(DataConcentratorUnitsService);
  });

  describe('Data concentrator units list get request', () => {
    const requestBody: GridRequestParams = {
      requireTotalCount: true,
      skip: 0,
      take: 50,
      search: [
        {
          selector: 'all',
          value: 'search text'
        }
      ],
      sort: [
        {
          selector: 'name',
          desc: false
        }
      ],
      filter: [
        {
          selector: 'typeId',
          operation: enumSearchFilterOperators.notEqual,
          value: '32'
        },
        {
          selector: 'statusId',
          operation: enumSearchFilterOperators.equal,
          value: '4'
        },
        {
          selector: 'tagId',
          operation: enumSearchFilterOperators.equal,
          value: '2'
        },
        {
          selector: 'tagId',
          operation: enumSearchFilterOperators.equal,
          value: '3'
        },
        {
          selector: 'vendorId',
          operation: enumSearchFilterOperators.equal,
          value: '323'
        }
      ]
    };

    const data: DataConcentratorUnitsList[] = [
      {
        id: 30887,
        status: 'Active',
        nextRead: null,
        name: 'Cubis PLC temp 520',
        metersValue: 102,
        metersPercent: 93.4,
        metersUp: false,
        readStatusPercent: 93.5,
        type: 'G0-PLC',
        vendor: 'Landis+Gy',
        idNumber: '771929394001',
        ip: '234.88.127.4',
        lastCommunication: '2020-02-21T07:03:02',
        tags: ['tag 31', 'tag 32', 'tag 432', 'tag 8', 'tag 05', 'tag 572']
      },
      {
        id: 49454,
        status: 'Active',
        nextRead: '2020-03-03T15:35:29',
        name: 'Cubis PLC temp 423',
        metersValue: null,
        metersPercent: null,
        metersUp: null,
        readStatusPercent: 99.3,
        type: 'G0-PLC',
        vendor: 'Iskra',
        idNumber: '210808585671',
        ip: null,
        lastCommunication: '2020-02-19T07:03:02',
        tags: null
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

    it('should make request for fetching data concentrator units', done => {
      service.getGridDcu(requestBody).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
