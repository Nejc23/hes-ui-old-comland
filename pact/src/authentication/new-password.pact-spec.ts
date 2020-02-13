import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { AuthenticatedUser } from 'src/app/core/auth/interfaces/authenticated-user.interface';
import { AuthenticationRepositoryService } from 'src/app/core/repository/services/auth/authentication-repository.service';
import { NewPasswordRequest } from 'src/app/core/repository/interfaces/auth/authentication.interface';

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
    service = getTestBed().get(AuthenticationRepositoryService);
  });

  const requestBody: NewPasswordRequest = {
    password: '123456',
    resetToken: '039030lll333bgP04'
  };

  const responseBody: AuthenticatedUser = {
    tokenType: 'bearer',
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxMTIzZWFhMC02OTcxLTQxZmEtYjhhZC0wNjFjYzFmM2JiMzAiLCJ1bmlxdWVfbmFtZSI6Ik90bG1SZXN0QXBpIiwidXNlcklkIjoiMTAzNyIsIm5iZiI6MTU3NjQ5ODMxOSwiZXhwIjoxNTc3MzYyMzE5LCJpYXQiOjE1NzY0OTgzMTksImF1ZCI6IkV2ZXJ5b25lIn0.xlInt--Go6K4VrjKbaEo5N4A4PTr07BWIaJOxb2Z2Tk',
    expireDate: '2019-12-26T12:11:59Z',
    refreshToken: '27ukVKLJkPR1Dp1dyVA3VB71zZBT73W1IJHMQQA57IY=',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    accessType: 'user',
    userRights: [
      {
        functionality: 'dashboard',
        writeRights: false
      },
      {
        functionality: 'users',
        writeRights: false
      },
      {
        functionality: 'reports',
        writeRights: false
      }
    ]
  };

  describe('User request set new password', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_SET_USER_NEW_PASSWORD',
          uponReceiving: 'a request for set user new password',
          withRequest: {
            method: service.newPasswordRequest(requestBody).method,
            path: service.newPasswordRequest(requestBody).url,
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
          err => {
            done.fail(err);
          }
        );
    });

    it('should make request for set user new password', done => {
      service.newPassword(requestBody).subscribe(
        (res: AuthenticatedUser) => {
          expect(res.tokenType).toEqual(responseBody.tokenType);
          expect(res.accessToken).toEqual(responseBody.accessToken);
          expect(res.refreshToken).toEqual(responseBody.refreshToken);
          expect(res.expireDate).toEqual(responseBody.expireDate);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
