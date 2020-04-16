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
        id: '5e2bc633-fd66-4b5b-888d-77ce1bf7111e',
        description: 'ON-PEAK'
      },
      {
        id: 'ead2e345-c1df-46c9-843a-af427ae6436a',
        description: 'OFF-PEAK'
      },
      {
        id: 'aafc795f-3c7c-4bff-802d-a9f654200b2b',
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
