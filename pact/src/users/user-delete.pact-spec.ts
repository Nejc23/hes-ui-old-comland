import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { UsersService } from 'src/app/features/users/services/users.service';

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

  describe('Delete user', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_DELETE_USER',
          uponReceiving: 'a request to delete user',
          withRequest: {
            method: service.deleteUserRequest(id).method,
            path: service.deleteUserRequest(id).url,
            headers: {
              ...defaultRequestHeader
            }
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

    it('should make request to delete user', done => {
      service.deleteUser(id).subscribe(
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
