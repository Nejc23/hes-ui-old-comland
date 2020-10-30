import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { SettingsStoreService } from 'src/app/core/repository/services/settings-store/settings-store.service';

describe('Pact consumer test', () => {
  let provider;
  let service: SettingsStoreService;

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
    service = getTestBed().inject(SettingsStoreService);
  });

  describe('Settings store get user settings', () => {
    const key = 'dcuList';

    const responseBody = {
      gridState: {
        searchText: 'DC30',
        pageIndex: 0,
        selectedRows: [],
        isSelectedAll: false,
        excludedRows: []
      },
      gridLayout: {
        filter: {
          id: 0,
          name: '',
          statusesFilter: [
            {
              id: 0,
              value: 'UNKNOWN'
            }
          ],
          readStatusFilter: {
            operation: {
              id: '',
              value: ''
            },
            value1: 0,
            value2: 0
          },
          typesFilter: [],
          tagsFilter: [],
          vendorFilter: null,
          gridLayout: ''
        }
      }
    };

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GETTING_USER_SETTINGS',
          uponReceiving: 'a request for getting user settings',
          withRequest: {
            method: service.getUserSettingsRequest(key).method,
            path: service.getUserSettingsRequest(key).url,
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

    it('should make request for getting user settings', done => {
      service.getUserSettings(key).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
