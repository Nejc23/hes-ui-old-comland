import { MeterUnit } from '../../../src/app/core/repository/interfaces/meter-units/meter-unit.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MeterUnitDetails } from 'src/app/core/repository/interfaces/meter-units/meter-unit-details.interface';
import { AuthenticationTypeEnum } from '../../../src/app/core/repository/interfaces/meter-units/mu-advanced-information.interface';

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
    deviceId: 'b295a3ec-f335-4f22-a1ee-bacf723ec343',
    name: null,
    serialNumber: null,
    templateName: 'Flex',
    protocol: 'dlms',
    manufacturer: 'lgz',
    ip: '192.168.94.145',
    port: 1001,
    isGateWay: null,
    deviceStatus: 'active',
    hdlcInformation: null,
    wrapperInformation: {
      publicClientAddress: 16,
      publicServerAddress: null,
      clientAddress: 1,
      serverAddress: 1,
      physicalAddress: null
    },
    advancedInformation: {
      startWithRelease: true,
      ldnAsSystitle: true,
      authenticationType: AuthenticationTypeEnum.NONE
    }
  };

  const id = '1D372C3F-D1FC-4BB1-BF34-0E4925D4BA8F';

  describe('Meter unit get by Id from concentrator', () => {
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_METER_UNIT_DETAILS_BY_ID_FROM_CONCENTRATOR',
          uponReceiving: 'a request for getting meter unit details by Id from concentrator',
          withRequest: {
            method: service.getMeterUnitFromConcentratorRequest(id).method,
            path: service.getMeterUnitFromConcentratorRequest(id).url,
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

    it('should make request for getting meter unit details by Id from concentrators', (done) => {
      service.getMeterUnitFromConcentrator(id).subscribe(
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
