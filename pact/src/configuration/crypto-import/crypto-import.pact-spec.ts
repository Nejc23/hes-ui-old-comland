import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { CryptoLiteService } from 'src/app/core/repository/services/crypto-lite/crypto-lite.service';
import { CryptoImportResponse } from 'src/app/core/repository/interfaces/crypto-lite/crypto-import-response.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: CryptoLiteService;

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
    service = getTestBed().inject(CryptoLiteService);
  });

  const responseBody: CryptoImportResponse = {
    uuid: '38cf21aa-821f-40a1-b99d-4368f49196e4',
    result: true,
    errorCode: 0,
    errorMsg: ''
  };

  describe('Crypro import - upload file', () => {
    beforeAll((done) => {
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request for uploading GULF file', (done) => {
      service.uploadCryptoImport().subscribe(
        (res: CryptoImportResponse) => {
          expect(res.uuid).toBeDefined();
          expect(res.result).toEqual(true);
          done();
        },
        (err) => {
          done.fail(err);
        }
      );
    });
  });
});
