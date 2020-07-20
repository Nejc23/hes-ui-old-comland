import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';
import { Rule } from 'src/app/core/repository/interfaces/auto-templates/rule.interface';

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

  const requestBody: Rule = {
    templateId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
    obis: 'opis added',
    regex: 'regex added'
  };

  const responseBody = null;

  describe('Auto templates adding new rule on template', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_CREATE_RULE_ON_TEMPLATE',
          uponReceiving: 'a request for creating rule on template',
          withRequest: {
            method: service.createAutoTemplateRuleRequest(requestBody).method,
            path: service.createAutoTemplateRuleRequest(requestBody).url,
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

    it('should make request for creating rule on template', done => {
      service.createAutoTemplateRule(requestBody).subscribe(
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
