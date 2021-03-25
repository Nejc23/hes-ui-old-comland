import { AlarmingService } from './../../../src/app/core/repository/services/alarming/alarming.service';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';
import { enumSearchFilterOperators } from 'src/environments/config';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { IActionRequestParams, IActionRequestParamsAlarms } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { IAlarmsList } from 'src/app/core/repository/interfaces/alarming/alarms-list.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: AlarmingService;

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
    service = getTestBed().inject(AlarmingService);
  });

  describe('Alarms list get request', () => {
    const requestBody: IActionRequestParamsAlarms = {
      pageSize: 20,
      pageNumber: 1,
      filter: [
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
      sort: [
        {
          index: 0,
          propName: 'Firmware',
          sortOrder: 'Ascending'
        }
      ],
      textSearch: {
        value: 'search text',
        propNames: ['status'],
        useWildcards: true
      },
      startTime: '2021-01-15T00:00:00+02:00',
      endTime: '2021-01-17T00:00:00+02:00'
    };

    const data: IAlarmsList[] = [
      {
        alarmId: '6997F403-23D0-437C-372A-08D8B8782BCB',
        deviceId: '2A14D2B3-2F7F-4E9A-9F33-B26DA1021BD4',
        alarmTimeStamp: '2021-01-15T00:00:00+02:00',
        eventId: 1,
        severityId: 0,
        severityValue: 'HIGH',
        sourceId: '12345678',
        sourceTypeId: 1,
        sourceTypeValue: 'METER',
        protocolId: 2,
        protocolValue: 'DLMS',
        description: 'Cover opened',
        manufacturer: 'LGZ'
      },
      {
        alarmId: '1D47A5BC-ED65-4A4A-372B-08D8B8782BCB',
        deviceId: '2A14D2B3-2F7F-4E9A-9F33-B26DA1021BD4',
        alarmTimeStamp: '2021-01-15T00:00:00+02:00',
        eventId: 64,
        severityId: 1,
        severityValue: 'MEDIUM',
        sourceId: '12345679',
        sourceTypeId: 1,
        sourceTypeValue: 'METER',
        protocolId: 2,
        protocolValue: 'DLMS',
        description: 'The meter fell off the wall',
        manufacturer: 'ESR'
      }
    ];

    const responseBody: GridResponse<IAlarmsList> = {
      data,
      totalCount: 2,
      summary: '',
      groupCount: 0
    };

    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_ALARMS_LIST',
          uponReceiving: 'a request for getting alarms list',
          withRequest: {
            method: service.getGridAlarmsRequest(requestBody).method,
            path: service.getGridAlarmsRequest(requestBody).url,
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request for fetching alarms list', (done) => {
      service.getGridAlarms(requestBody).subscribe((res) => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
