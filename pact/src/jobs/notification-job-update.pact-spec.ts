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

  const jobId = 'fb40d235-e54d-4023-8b97-b59f24c44fe4';
  const requestBody: SchedulerJob = {
    jobType: 'alarmNotification',
    active: true,
    description: 'Notify alarms',
    cronExpression: '* * 0 * * ?',
    startAt: '2021-01-14T08:44:00+01:00',
    endAt: null,
    addresses: ['alarmObserver@ePoint.si'],
    filter: {
      alarmIds: [128, 42, 64],
      manufacturers: ['lgz', 'isk'],
      protocols: ['aC750', 'dlms'],
      severities: ['medium', 3, 'high'],
      sources: ['concentrator', 'meter']
    }
  };

  const responseBody: SchedulerJob = {
    jobType: 6,
    active: true,
    description: 'Notify alarms',
    cronExpression: '* * 0 * * ?',
    startAt: '2021-01-14T08:44:00+01:00',
    endAt: null,
    addresses: ['gregor@ePoint.si', 'jan@ePoint.si'],
    filter: {
      alarmIds: [64, 128, 42], // integer alarm identifiers
      severities: [1, 2, 3], // enum - TODO get endpoint for list of enum values
      protocols: [2, 3],
      manufacturers: [1, 2],
      sources: [2, 3] // enum - TODO get endpoint for list of enum values
    }
  };

  describe('Notification job', () => {
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_UPDATING_NOTIFICATION_JOB',
          uponReceiving: 'a request for updating notification job',
          withRequest: {
            method: service.updateNotificationJobRequest(requestBody, jobId).method,
            path: service.updateNotificationJobRequest(requestBody, jobId).url,
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

    it('should make request for updating notification job', (done) => {
      service.updateNotificationJob(requestBody, jobId).subscribe(
        (res: SchedulerJob) => {
          expect(res).toEqual(responseBody);
          done();
        },
        (err) => {
          done.fail(err);
        }
      );
    });
  });
});
