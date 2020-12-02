// import { defaultRequestHeader, defaultResponseHeader } from 'pact/helpers/default-header.helper';
// import { formDataResponseHeader, formDataRequestHeader } from './../../../helpers/default-header.helper';

// import { DataConcentratorUnitsOperationsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units-operations.service';
// import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
// import { getTestBed } from '@angular/core/testing';
// import { defaultFormatUtc } from 'moment';
// import { term } from '@pact-foundation/pact-web/dsl/matchers';

// describe('Pact consumer test', () => {
//   let provider;
//   let service: DataConcentratorUnitsOperationsService;

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
//     service = getTestBed().inject(DataConcentratorUnitsOperationsService);
//   });

//   const requestBody = new FormData;
//   requestBody.append('requestIds', '0A4A1AE4-3964-47D3-9E38-C017833FFE0C');
//   requestBody.append('requestIds', 'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E');
//   requestBody.append('image', 'file binary');

//   const responseBody = '6211423d-0d7d-4f49-ae02-d681e1f051d1';

//   describe('DCU operation for fw upgrade with ids in request', () => {
//     beforeAll(done => {
//       provider
//         .addInteraction({
//           state: 'A_REQUEST_DCU_OPERATION_FOR_FW_UPGRADE_WITH_IDS_IN_REQUEST',
//           uponReceiving: 'a request for trigger dcu operation for FW upgrade with ids in request',
//           withRequest: {
//             method: service.postDcFwUpgradeRequest(requestBody).method,
//             path: service.postDcFwUpgradeRequest(requestBody).url,
//             body: '------WebKitFormBoundaryhapbuoAhi5g5hpkh\r\nContent-Disposition: form-data; name=\"requestIds\"\r\n\r\n0A4A1AE4-3964-47D3-9E38-C017833FFE0C\r\n------WebKitFormBoundaryhapbuoAhi5g5hpkh\r\nContent-Disposition: form-data; name=\"requestIds\"\r\n\r\nB1EB39A3-94DA-421A-8E1E-E3F5254A8C8E\r\n------WebKitFormBoundaryhapbuoAhi5g5hpkh\r\nContent-Disposition: form-data; name=\"image\"\r\n\r\nfile binary\r\n------WebKitFormBoundaryhapbuoAhi5g5hpkh--\r\n',
//             headers: {'Content-Type': term({
//               generate:
//                 'multipart/form-data; boundary=----WebKitFormBoundaryhapbuoAhi5g5hpkh',
//               matcher:
//                 'multipart/form-data; boundary=----WebKitFormBoundary[.]$'
//               }),
//             },

//           },
//           willRespondWith: {
//             status: 201,
//             headers: {
//               ...defaultResponseHeader
//             },
//             body: responseBody
//           }
//         })
//         .then(
//           () => {
//             done();
//           },
//           err => {
//             done.fail(err);
//           }
//         );
//     });

//    fit('should make request for trigger dcu operation for FW upgrade with ids in request', done => {
//       service.postDcFwUpgrade(requestBody).subscribe(
//         (res: string) => {
//           expect(res).toEqual(responseBody);
//           done();
//         },
//         err => {
//           done.fail(err);
//         }
//       );
//     });
//   });
// });
