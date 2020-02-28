/*import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { TestBed, getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultHeader } from 'pact/helpers/default-header.helper';
import { AuthenticatedUser } from 'src/app/core/auth/interfaces/authenticated-user.interface';
import { LoginCredentials } from 'src/app/core/auth/interfaces/login-credentials.interface';
import { AuthenticationRepositoryService } from 'src/app/core/repository/services/auth/authentication-repository.service';

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

  const requestBody: LoginCredentials = {
    username: 'john.doe@company.com',
    password: '833743434'
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

  describe('User authenticate', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_AUTHENTICATE_USER',
          uponReceiving: 'a request for authenticate user',
          withRequest: {
            method: service.authenticateUserRequest(requestBody).method,
            path: service.authenticateUserRequest(requestBody).url,
            body: requestBody,
            headers: defaultHeader
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

    it('should make request for authenticate user', done => {
      service.authenticateUser(requestBody).subscribe(
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
*/
