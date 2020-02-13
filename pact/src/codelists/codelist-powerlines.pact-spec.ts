import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { CodelistRepositoryService } from 'src/app/core/repository/services/codelists/codelist-repository.service';
import { CodelistPowerline } from 'src/app/shared/repository/interfaces/codelists/codelist-powerline.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: CodelistRepositoryService;

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
    service = getTestBed().get(CodelistRepositoryService);
  });

  describe('Codelist - powerlines', () => {
    const responseBody: CodelistPowerline[] = [
      {
        id: 1,
        value: 'Powerline 1',
        devices: [
          {
            id: 1,
            value: 'Device 1'
          },
          {
            id: 2,
            value: 'Device 2'
          }
        ]
      },
      {
        id: 2,
        value: 'Powerline 2',
        devices: [
          {
            id: 1,
            value: 'Device 3'
          },
          {
            id: 2,
            value: 'Device 4'
          }
        ]
      }
    ];

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_POWERLINE_CODELISTS',
          uponReceiving: 'a request for getting powerline codelists',
          withRequest: {
            method: service.powerlineCodelistRequest().method,
            path: service.powerlineCodelistRequest().url,
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

    it('should make request for fetching powerline codelists', done => {
      service.powerlineCodelist().subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
