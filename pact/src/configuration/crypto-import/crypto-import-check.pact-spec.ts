import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { CryptoImportCheckResponse } from 'src/app/core/repository/interfaces/crypto-lite/crypto-import-check-response.interface';
import { CryptoLiteService } from 'src/app/core/repository/services/crypto-lite/crypto-lite.service';

describe('Pact consumer test', () => {
  let provider;
  let service: CryptoLiteService;

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
    service = getTestBed().get(CryptoLiteService);
  });

  describe('Check crypto import', () => {
    const data: CryptoImportCheckResponse = {
      uuid: '38cf21aa-821f-40a1-b99d-4368f49196e4',
      result: true,
      errorCode: 0,
      errorMsg: '',
      fileName: 'gulf2.xml',
      meterCount: 1,
      keyCount: 1,
      status: 'SUCCESS'
    };

    const responseBody: CryptoImportCheckResponse = data;
    const importId = '38cf21aa-821f-40a1-b99d-4368f49196e4';
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_CHECK_CRYPTO_IMPORT',
          uponReceiving: 'a request for check crypto import',
          withRequest: {
            method: service.checkCryptoImportRequest(importId).method,
            path: service.checkCryptoImportRequest(importId).url,
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

    it('should make request for check crypto import status', done => {
      service.checkCryptoImport(importId).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
