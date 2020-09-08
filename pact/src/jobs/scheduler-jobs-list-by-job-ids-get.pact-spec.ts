import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { SchedulerJobsList } from 'src/app/core/repository/interfaces/jobs/scheduler-jobs-list.interface';
import { enumSearchFilterOperators } from 'src/environments/config';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: JobsService;

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
    service = getTestBed().get(JobsService);
  });

  describe('Scheduler jobs list by job ids get request', () => {
    const requestBody: string[] = ['2323323-434-443--43-43-455', '2323323-434-443--43-43-3332'];

    const data: SchedulerJobsList[] = [
      {
        id: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Daily read of 15 min energy (A+)',
        nextRun: '2020-08-25T15:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 3
      },
      {
        id: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b00',
        active: true,
        type: 'Discovery',
        actionType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2021-07-26T05:45:45+00:00',
        owner: 'Miha Galičič',
        deviceCount: 3
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe54',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2022-07-28T12:45:45+00:00',
        owner: 'Jan Benedičič',
        deviceCount: 0
      },
      {
        id: 'c129f32f-33f8-4917-a190-53dfe388cc6d',
        active: true,
        type: 'Discovery',
        actionType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2021-08-28T12:45:45+00:00',
        owner: 'Miha Galičič',
        deviceCount: 1
      },
      {
        id: '5f128531-0bce-46f9-b8df-264d8a3945fb',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2023-09-28T18:05:05+02:00',
        owner: 'Jan Benedičič',
        deviceCount: 0
      },
      {
        id: '2eee0a94-cb09-4334-b36f-796ef0e08983',
        active: false,
        type: 'Disovery',
        actionType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2023-07-28T15:08:05+02:00',
        owner: 'Miha Galičič',
        deviceCount: 3
      },
      {
        id: '6f3c7dc9-784e-4d8f-b6dc-913f116e94a6',
        active: true,
        type: 'Reading',
        actionType: 4,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2023-11-18T11:19:25+01:00',
        owner: 'Jan Benedičič',
        deviceCount: 2
      },
      {
        id: '845d8f84-705a-44bd-a5e1-e27cb705ecfc',
        active: false,
        type: 'Discovery',
        actionType: 1,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: '2025-11-18T09:17:25+01:00',
        owner: 'Miha Galičič',
        deviceCount: 12
      }
    ];

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_SCHEDULED_JOBS_LIST_BY_JOB_IDs',
          uponReceiving: 'a request for getting scheduled jobs list by job ids',
          withRequest: {
            method: service.getSchedulerJobsListByJobIdRequest(requestBody).method,
            path: service.getSchedulerJobsListByJobIdRequest(requestBody).url,
            body: requestBody,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 200,
            headers: {
              ...defaultResponseHeader
            },
            body: data
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

    it('should make request for fetching scheduled jobs list by job ids', done => {
      service.getSchedulerJobsListByJobId(requestBody).subscribe(res => {
        expect(res).toEqual(data);
        done();
      });
    });
  });
});
