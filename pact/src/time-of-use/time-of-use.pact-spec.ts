import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import * as _ from 'lodash';
import { TimeOfUseService } from 'src/app/core/repository/services/time-of-use/time-of-use.service';
import { TimeOfUseConfigList } from 'src/app/core/repository/interfaces/time-of-use/time-of-use-config-list.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: TimeOfUseService;

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
    service = getTestBed().get(TimeOfUseService);
  });

  describe('Time of use configurations', () => {
    const responseBody: TimeOfUseConfigList[] = [
      {
        timeOfUseId: '1',
        activationDate: '2020-03-03T00:00:00+01:00',
        timeOfUseTag: 's1w3d1',
        timeOfUseName: 'NameYourTimeOfUseFile1',
        description: 'ON-PEAK'
      },
      {
        timeOfUseId: '2',
        activationDate: '2020-03-14T00:00:00+01:00',
        timeOfUseTag: 's2w2d2',
        timeOfUseName: 'NameYourTimeOfUseFile2',
        description: 'OFF-PEAK'
      },
      {
        timeOfUseId: '3',
        activationDate: '2020-03-31T00:00:00+01:00',
        timeOfUseTag: 's3w3d3',
        timeOfUseName: 'NameYourTimeOfUseFile3',
        description: 'PARTIAL-PEAK'
      }
    ];

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_TOU_CONFIGURATIONS',
          uponReceiving: 'a request for getting time of use configurations',
          withRequest: {
            method: service.getTouConfigListRequest().method,
            path: service.getTouConfigListRequest().url,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 200,
            headers: defaultResponseHeader,
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

    it('should make request for fetching TOU configurations', done => {
      service.getTouConfigList().subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
