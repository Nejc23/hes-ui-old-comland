import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { TestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { AuthenticationRepositoryService } from 'src/app/core/repository/services/auth/authentication-repository.service';
import { ResetPasswordRequest } from 'src/app/core/repository/interfaces/auth/authentication.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: AuthenticationRepositoryService;

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
    service = TestBed.inject(AuthenticationRepositoryService);
  });

  const requestBody: ResetPasswordRequest = {
    email: 'john.doe@company.com',
    url: 'https://page/login'
  };

  describe('User request password reset', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_RESET_USER_PASSWORD',
          uponReceiving: 'a request for reset user password',
          withRequest: {
            method: service.requestPasswordResetRequest(requestBody).method,
            path: service.requestPasswordResetRequest(requestBody).url,
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
          err => {
            done.fail(err);
          }
        );
    });

    it('should make request for reset user password', done => {
      service.requestPasswordReset(requestBody).subscribe(
        res => {
          expect(res).toEqual(null);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
