import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { TestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { AuthenticationRepositoryService } from 'src/app/core/repository/services/auth/authentication-repository.service';
import { ChangePasswordRequest } from 'src/app/core/repository/interfaces/auth/authentication.interface';

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

  const requestBody: ChangePasswordRequest = {
    oldPassword: 'john.doe@company.com',
    newPassword: 'newPassword'
  };

  describe('User change password', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_CHANGE_USER_PASSWORD',
          uponReceiving: 'a request for change user password',
          withRequest: {
            method: service.changePasswordRequest(requestBody).method,
            path: service.changePasswordRequest(requestBody).url,
            body: requestBody,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 204,
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

    it('should make request for change user password', done => {
      service.changePassword(requestBody).subscribe(
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
