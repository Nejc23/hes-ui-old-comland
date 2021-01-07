import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';
import { DataConcentratorUnitsList } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { AutoTemplatesService } from 'src/app/core/repository/services/auto-templates/auto-templates.service';
import { TemplatesList } from 'src/app/core/repository/interfaces/auto-templates/templates-list.interface';

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

  describe('Auto templates get templates list request', () => {
    const responseBody: TemplatesList[] = [
      {
        templateId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
        name: 'template 1'
      },
      {
        templateId: 'ebeacc9d-744c-4a88-bb9c-625216ab99b9',
        name: 'Tempalte 2'
      },
      {
        templateId: 'dewee32-744c-4a88-bb9c-625216ab99b9',
        name: 'template xxxx'
      }
    ];

    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_LIST_OF_TEMPLATES',
          uponReceiving: 'a request for getting template list',
          withRequest: {
            method: service.getTemplatesRequest().method,
            path: service.getTemplatesRequest().url,
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request for fetching template list', (done) => {
      service.getTemplates().subscribe((res) => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
