import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';
import { AutoTemplateRuleList } from 'src/app/core/repository/interfaces/auto-templates/auto-template-rule.interface';

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
    service = getTestBed().inject(AutoTemplatesService);
  });

  describe('Auto templates get list of rules for templateId request', () => {
    const requestTemplateId = '9b837e2d-957d-49e2-8d1d-a2e4b8440b77';
    const responseBody: AutoTemplateRuleList = {
      templateId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
      autoTemplateRules: [
        {
          autoTemplateRuleId: '9b837e2d-957d-49e2-8d1d-a2e4b843rrr77',
          propertyName: 'obis2',
          propertyValue: 'rule 22212',
          jobIds: ['ff11d571-8ff7-4c1a-aaa2-61c6bfdd2383', 'b8342f41-4131-4e43-8ea7-71da78636420']
        },
        {
          autoTemplateRuleId: '5456643-957d-49e2-8d1d-a2e4b843rrr77',
          propertyName: 'obis3322',
          propertyValue: 'rule2',
          jobIds: ['e27d45fd-8f27-4593-a70c-6bf3369fd379', '75279ce2-1f34-4f32-8075-6193225d4917']
        }
      ]
    };

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_LIST_OF_RULES_FOR_TEMPLATE_ID',
          uponReceiving: 'a request for getting list of rules for templateId',
          withRequest: {
            method: service.getAutoTemplateRulesForTemplateIdRequest(requestTemplateId).method,
            path: service.getAutoTemplateRulesForTemplateIdRequest(requestTemplateId).url,
            body: null,
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

    it('should make request for fetching list of rules with templates', done => {
      service.getAutoTemplateRulesForTemplateId(requestTemplateId).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
