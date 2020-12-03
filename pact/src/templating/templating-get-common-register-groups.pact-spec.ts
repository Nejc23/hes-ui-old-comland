// import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
// import { getTestBed } from '@angular/core/testing';
// import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
// import * as _ from 'lodash';
// import { TimeOfUseService } from 'src/app/core/repository/services/time-of-use/time-of-use.service';
// import { TimeOfUseConfigList } from 'src/app/core/repository/interfaces/time-of-use/time-of-use-config-list.interface';
// import { TemplatingService } from 'src/app/core/repository/services/templating/templating.service';
// import { IActionRequestGetCommonRegisterGroups } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
// import { DisplayGroup } from 'src/app/core/repository/interfaces/templating/display-group.interface';
// import { request } from 'http';

// describe('Pact consumer test', () => {
//   let provider;
//   let service: TemplatingService;

//   beforeAll(done => {
//     provider = setupPactProvider(done);
//   });

//   afterAll(done => {
//     pactFinalize(provider, done);
//   });

//   afterEach(done => {
//     pactVerify(provider, done);
//   });

//   beforeAll(() => {
//     pactSetAngular();
//     service = getTestBed().inject(TemplatingService);
//   });

//   const requestBody: IActionRequestGetCommonRegisterGroups = {
//     deviceIds: ["6704C042-5457-4450-A691-359AB3C6B696"],
//     excludeIds: null,
//     filter: null,
//     search: null,
//     type: 11,
//     textSearch: null,
//     pageNumber: 1,
//     pageSize: 1,
//     sort: null,
//   }

//   const responseBody: DisplayGroup[] = [
//     {
//       "displayGroupId": "4a031fc7-49b9-4e09-a247-4f3906eff7a8",
//       "name": "Operating display list",
//       "obisCode": "0.0.199.1.1.255",
//       "classId": 30021,
//       "attributeId": 4,
//       "type": "DISPLAY",
//       "maxEntries": 25,
//       "displayRegisterDefinitions": [
//         {
//           "displayRegisterDefinitionId": "19b3f286-7ae0-4628-8660-454373396d1d",
//           "name": "Pmax+_T0",
//           "obisCode": "1.0.1.6.0.255",
//           "classId": 4,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "4bdcf426-7238-41f5-b21d-563b743e933e",
//           "name": "R1_T2",
//           "obisCode": "1.0.5.8.2.255",
//           "classId": 3,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "e10af1f2-d971-4643-80ae-63754f2c5883",
//           "name": "Device ID 1",
//           "obisCode": "0.0.96.1.0.255",
//           "classId": 1,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "e9f03177-fb1d-47e2-a4f4-7c08e0ea4e67",
//           "name": "A+_T0",
//           "obisCode": "1.0.1.8.0.255",
//           "classId": 3,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "1bd8d9cc-c179-4540-8278-aeb00e7c95b7",
//           "name": "A+_T3",
//           "obisCode": "1.0.1.8.3.255",
//           "classId": 3,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "6d917e41-c19f-4c18-b072-b876962b1e6e",
//           "name": "A-_T0",
//           "obisCode": "1.0.2.8.0.255",
//           "classId": 3,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "aa91ea05-48e5-4d14-aaa4-b9700e9b5c02",
//           "name": "A+_T1",
//           "obisCode": "1.0.1.8.1.255",
//           "classId": 3,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "cff91e1d-485a-4fbd-a174-db435d8cbd99",
//           "name": "Local time",
//           "obisCode": "1.0.0.9.1.255",
//           "classId": 1,
//           "attributeId": 2
//         }
//       ]
//     },
//     {
//       "displayGroupId": "8c94f955-746f-4274-9b83-703c77887a48",
//       "name": "Standard display list",
//       "obisCode": "0.0.199.1.2.255",
//       "classId": 30002,
//       "attributeId": 4,
//       "type": "DISPLAY",
//       "maxEntries": 25,
//       "displayRegisterDefinitions": [
//         {
//           "displayRegisterDefinitionId": "d026613e-129a-4e68-af3c-00d2cbf1854f",
//           "name": "R1_T0",
//           "obisCode": "1.0.5.8.0.255",
//           "classId": 3,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "086e44ec-2816-4a4e-8984-1466af282b6d",
//           "name": "A-_T0",
//           "obisCode": "1.0.2.8.0.255",
//           "classId": 3,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "425b2cd3-e77c-4836-b46a-200399296af9",
//           "name": "Local date",
//           "obisCode": "1.0.0.9.2.255",
//           "classId": 1,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "1624145b-a919-4544-bf58-283760d354bf",
//           "name": "R3_T0",
//           "obisCode": "1.0.7.8.0.255",
//           "classId": 3,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "fb840ccc-df44-4c48-ab9f-378696025ebc",
//           "name": "I_L1",
//           "obisCode": "1.0.31.7.0.255",
//           "classId": 3,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "b66a0533-2247-450f-bddb-4c31f90f499e",
//           "name": "Pmax-_T0",
//           "obisCode": "1.0.2.6.0.255",
//           "classId": 4,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "f409f51b-df52-4bae-a24b-4c5a4868ae25",
//           "name": "A+_T1",
//           "obisCode": "1.0.1.8.1.255",
//           "classId": 3,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "c4116a6e-49a8-4059-8481-57e9fa613add",
//           "name": "R1_T2",
//           "obisCode": "1.0.5.8.2.255",
//           "classId": 3,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "770e0360-7049-42b6-bfad-63879ed2b02a",
//           "name": "Device ID 1",
//           "obisCode": "0.0.96.1.0.255",
//           "classId": 1,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "622ec97a-0678-46f7-9d1e-7c2a8944eb8a",
//           "name": "Pmax+_T0",
//           "obisCode": "1.0.1.6.0.255",
//           "classId": 4,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "fc154da6-53cb-49ff-a401-83dbd3982b89",
//           "name": "V_L1",
//           "obisCode": "1.0.32.7.0.255",
//           "classId": 3,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "fba8c87f-51c3-4e06-a5e3-9f30e47adcf4",
//           "name": "COSEM Logical Device Name",
//           "obisCode": "0.0.42.0.0.255",
//           "classId": 1,
//           "attributeId": 2
//         },
//         {
//           "displayRegisterDefinitionId": "d894355f-9aff-4ab5-9625-af2b6f575ad9",
//           "name": "Active TOU ID",
//           "obisCode": "0.0.13.0.0.255",
//           "classId": 20,
//           "attributeId": 2
//         }
//       ]
//     }
//   ];

//   beforeAll(done => {
//     provider
//       .addInteraction({
//         state: 'A_REQUEST_FOR_GET_COMMON_REGISTER_GROUPS',
//         uponReceiving: 'a request for getting common register groups',
//         withRequest: {
//           method: service.getCommonRegisterGroupsRequest(requestBody).method,
//           path: service.getCommonRegisterGroupsRequest(requestBody).url,
//           headers: defaultRequestHeader
//         },
//         willRespondWith: {
//           status: 200,
//           headers: defaultResponseHeader,
//           body: responseBody
//         }
//       })
//       .then(
//         () => {
//           done();
//         },
//         err => {
//           done.fail(err);
//         }
//       );
//   });

//   it('should make request for getting common register groups', done => {
//     service.getCommonRegisterGroups(requestBody).subscribe(res => {
//       expect(res).toEqual(responseBody);
//       done();
//     });
//   });
// });
