import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DataConcentratorUnit } from 'src/app/core/repository/interfaces/data-concentrator-units/data-concentrator-unit.interface';

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

  const responseBody: DataConcentratorUnit = {
    concentratorId: '1D372C3F-D1FC-4BB1-BF34-0E4925D4BA8E',
    name: 'Test DCU 1',
    typeId: 1,
    typeValue: 'Type 1',
    manufacturerId: 1,
    manufacturerValue: 'Vendor 3',
    statusId: 1,
    statusValue: 'CREATED',
    address: 'Ljubljana 1000',
    serialNumber: '3323333',
    ip: '2.32.3.5',
    mac: 'mac',
    port: '3333',
    tags: 'tag55',
    username: 'name user',
    password: 'password',
    longitude: 3233,
    latitude: 330323
  };

  const id = '1D372C3F-D1FC-4BB1-BF34-0E4925D4BA8E';

  describe('Data concentrator unit get by Id', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_DATA_CONCENTRATOR_UNIT_BY_ID',
          uponReceiving: 'a request for getting data concentrator unit by Id',
          withRequest: {
            method: service.getDataConcentratorUnitRequest(id).method,
            path: service.getDataConcentratorUnitRequest(id).url,
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

    it('should make request for getting data concentrator unit by Id', done => {
      service.getDataConcentratorUnit(id).subscribe(
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
