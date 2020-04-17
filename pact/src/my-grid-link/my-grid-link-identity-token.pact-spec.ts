import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import {
  MeterUnitsReadSchedule,
  MeterUnitsReadScheduleService
} from 'src/app/core/repository/interfaces/meter-units/meter-units-read-schedule.interface';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { IdentityToken } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';

describe('Pact consumer test', () => {
  let provider;
  let service: MyGridLinkService;

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
    service = getTestBed().get(MyGridLinkService);
  });

  const responseBody: IdentityToken = {
    AccessToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IlRhUEJZLUlKT0Vta1M1VWpEYjNESkEiLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE1ODY4NzYwNzUsImV4',
    ExpiresIn: 3600,
    TokenType: 'Bearer'
  };

  describe('myGrid.link get identity token', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_GET_IDENTITIY_TOKEN_FOR_MY_GRID_LINK_APIS',
          uponReceiving: 'a request for get identity token for access to myGrid.link api-s',
          withRequest: {
            method: service.getMyGridIdentityTokenRequest().method,
            path: service.getMyGridIdentityTokenRequest().url,
            body: null,
            headers: defaultRequestHeader
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

    it('should make request for get identity token for access to myGrid.link api-s', done => {
      service.getMyGridIdentityToken().subscribe(
        (res: IdentityToken) => {
          expect(res).toEqual(responseBody);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
