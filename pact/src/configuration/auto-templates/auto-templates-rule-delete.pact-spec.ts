import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';

describe('Pact consumer test', () => {
  let provider;
  let service: AutoTemplatesService;

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
    service = getTestBed().inject(AutoTemplatesService);
  });

  const id = '4344553-443456-23323-5555-2333';

  describe('Delete rule from template', () => {
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_DELETE_RULE_FROM_TEMPLATE',
          uponReceiving: 'a request to delete rule form template',
          withRequest: {
            method: service.deleteAutoTemplateRuleRequest(id).method,
            path: service.deleteAutoTemplateRuleRequest(id).url,
            headers: {
              ...defaultRequestHeader
            }
          },
          willRespondWith: {
            status: 204,
            headers: {
              ...defaultResponseHeader
            },
            body: null
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

    it('should make request to delete rule form template', (done) => {
      service.deleteAutoTemplateRule(id).subscribe(
        (res) => {
          expect(res).toEqual(null);
          done();
        },
        (err) => {
          done.fail(err);
        }
      );
    });
  });
});
