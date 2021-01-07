import { device } from './../../../src/app/core/repository/consts/meter-units.const';
import { MuUpdateRequest } from './../../../src/app/core/repository/interfaces/meter-units/mu-update-request.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';

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

  const deviceId = '32A7C6B2-DC94-498C-9437-2607E833D06E';

  const requestBody: MuUpdateRequest = {
    name: 'Test MU Update 1',
    address: 'Address 1',
    serialNumber: 'SerialNo1',
    latitude: 1.1,
    longitude: 1.2,
    tags: ['tag1', 'tag2']
  };

  describe('Meter unit manually update', () => {
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_UPDATE_METE_UNIT',
          uponReceiving: 'a request for updating meter unit',
          withRequest: {
            method: service.updateMuRequest(deviceId, requestBody).method,
            path: service.updateMuRequest(deviceId, requestBody).url,
            body: requestBody,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 201,
            headers: {
              ...defaultResponseHeader
            },
            body: null
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

    it('should make request for updating meter unit', (done) => {
      service.updateMu(deviceId, requestBody).subscribe(
        (res) => {
          expect(res).toEqual(null);
          done();
        },
        (err) => {
          done.fail(err);
        }
      );
    });
  });
});
