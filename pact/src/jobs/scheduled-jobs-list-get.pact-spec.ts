import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { ScheduledJobsList } from 'src/app/core/repository/interfaces/jobs/scheduled-jobs-list.interface';
import { enumSearchFilterOperators } from 'src/environments/config';
import { GridRequestParams } from 'src/app/core/repository/interfaces/helpers/gris-request-params.interface';
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

  describe('Scheduled jobs list get request', () => {
    const requestBody: GridRequestParams = {
      startRow: 0,
      endRow: 9,
      searchModel: [
        {
          colId: 'all',
          type: enumSearchFilterOperators.like,
          value: 'search text'
        }
      ],
      sortModel: [
        {
          colId: 'type',
          sort: 'desc'
        }
      ]
    };

    const data: ScheduledJobsList[] = [
      {
        id: '06130d62-f67c-41a2-98f7-ef521db2cee6',
        active: true,
        type: 'Reading',
        description: 'Daily read of 15 min energy (A+)',
        nextRun: 'In 15 minutes',
        owner: 'Jan Benedičič'
      },
      {
        id: 'eeb2b97c-4549-4f4b-a33f-77acb54a0b00',
        active: true,
        type: 'FW Upgrade',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 30 minutes',
        owner: 'Miha Galičič'
      },
      {
        id: 'aba5491a-be2b-4115-a64a-ff1c1fcdfe54',
        active: true,
        type: 'Reading',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 18 hours',
        owner: 'Jan Benedičič'
      },
      {
        id: 'c129f32f-33f8-4917-a190-53dfe388cc6d',
        active: true,
        type: 'FW Upgrade',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 1 day',
        owner: 'Miha Galičič'
      },
      {
        id: '5f128531-0bce-46f9-b8df-264d8a3945fb',
        active: true,
        type: 'Reading',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 1 day',
        owner: 'Jan Benedičič'
      },
      {
        id: '2eee0a94-cb09-4334-b36f-796ef0e08983',
        active: false,
        type: 'FW Upgrade',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 3 days',
        owner: 'Miha Galičič'
      },
      {
        id: '6f3c7dc9-784e-4d8f-b6dc-913f116e94a6',
        active: true,
        type: 'Reading',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 5 days',
        owner: 'Jan Benedičič'
      },
      {
        id: '845d8f84-705a-44bd-a5e1-e27cb705ecfc',
        active: false,
        type: 'FW Upgrade',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        nextRun: 'In 7 days',
        owner: 'Miha Galičič'
      }
    ];

    const responseBody: GridResponse<ScheduledJobsList> = {
      data,
      totalCount: 8,
      summary: '',
      groupCount: 0
    };

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_SCHEDULED_JOBS_LIST',
          uponReceiving: 'a request for getting scheduled jobs list',
          withRequest: {
            method: service.getScheduledJobsListRequest(requestBody).method,
            path: service.getScheduledJobsListRequest(requestBody).url,
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

    it('should make request for fetching scheduled jobs list', done => {
      service.getScheduledJobsList(requestBody).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
