import { MuCreateRequest } from './../../../src/app/core/repository/interfaces/meter-units/mu-create.interface';
import { MeterUnitsService } from './../../../src/app/core/repository/services/meter-units/meter-units.service';
import { pactFinalize, pactSetAngular, pactVerify, setupPactProvider } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultRequestHeader, defaultResponseHeader } from 'pact/helpers/default-header.helper';
import { ReferenceType } from '../../../src/app/core/repository/interfaces/meter-units/reference-type.enum';
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

  const requestBody: MuCreateRequest = {
    name: 'name',
    serial: '123',
    templateId: 'CA52C039-9E87-4729-8E4A-32DE04AF7BB1',
    communicationType: 1,
    manufacturer: 1,
    protocol: 2,
    medium: 1,
    jobIds: ['16DD56FE-E0C9-46A5-9315-177F0585A32A'],
    ip: '1.1.1.1',
    port: 1,
    isGateWay: true,
    referencingType: ReferenceType.COSEM_LOGICAL_NAME,
    hdlcInformation: {
      clientLow: 1,
      serverLow: 2,
      clientHigh: 3,
      serverHigh: 4,
      publicClientLow: 5,
      publicServerLow: 6,
      publicClientHigh: 7,
      publicServerHigh: 8
    },
    wrapperInformation: {
      clientAddress: 1,
      serverAddress: 2,
      publicClientAddress: 3,
      publicServerAddress: 4,
      physicalAddress: 7
    },
    advancedInformation: {
      startWithRelease: true,
      ldnAsSystitle: true,
      authenticationType: AuthenticationTypeEnum.NONE
    }
  };

  const responseBody = '5727e5ce-bfa7-44c8-b3dc-655566d56e8f';

  describe('meter unit create', () => {
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_CREATE_METER_UNIT',
          uponReceiving: 'a request for creating meter unit',
          withRequest: {
            method: service.createMuRequest(requestBody).method,
            path: service.createMuRequest(requestBody).url,
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request for creating meter unit', (done) => {
      service.createMu(requestBody).subscribe(
        (res: string) => {
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
