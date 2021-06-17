import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { SchedulerJob } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';

describe('Pact consumer test', () => {
  let provider;
  let service: JobsService;

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
    service = getTestBed().inject(JobsService);
  });

  const typeId = 1;
  const requestBody: SchedulerJob = {
    registers: ['guid-1', 'guid-4', 'guid-5'],
    jobType: 'scheduledReading',

    active: false,

    description: 'description',
    cronExpression: '0 1 0 * * ? *',
    devices: {
      id: ['40dded4e-1893-4521-80d0-226e3f5ae0f8', 'ad27b761-8bde-4ea8-a380-3d5cefb06f73', '4e1bef62-230a-4f46-a5cf-a869c830669a'],
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
        showOptionFilter: null
      }
    }
  };

  const responseBody: SchedulerJob = {
    registers: ['guid-1', 'guid-4', 'guid-5'],
    jobType: 'scheduledReading',

    active: false,

    description: 'description',
    cronExpression: '0 1 0 * * ? *',
    devices: {
      id: ['40dded4e-1893-4521-80d0-226e3f5ae0f8', 'ad27b761-8bde-4ea8-a380-3d5cefb06f73', '4e1bef62-230a-4f46-a5cf-a869c830669a'],
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
        showOptionFilter: null
      }
    }
  };

  describe('Meter units read scheduler', () => {
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_CREATE_METER_UNITS_READ_SCHEDULER',
          uponReceiving: 'a request for creating meter units read scheduler',
          withRequest: {
            method: service.createSchedulerJobRequest(requestBody).method,
            path: service.createSchedulerJobRequest(requestBody).url,
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

    it('should make request for creating meter units read scheduler', (done) => {
      service.createSchedulerJob(requestBody).subscribe(
        (res: SchedulerJob) => {
          expect(requestBody).toEqual(responseBody);
          done();
        },
        (err) => {
          done.fail(err);
        }
      );
    });
  });
});
