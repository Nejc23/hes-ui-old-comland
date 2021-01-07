import { MeterUnit } from '../../../src/app/core/repository/interfaces/meter-units/meter-unit.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MeterUnitDetails } from 'src/app/core/repository/interfaces/meter-units/meter-unit-details.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: MeterUnitsService;

  beforeAll((done) => {
    provider = setupPactProvider(done);
  });

  afterAll((done) => {
    pactFinalize(provider, done);
  });

  afterEach((done) => {
    pactVerify(provider, done);
  });

  beforeAll(() => {
    pactSetAngular();
    service = getTestBed().inject(MeterUnitsService);
  });

  const responseBody: MeterUnitDetails = {
    deviceId: '5388b9bf-c167-42fa-8adb-99281a049464',
    serialNumber: '36078376',
    name: '000F93FFFF147C9A',
    mac: '000F93FFFF147C9A',
    systitle: '4C475A6672268328',
    state: 'installed',
    type: 0,
    manufacturer: 'lgz',
    templateName: 'PLC_E450_SLO1ph',
    address: null,
    latitude: 46.230684,
    longitude: 14.419062,
    tags: ['tag1', 'tag2']
  };

  const id = '1D372C3F-D1FC-4BB1-BF34-0E4925D4BA8F';

  describe('Meter unit get by Id', () => {
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_METER_UNIT_DETAILS_BY_ID',
          uponReceiving: 'a request for getting meter unit details by Id',
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request for getting meter unit details by Id', (done) => {
      service.getMeterUnit(id).subscribe(
        (res) => {
          expect(res).toEqual(responseBody);
          done();
        },
        (err) => {
          done.fail(err);
        }
      );
    });
  });
});
