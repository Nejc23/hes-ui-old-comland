/*

****** PACT test only work with JSON response !!!!
******* API concentrator-inventory/add-scheduler is returning string guid in body with response header content-type: application/json!

****** TODO: change API concentrator-inventory/add-concentrator to return added object (whole JSON) with ID
******       or create custom matcher for PACT tests like https://stackoverflow.com/questions/47927608/pact-matching-non-json-body
******       or leave this test commented ;)

import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
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
    timeZoneInfo: 'Central Europe Standard Time'
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
    idNumber: '1234567',
    ip: '127.0.0.1'
  };

  const responseBody = '0d18b2e3-f0e0-48fd-a0df-b30513f17555';

  describe('Data concentrator unit manually create', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_CREATE_DATA_CONCENTRATOR_UNIT',
          uponReceiving: 'a request for creating data concentrator unit',
          withRequest: {
            method: service.createDcuRequest(requestBody1).method,
            path: service.createDcuRequest(requestBody1).url,
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

    it('should make request for creating data concentrator unit', done => {
      service.createDcu(requestBody).subscribe(
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
