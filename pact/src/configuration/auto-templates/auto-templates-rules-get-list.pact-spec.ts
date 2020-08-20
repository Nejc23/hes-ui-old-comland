import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';
import { TemplatesList } from 'src/app/core/repository/interfaces/auto-templates/templates-list.interface';
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
    service = getTestBed().get(AutoTemplatesService);
  });

  describe('Auto templates get list of rules request', () => {
    const responseBody: AutoTemplateRuleList[] = [
      {
        templateId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
        autoTemplateRules: [
          {
            autoTemplateRuleId: '9b837e2d-957d-49e2-8d1d-a2e4b843rrr77',
            propertyName: 'obis2',
            propertyValue: 'rule 22212'
          },
          {
            autoTemplateRuleId: '5456643-957d-49e2-8d1d-a2e4b843rrr77',
            propertyName: 'obis3322',
            propertyValue: 'rule2'
          }
        ]
      },
      {
        templateId: '753223-4556-t55z6-8d1d-a2e4b8440b77',
        autoTemplateRules: [
          {
            autoTemplateRuleId: '556ki8-77689-49e2-8d1d-a2e4b843rrr77',
            propertyName: 'obis 4555 he',
            propertyValue: 'rule 483'
          },
          {
            autoTemplateRuleId: '5456643-957d-49e2-8d1d-55',
            propertyName: 'obis 7',
            propertyValue: 'rule 7'
          }
        ]
      }
    ];

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_LIST_OF_RULES_WITH_TEMPLATES',
          uponReceiving: 'a request for getting list of rules with templates',
          withRequest: {
            method: service.getAutoTemplateRulesRequest().method,
            path: service.getAutoTemplateRulesRequest().url,
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
      service.getAutoTemplateRules().subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
