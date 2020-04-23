import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
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
    service = getTestBed().get(DataConcentratorUnitsService);
  });

  const requestBody: DcuForm = {
    id: null,
    name: 'Test DCU 1',
    tags: [
      { id: 1, value: 'tag 1' },
      { id: 2, value: 'tag 2' }
    ],
    type: 1,
    vendor: 1,
    idNumber: '123456',
    ip: '127.0.0.1'
  };

  const responseBody: DcuForm = {
    id: '48823a66-87f1-495d-bdcc-8d2ed06b0b14',
    name: 'Test DCU 1',
    tags: [
      { id: 1, value: 'tag 1' },
      { id: 2, value: 'tag 2' }
    ],
    type: 1,
    vendor: 1,
    idNumber: '123456',
    ip: '127.0.0.1'
  };

  describe('Data concentrator unit manually create', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_CREATE_DATA_CONCENTRATOR_UNIT',
          uponReceiving: 'a request for creating data concentrator unit',
          withRequest: {
            method: service.createDcuRequest(requestBody).method,
            path: service.createDcuRequest(requestBody).url,
            body: requestBody,
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
        (res: DcuForm) => {
          expect(res.id).toEqual(responseBody.id);
          expect(res.ip).toEqual(responseBody.ip);
          expect(res.idNumber).toEqual(responseBody.idNumber);
          expect(res.name).toEqual(responseBody.name);
          expect(res.tags).toEqual(responseBody.tags);
          expect(res.type).toEqual(responseBody.type);
          expect(res.vendor).toEqual(responseBody.vendor);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
