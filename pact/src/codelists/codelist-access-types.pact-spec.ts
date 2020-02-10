import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { Codelist } from 'src/app/shared/forms/interfaces/codelist.interface';
import { CodelistRepositoryService } from 'src/app/shared/repository/services/codelist-repository.service';
import * as _ from 'lodash';
import { WidgetType } from 'src/app/features/widgets/enums/widget-type.enum';

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

  describe('Codelist - access types', () => {
    const responseBody: Codelist<number>[] = [
      {
        id: 1,
        value: 'super user'
      },
      {
        id: 2,
        value: 'user'
      }
    ];
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_ACCESSTYPES_CODELISTS',
          uponReceiving: 'a request for getting access types codelists',
          withRequest: {
            method: service.accesssTypeCodelistRequest().method,
            path: service.accesssTypeCodelistRequest().url,
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

    it('should make request for fetching access types codelists', done => {
      service.accesssTypeCodelist().subscribe(res => {
        expect(res).toEqual(responseBody);
        expect(res.length).toBeGreaterThan(1);
        done();
      });
    });
  });
});
