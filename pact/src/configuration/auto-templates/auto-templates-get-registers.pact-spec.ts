import { AutoTemplateRegister } from '../../../../src/app/core/repository/interfaces/auto-templates/auto-template-register.interface';
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

  describe('Auto templates get device registers', () => {
    const deviceId = 'ecdc4778-2824-421d-bebd-76a280247d03';
    const responseBody: AutoTemplateRegister[] = [
      {
        name: 'LP1: R+_T0 - PROFILE',
        groupName: 'Loadprofile 1',
        registerDefinitionId: '8bd30b5e-8500-47a3-a24f-0fb63b99bcf1',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'PROFILE'
      },
      {
        name: 'LP1: A+_T0 - EVENT',
        groupName: 'Loadprofile 1',
        registerDefinitionId: 'bcd4f0e9-19c7-44bb-b554-199ed0046da6',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'EVENT'
      },
      {
        name: 'LP1: R-_T0 - INSTANTANEOUS_VALUE',
        groupName: 'Loadprofile 1',
        registerDefinitionId: 'e895353f-b402-4fd1-80ae-d548494bcd15',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'INSTANTANEOUS_VALUE'
      },
      {
        name: 'LP1: A-_T0',
        groupName: 'Loadprofile 1',
        registerDefinitionId: '92d961f1-1314-4000-906e-d754e5495684',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'PROFILE'
      },
      {
        name: 'Limiter ch0 - Threshold normal',
        groupName: 'Limiter',
        registerDefinitionId: '3a2ff682-685c-40c2-ad49-20d52a9b2534',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'MinUnderThresholdDuration',
        groupName: 'Limiter',
        registerDefinitionId: '35f8ce58-15fa-4e9e-8d6e-4c5b2ecd0b0a',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'Limiter ch0 - Threshold emergency',
        groupName: 'Limiter',
        registerDefinitionId: 'bf65120a-8f9e-4804-aed4-8a7dac1974f7',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'MinOverThresholdDuration',
        groupName: 'Limiter',
        registerDefinitionId: 'c6227b8e-477c-4fda-a55a-af68c35e680a',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      }
    ];

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_DEVICE_REGISTERS',
          uponReceiving: 'a request for getting device registers',
          withRequest: {
            method: service.getRegistersRequest(deviceId).method,
            path: service.getRegistersRequest(deviceId).url,
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

    it('should make request for getting device registers', done => {
      service.getRegisters(deviceId).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
