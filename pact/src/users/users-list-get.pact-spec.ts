import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { UsersListRepository } from 'src/app/core/repository/interfaces/users/user-list-repository.interface';
import { UsersRepositoryService } from 'src/app/core/repository/services/users/users-repository.service';

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

  describe('Configuration users get list request', () => {
    const responseBody: UsersListRepository[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Smith',
        userName: 'SmithJ',
        accessTypeName: 'Super user',
        email: 'john.smith@MapListWidget.com',
        lastChange: '2019-08-23T09:43:35.355'
      },
      {
        id: 10,
        firstName: 'Evans',
        lastName: 'Jones',
        userName: 'JonesE',
        accessTypeName: 'user',
        email: 'evans,jines@company.com',
        lastChange: '2020-02-11T12:56:12.327'
      }
    ];
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_USERS_LIST',
          uponReceiving: 'a request for getting list of users',
          withRequest: {
            method: service.getUsersListRequest().method,
            path: service.getUsersListRequest().url,
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

    it('should make request for fetching list of users', done => {
      service.getUsersList().subscribe(res => {
        expect(res).toEqual(responseBody);
        expect(res.length).toEqual(2);
        done();
      });
    });
  });
});
