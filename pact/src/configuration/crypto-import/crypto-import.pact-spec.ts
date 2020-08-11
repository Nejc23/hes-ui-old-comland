import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { CryptoImportResponse } from 'src/app/core/repository/interfaces/meter-units/crypto-import-response.interface';

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

  const responseBody: CryptoImportResponse = {
    uuid: '38cf21aa-821f-40a1-b99d-4368f49196e4',
    result: true,
    errorCode: 0,
    errorMsg: ''
  };

  describe('Crypro import - upload file', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_UPLOADING_GULF',
          uponReceiving: 'a request for uploading GULF file',
          withRequest: {
            method: service.uploadCryptoImportRequest().method,
            path: service.uploadCryptoImportRequest().url,
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

    it('should make request for uploading GULF file', done => {
      service.uploadCryptoImport().subscribe(
        (res: CryptoImportResponse) => {
          expect(res.uuid).toBeDefined();
          expect(res.result).toEqual(true);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
