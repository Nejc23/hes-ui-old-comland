import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MeterUnitsReadSchedule } from 'src/app/core/repository/interfaces/meter-units/meter-units-read-schedule.interface';

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
    service = getTestBed().get(MeterUnitsService);
  });

  const typeId = 1;
  const requestBody: MeterUnitsReadSchedule = {
    readOptions: 5,
    nMinutes: 0,
    nHours: 0,
    time: {
      hour: 13,
      minute: 18,
      second: 0
    },
    weekDays: [],
    monthDays: [1, 7, 31],
    registers: [1, 4, 5],
    bulkActionsRequestParam: {
      id: [262, 146, 304],
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
        vendor: {
          id: 0,
          value: ''
        },
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
        breakerState: [
          {
            id: 0,
            value: ''
          }
        ],
        showChildInfoMBus: false,
        showDeleted: false
      }
    }
  };

  const responseBody: MeterUnitsReadSchedule = {
    readOptions: 5,
    nMinutes: 0,
    nHours: 0,
    time: {
      hour: 13,
      minute: 18,
      second: 0
    },
    weekDays: [],
    monthDays: [1, 7, 31],
    registers: [1, 4, 5],
    bulkActionsRequestParam: {
      id: [262, 146, 304],
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
        vendor: {
          id: 0,
          value: ''
        },
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
        breakerState: [
          {
            id: 0,
            value: ''
          }
        ],
        showChildInfoMBus: false,
        showDeleted: false
      }
    }
  };

  describe('Meter units read scheduler', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_CREATE_METER_UNITS_READ_SCHEDULER',
          uponReceiving: 'a request for creating meter units read scheduler',
          withRequest: {
            method: service.createMeterUnitsReadSchedulerRequest(requestBody).method,
            path: service.createMeterUnitsReadSchedulerRequest(requestBody).url,
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

    it('should make request for creating meter units read scheduler', done => {
      service.createMeterUnitsReadScheduler(requestBody).subscribe(
        (res: MeterUnitsReadSchedule) => {
          expect(requestBody).toEqual(responseBody);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
