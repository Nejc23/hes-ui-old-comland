import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { enumMyGridLink, getCommonRegisterGroups } from 'src/app/core/repository/consts/my-grid-link.const';
import { ResponseCommonRegisterGroup } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';

@Injectable()
export class MeterUnitsSetDisplaySettingsInterceptor {
  constructor() {}

  static canInterceptMeterUnitGetCommonRegisterGroupsPost(request: HttpRequest<any>): boolean {
    return (
      new RegExp(`${enumMyGridLink.templating}${getCommonRegisterGroups}`).test(request.url) &&
      request.method.endsWith('POST') &&
      request.body.type === '11'
    );
  }

  static interceptMeterUnitGetCommonRegisterGroupsPost(): Observable<HttpEvent<any>> {
    const data: ResponseCommonRegisterGroup[] = [
      {
        groupId: '4a031fc7-49b9-4e09-a247-4f3906eff7a8',
        name: 'Operating display list',
        obisCode: '0.0.199.1.1.255',
        classId: 30021,
        attributeId: 4,
        type: 'DISPLAY',
        maxEntries: 25,
        registerDefinitions: [
          {
            registerDefinitionId: '19b3f286-7ae0-4628-8660-454373396d1d',
            name: 'Pmax+_T0a  ',
            obisCode: '1.0.1.6.0.255',
            classId: 4,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: '4bdcf426-7238-41f5-b21d-563b743e933e',
            name: 'R1_T2',
            obisCode: '1.0.5.8.2.255',
            classId: 3,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: 'e10af1f2-d971-4643-80ae-63754f2c5883',
            name: 'Device ID 1',
            obisCode: '0.0.96.1.0.255',
            classId: 1,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: 'e9f03177-fb1d-47e2-a4f4-7c08e0ea4e67',
            name: 'A+_T0',
            obisCode: '1.0.1.8.0.255',
            classId: 3,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: '1bd8d9cc-c179-4540-8278-aeb00e7c95b7',
            name: 'A+_T3',
            obisCode: '1.0.1.8.3.255',
            classId: 3,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: '6d917e41-c19f-4c18-b072-b876962b1e6e',
            name: 'A-_T0',
            obisCode: '1.0.2.8.0.255',
            classId: 3,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: 'aa91ea05-48e5-4d14-aaa4-b9700e9b5c02',
            name: 'A+_T1',
            obisCode: '1.0.1.8.1.255',
            classId: 3,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: 'cff91e1d-485a-4fbd-a174-db435d8cbd99',
            name: 'Local time',
            obisCode: '1.0.0.9.1.255',
            classId: 1,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          }
        ]
      },
      {
        groupId: '8c94f955-746f-4274-9b83-703c77887a48',
        name: 'Standard display list',
        obisCode: '0.0.199.1.2.255',
        classId: 30002,
        attributeId: 4,
        type: 'DISPLAY',
        maxEntries: 25,
        registerDefinitions: [
          {
            registerDefinitionId: 'd026613e-129a-4e68-af3c-00d2cbf1854f',
            name: 'R1_T0',
            obisCode: '1.0.5.8.0.255',
            classId: 3,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: '086e44ec-2816-4a4e-8984-1466af282b6d',
            name: 'A-_T0',
            obisCode: '1.0.2.8.0.255',
            classId: 3,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: '425b2cd3-e77c-4836-b46a-200399296af9',
            name: 'Local date',
            obisCode: '1.0.0.9.2.255',
            classId: 1,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: '1624145b-a919-4544-bf58-283760d354bf',
            name: 'R3_T0',
            obisCode: '1.0.7.8.0.255',
            classId: 3,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: 'fb840ccc-df44-4c48-ab9f-378696025ebc',
            name: 'I_L1',
            obisCode: '1.0.31.7.0.255',
            classId: 3,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: 'b66a0533-2247-450f-bddb-4c31f90f499e',
            name: 'Pmax-_T0',
            obisCode: '1.0.2.6.0.255',
            classId: 4,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: 'f409f51b-df52-4bae-a24b-4c5a4868ae25',
            name: 'A+_T1',
            obisCode: '1.0.1.8.1.255',
            classId: 3,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: 'c4116a6e-49a8-4059-8481-57e9fa613add',
            name: 'R1_T2',
            obisCode: '1.0.5.8.2.255',
            classId: 3,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: '770e0360-7049-42b6-bfad-63879ed2b02a',
            name: 'Device ID 1',
            obisCode: '0.0.96.1.0.255',
            classId: 1,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: '622ec97a-0678-46f7-9d1e-7c2a8944eb8a',
            name: 'Pmax+_T0',
            obisCode: '1.0.1.6.0.255',
            classId: 4,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: 'fc154da6-53cb-49ff-a401-83dbd3982b89',
            name: 'V_L1',
            obisCode: '1.0.32.7.0.255',
            classId: 3,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: 'fba8c87f-51c3-4e06-a5e3-9f30e47adcf4',
            name: 'COSEM Logical Device Name',
            obisCode: '0.0.42.0.0.255',
            classId: 1,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
          },
          {
            registerDefinitionId: 'd894355f-9aff-4ab5-9625-af2b6f575ad9',
            name: 'Active TOU ID',
            obisCode: '0.0.13.0.0.255',
            classId: 20,
            type: 'DISPLAY',
            dataType: 'val',
            attributeId: 2
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
