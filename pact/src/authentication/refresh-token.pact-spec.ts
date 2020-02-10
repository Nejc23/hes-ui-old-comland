import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { UsersRepositoryService } from 'src/app/shared/repository/services/users-repository.service';
import { AuthenticatedUser } from 'src/app/core/auth/interfaces/authenticated-user.interface';
import { RefreshTokenRequest } from 'src/app/core/auth/interfaces/refresh-token.interface';

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

  const requestBody: RefreshTokenRequest = {
    expiredToken: '27ukVKLJkPR1Dp1dyVA3VB71zZBT73W1IJHMQQA57IY'
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

  describe('User refresh token', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_REFRESH_TOKEN',
          uponReceiving: 'a request for refresh user token',
          withRequest: {
            method: service.refreshUserTokenRequest(requestBody).method,
            path: service.refreshUserTokenRequest(requestBody).url,
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

    it('should make request for refresh user token', done => {
      service.refreshUserToken(requestBody).subscribe(
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
