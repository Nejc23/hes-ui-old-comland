import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { enumMyGridLink, getCommonRegisterGroups } from 'src/app/core/repository/consts/my-grid-link.const';
import { ResponseCommonRegisterGroup } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';

@Injectable()
export class MeterUnitsSetMonitorInterceptor {
  constructor() {}

  static canInterceptMeterUnitGetCommonRegisterGroupsPost(request: HttpRequest<any>): boolean {
    return (
      new RegExp(`${enumMyGridLink.templating}${getCommonRegisterGroups}`).test(request.url) &&
      request.method.endsWith('POST') &&
      request.body.type !== '11'
    );
  }

  static interceptMeterUnitGetCommonRegisterGroupsPost(): Observable<HttpEvent<any>> {
    const data: ResponseCommonRegisterGroup[] = [
      {
        registerGroupId: '3e46c193-2272-4193-8341-4364c5e7f52c',
        name: 'Monitor',
        type: 'MONITOR',
        registerDefinitions: [
          {
            registerDefinitionId: '2dde25ae-ad60-4402-badd-18dbe1d40dd3',
            name: 'Current L3 monitor',
            obisCode: '1.0.71.4.0.255',
            classId: 21,
            attributeId: 2,
            type: 'MONITOR_PHASE_3',
            dataType: 'unknown',
            iecCode: '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0'
          },
          {
            registerDefinitionId: '97179cc6-bd90-43aa-9f15-8cc19ef38eb8',
            name: 'Current L2 monitor',
            obisCode: '1.0.51.4.0.255',
            classId: 21,
            attributeId: 2,
            type: 'MONITOR_PHASE_2',
            dataType: 'unknown',
            iecCode: '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0'
          },
          {
            registerDefinitionId: '199b8d38-ec3e-438c-9126-a593dd029a76',
            name: 'Current L1 monitor',
            obisCode: '1.0.31.4.0.255',
            classId: 21,
            attributeId: 2,
            type: 'MONITOR_PHASE_1',
            dataType: 'unknown',
            iecCode: '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0'
          }
        ]
      },
      {
        registerGroupId: 'fb9a9c67-8f76-4c2b-b75f-68ee301f2124',
        name: 'Monitor',
        type: 'MONITOR',
        registerDefinitions: [
          {
            registerDefinitionId: '97179cc6-bd90-43aa-9f15-8cc19ef38eb8',
            name: 'Current L2 monitor',
            obisCode: '1.0.51.4.0.255',
            classId: 21,
            attributeId: 2,
            type: 'MONITOR_PHASE_2',
            dataType: 'val',
            iecCode: null
          },
          {
            registerDefinitionId: '25a7dc30-1324-41ae-9288-7200bba9f4b9',
            name: 'Current L1 monitor',
            obisCode: '1.0.31.4.0.255',
            classId: 21,
            attributeId: 2,
            type: 'MONITOR_PHASE_1',
            dataType: 'vaal',
            iecCode: null
          },
          {
            registerDefinitionId: '0cfd6b13-643d-40ec-921d-7205933c4012',
            name: 'Current L3 monitor',
            obisCode: '1.0.71.4.0.255',
            classId: 21,
            attributeId: 2,
            type: 'MONITOR_PHASE_3',
            dataType: 'vaal',
            iecCode: null
          }
        ]
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }
}
