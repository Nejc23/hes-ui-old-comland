import {
  RequestMeterUnitsForJob,
  ResponseMeterUnitsForJob
} from '../../../src/app/core/repository/interfaces/meter-units/meter-units-for-job.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { enumSearchFilterOperators } from 'src/environments/config';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';

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
    const requestBody: RequestMeterUnitsForJob = {
      requestId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
      scheduleId: 'b1f43f43-7552-417d-859d-2aa9e72980bc',
      typeId: null,
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
        showChildInfoMBus: null,
        showOptionFilter: null
      }
    };

    const responseBody: ResponseMeterUnitsForJob = {
      jobDescription: 'Reading job 1',
      grid: {
        totalCount: 3,
        summary: '',
        groupCount: 0,
        data: [
          {
            id: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
            name: 'Cubis PLC temp 520',
            vendor: 'Landis+Gy',
            id5: 'ID-12345'
          },
          {
            id: 'ebeacc9d-744c-4a88-bb9c-625216ab99b9',
            name: 'Cubis PLC temp 423',
            vendor: 'Landis+Gy',
            id5: 'ID-12345'
          },
          {
            id: 'ebeacc9d-744c-4a88-bb9c-625216ab99b9',
            name: 'Cubis PLC temp 642',
            vendor: 'Landis+Gy',
            id5: 'ID-12345'
          }
        ]
      }
    };

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_ALL_METER_UNITS_FOR_JOB',
          uponReceiving: 'a request for getting all meter units for job',
          withRequest: {
            method: service.getGridMeterUnitsForJobRequest(requestBody).method,
            path: service.getGridMeterUnitsForJobRequest(requestBody).url,
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

    it('should make request for fetching all meter units for job', done => {
      service.getGridMeterUnitsForJob(requestBody).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
