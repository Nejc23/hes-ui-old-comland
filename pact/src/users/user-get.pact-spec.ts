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

  const id = 1;
  describe('User get request', () => {
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
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_USER',
          uponReceiving: 'a request for getting user',
          withRequest: {
            method: service.getUserRequest(id).method,
            path: service.getUserRequest(id).url,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 200,
            headers: defaultResponseHeader,
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

    it('should make request for fetching user', done => {
      service.getUser(id).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
