import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { UsersRepositoryService } from 'src/app/shared/repository/services/users-repository.service';
import { ResetPasswordRequest } from 'src/app/shared/repository/interfaces/responses/authentication.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: UsersRepositoryService;

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
    service = getTestBed().get(UsersRepositoryService);
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
