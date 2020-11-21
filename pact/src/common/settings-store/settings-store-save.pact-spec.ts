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

  describe('Settings store save user settings', () => {
    const userId = '5bcab25b-86a8-4f5a-b869-d147ba1853ce';
    const key = 'dcuList';

    const settings = {
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
          vendorsFilter: null,
          gridLayout: ''
        }
      }
    };

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_SAVING_USER_SETTINGS',
          uponReceiving: 'a request for saving user settings',
          withRequest: {
            method: service.saveUserSettingsRequest(userId, key, settings).method,
            path: service.saveUserSettingsRequest(userId, key, settings).url,
            body: null,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 200,
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

    it('should make request for saving user settings', done => {
      service.saveUserSettings(userId, key, settings).subscribe(res => {
        expect(res).toEqual(null);
        done();
      });
    });
  });
});
