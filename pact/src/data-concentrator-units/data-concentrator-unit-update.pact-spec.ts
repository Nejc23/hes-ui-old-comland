/*import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DcuRequest } from 'src/app/features/data-concentrator-units/interfaces/dcu-request.interface';
import { DcuForm } from 'src/app/features/data-concentrator-units/interfaces/dcu-form.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: DataConcentratorUnitsService;

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
    service = getTestBed().inject(DataConcentratorUnitsService);
  });

  const requestBody1: DcuRequest = {
    concentratorId: '1234567',
    name: 'Test DCU 1',
    type: 1,
    vendor: 1,
    concentratorIp: '127.0.0.1',
    status: 1,
    address: 'address 2',
    mac: 'mac 444',
    password: '2222',
    userName: 'user2',
    port: '1111',
  };

  const requestBody: DcuForm = {
    id: null,
    name: 'Test DCU 1',
    tags: [
      { id: 1, value: 'tag 1' },
      { id: 2, value: 'tag 2' }
    ],
    type: { id: 1, value: 'type 1' },
    vendor: { id: 1, value: 'vendor 1' },
    status: { id: 1, value: 'status 1' },
    idNumber: '1234567',
    ip: '127.0.0.1',
    address: 'address 2',
    mac: 'mac 444',
    password: '2222',
    userName: 'user2',
    port: '1111',
  };

  const id = '32A7C6B2-DC94-498C-9437-2607E833D06D';
  const responseBody = '0d18b2e3-f0e0-48fd-a0df-b30513f17555';

  describe('Data concentrator unit manually update', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_UPDATE_DATA_CONCENTRATOR_UNIT',
          uponReceiving: 'a request for updating data concentrator unit',
          withRequest: {
            method: service.updateDcuRequest(id, requestBody1).method,
            path: service.updateDcuRequest(id, requestBody1).url,
            body: requestBody1,
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

    fit('should make request for updating data concentrator unit', done => {
      service.updateDcu(id, requestBody).subscribe(
        res => {
          expect(res).toEqual(responseBody);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});


*/
