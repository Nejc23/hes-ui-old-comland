import { MeterUnit } from './../../../src/app/core/repository/interfaces/meter-units/meter-unit.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';

describe('Pact consumer test', () => {
  let provider;
  let service: MeterUnitsService;

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
    service = getTestBed().get(MeterUnitsService);
  });

  const responseBody: MeterUnit = {
    deviceId: '9b837e2d-957d-49e2-8d1d-a2e4b8440b77',
    name: 'Cubis PLC temp 520',
    statusValue: 'Active',
    statusId: 1,
    typeValue: 'PLC dat 221',
    typeId: 1,
    vendorValue: 'Landis+Gy',
    vendorId: 2,
    id5: 'ID-12345',
    logicalDeviceName: 'device name 1'
  };

  const id = '1D372C3F-D1FC-4BB1-BF34-0E4925D4BA8F';

  describe('Meter unit get by Id', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_METER_UNIT_BY_ID',
          uponReceiving: 'a request for getting meter unit by Id',
          withRequest: {
            method: service.getMeterUnitRequest(id).method,
            path: service.getMeterUnitRequest(id).url,
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

    it('should make request for getting meter unit by Id', done => {
      service.getMeterUnit(id).subscribe(
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
