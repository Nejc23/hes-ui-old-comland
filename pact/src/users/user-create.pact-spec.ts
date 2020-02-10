import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { UsersService } from 'src/app/features/users/services/users.service';
import { User } from 'src/app/features/users/interfaces/user.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: UsersService;

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
    service = getTestBed().get(UsersService);
  });

  const requestBody: User = {
    id: null,
    firstName: 'John',
    lastName: 'Smith',
    userName: 'SmithJ',
    accessTypeId: 1,
    email: 'john.smith@MapListWidget.com',
    gsmNumber: '3233232',
    officeNumber: '323233'
  };

  const responseBody: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Smith',
    userName: 'SmithJ',
    accessTypeId: 1,
    email: 'john.smith@MapListWidget.com',
    gsmNumber: '3233232',
    officeNumber: '323233'
  };

  describe('User create', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_CREATE_USER',
          uponReceiving: 'a request for creating user',
          withRequest: {
            method: service.createUserRequest(requestBody).method,
            path: service.createUserRequest(requestBody).url,
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

    it('should make request for creating user', done => {
      service.createUser(requestBody).subscribe(
        (res: User) => {
          expect(res.id).toEqual(responseBody.id);
          expect(res.id).toBeGreaterThan(0);
          expect(res.firstName).toEqual(responseBody.firstName);
          expect(res.lastName).toEqual(responseBody.lastName);
          expect(res.userName).toEqual(responseBody.userName);
          expect(res.accessTypeId).toEqual(responseBody.accessTypeId);
          expect(res.email).toEqual(responseBody.email);
          expect(res.gsmNumber).toEqual(responseBody.gsmNumber);
          expect(res.officeNumber).toEqual(responseBody.officeNumber);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
