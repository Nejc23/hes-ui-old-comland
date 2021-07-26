import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { autoTemplateDevice } from './../../../../app/core/repository/consts/auto-templates.const';
import { AutoTemplateRegister } from './../../../../app/core/repository/interfaces/auto-templates/auto-template-register.interface';

@Injectable()
export class AutoTemplatesRegistersInterceptor {
  constructor() {}

  static interceptGetRegisters(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const body: AutoTemplateRegister[] = [
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
      },
      {
        name: 'Limiter ch0 - Threshold normal',
        groupName: 'Limiter 2',
        registerDefinitionId: '3a2ff682-685c-40c2-ad49-20d52a9b2534',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'MinUnderThresholdDuration',
        groupName: 'Limiter 2',
        registerDefinitionId: '35f8ce58-15fa-4e9e-8d6e-4c5b2ecd0b0a',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'Limiter ch0 - Threshold emergency',
        groupName: 'Limiter 2',
        registerDefinitionId: 'bf65120a-8f9e-4804-aed4-8a7dac1974f7',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'MinOverThresholdDuration',
        groupName: 'Limiter 2',
        registerDefinitionId: 'c6227b8e-477c-4fda-a55a-af68c35e680a',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'Limiter ch0 - Threshold normal',
        groupName: 'Limiter 3',
        registerDefinitionId: '3a2ff682-685c-40c2-ad49-20d52a9b2534',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'MinUnderThresholdDuration',
        groupName: 'Limiter 3',
        registerDefinitionId: '35f8ce58-15fa-4e9e-8d6e-4c5b2ecd0b0a',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'Limiter ch0 - Threshold emergency',
        groupName: 'Limiter 3',
        registerDefinitionId: 'bf65120a-8f9e-4804-aed4-8a7dac1974f7',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'MinOverThresholdDuration',
        groupName: 'Limiter 3',
        registerDefinitionId: 'c6227b8e-477c-4fda-a55a-af68c35e680a',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'Limiter ch0 - Threshold normal',
        groupName: 'Limiter 4',
        registerDefinitionId: '3a2ff682-685c-40c2-ad49-20d52a9b2534',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'MinUnderThresholdDuration',
        groupName: 'Limiter 4',
        registerDefinitionId: '35f8ce58-15fa-4e9e-8d6e-4c5b2ecd0b0a',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'Limiter ch0 - Threshold emergency',
        groupName: 'Limiter 4',
        registerDefinitionId: 'bf65120a-8f9e-4804-aed4-8a7dac1974f7',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'MinOverThresholdDuration',
        groupName: 'Limiter 4',
        registerDefinitionId: 'c6227b8e-477c-4fda-a55a-af68c35e680a',
        registerGroupId: '5303e99b-aba2-4d5b-825e-0fb15ace7be5',
        type: 'LIMITER',
        categorization: 'PROFILE'
      },
      {
        name: 'LP1: R+_T0 - PROFILE',
        groupName: 'Loadprofile 2',
        registerDefinitionId: '8bd30b5e-8500-47a3-a24f-0fb63b99bcf1',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'PROFILE'
      },
      {
        name: 'LP1: A+_T0 - EVENT',
        groupName: 'Loadprofile 2',
        registerDefinitionId: 'bcd4f0e9-19c7-44bb-b554-199ed0046da6',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'EVENT'
      },
      {
        name: 'LP1: R-_T0 - INSTANTANEOUS_VALUE',
        groupName: 'Loadprofile 2',
        registerDefinitionId: 'e895353f-b402-4fd1-80ae-d548494bcd15',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'INSTANTANEOUS_VALUE'
      },
      {
        name: 'LP1: A-_T0',
        groupName: 'Loadprofile 2',
        registerDefinitionId: '92d961f1-1314-4000-906e-d754e5495684',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'PROFILE'
      },
      {
        name: 'LP1: R+_T0 - PROFILE',
        groupName: 'Loadprofile 3',
        registerDefinitionId: '8bd30b5e-8500-47a3-a24f-0fb63b99bcf1',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'PROFILE'
      },
      {
        name: 'LP1: A+_T0 - EVENT',
        groupName: 'Loadprofile 3',
        registerDefinitionId: 'bcd4f0e9-19c7-44bb-b554-199ed0046da6',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'EVENT'
      },
      {
        name: 'LP1: R-_T0 - INSTANTANEOUS_VALUE',
        groupName: 'Loadprofile 3',
        registerDefinitionId: 'e895353f-b402-4fd1-80ae-d548494bcd15',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'INSTANTANEOUS_VALUE'
      },
      {
        name: 'LP1: A-_T0',
        groupName: 'Loadprofile 3',
        registerDefinitionId: '92d961f1-1314-4000-906e-d754e5495684',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'PROFILE'
      },
      {
        name: 'LP1: R+_T0 - PROFILE',
        groupName: 'Loadprofile 4',
        registerDefinitionId: '8bd30b5e-8500-47a3-a24f-0fb63b99bcf1',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'PROFILE'
      },
      {
        name: 'LP1: A+_T0 - EVENT',
        groupName: 'Loadprofile 4',
        registerDefinitionId: 'bcd4f0e9-19c7-44bb-b554-199ed0046da6',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'EVENT'
      },
      {
        name: 'LP1: R-_T0 - INSTANTANEOUS_VALUE',
        groupName: 'Loadprofile 4',
        registerDefinitionId: 'e895353f-b402-4fd1-80ae-d548494bcd15',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'INSTANTANEOUS_VALUE'
      },
      {
        name: 'LP1: A-_T0',
        groupName: 'Loadprofile 4',
        registerDefinitionId: '92d961f1-1314-4000-906e-d754e5495684',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'PROFILE'
      },
      {
        name: 'LP1: R+_T0 - PROFILE',
        groupName: 'Loadprofile 5',
        registerDefinitionId: '8bd30b5e-8500-47a3-a24f-0fb63b99bcf1',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'PROFILE'
      },
      {
        name: 'LP1: A+_T0 - EVENT',
        groupName: 'Loadprofile 5',
        registerDefinitionId: 'bcd4f0e9-19c7-44bb-b554-199ed0046da6',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'EVENT'
      },
      {
        name: 'LP1: R-_T0 - INSTANTANEOUS_VALUE',
        groupName: 'Loadprofile 5',
        registerDefinitionId: 'e895353f-b402-4fd1-80ae-d548494bcd15',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'INSTANTANEOUS_VALUE'
      },
      {
        name: 'LP1: A-_T0',
        groupName: 'Loadprofile 5',
        registerDefinitionId: '92d961f1-1314-4000-906e-d754e5495684',
        registerGroupId: '82921f96-39b3-4959-9c5a-c8c12ead99ff',
        type: 'LOADPROFILE1',
        categorization: 'PROFILE'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }

  static canInterceptGetRegisters(request: HttpRequest<any>): boolean {
    return new RegExp(`${autoTemplateDevice}/[0-9a-fA-F-]+/registers`).test(request.url) && request.method.endsWith('GET');
  }
}
