import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';
import { AutoTemplateRule } from 'src/app/core/repository/interfaces/auto-templates/auto-template-rule.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: AutoTemplatesService;

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
    service = getTestBed().get(AutoTemplatesService);
  });

  const requestBody: AutoTemplateRule = {
    autoTemplateRuleId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
    obis: 'opis update',
    regex: 'regex update'
  };

  const responseBody = null;

  describe('Auto templates update rule for template', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_UPDATE_RULE_ON_TEMPLATE',
          uponReceiving: 'a request for updating rule on template',
          withRequest: {
            method: service.updateAutoTemplateRuleRequest(requestBody).method,
            path: service.updateAutoTemplateRuleRequest(requestBody).url,
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

    it('should make request for updating rule on template', done => {
      service.updateAutoTemplateRule(requestBody).subscribe(
        (res: any) => {
          expect(null).toEqual(responseBody);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
