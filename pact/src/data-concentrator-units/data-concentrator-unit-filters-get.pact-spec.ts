import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { DataConcentratorUnitsService } from 'src/app/core/repository/services/data-concentrator-units/data-concentrator-units.service';
import { DcuFilter } from 'src/app/features/data-concentrator-units/interfaces/dcu-filter.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: DataConcentratorUnitsService;

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
    service = getTestBed().get(DataConcentratorUnitsService);
  });

  describe('Data concentrator units filters get request', () => {
    const data: DcuFilter[] = [
      {
        id: 1,
        name: 'My saved filter 1',
        vendor: null,
        statuses: [
          { id: 1, value: 'Active' },
          { id: 3, value: 'Mouted' }
        ],
        types: [1],
        tags: [
          { id: 3, value: 'tag 3' },
          { id: 2, value: 'tag 2' },
          { id: 1, value: 'tag 1' }
        ]
      },
      {
        id: 2,
        name: 'My saved filter 2',
        vendor: 1,
        statuses: [
          { id: 1, value: 'Active' },
          { id: 2, value: 'Inactive' }
        ],
        types: [2, 3],
        tags: [
          { id: 3, value: 'tag 3' },
          { id: 1, value: 'tag 1' }
        ]
      },
      {
        id: 3,
        name: 'My saved filter 3',
        vendor: 2,
        statuses: [{ id: 2, value: 'Inactive' }],
        types: [1, 2],
        tags: []
      },
      {
        id: 4,
        name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        vendor: 2,
        statuses: [],
        types: [2],
        tags: []
      }
    ];

    const responseBody: DcuFilter[] = data;

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_DATA_CONCENTRATOR_UNITS_FILTERS',
          uponReceiving: 'a request for getting data concentrator units filters',
          withRequest: {
            method: service.getDcuFilterRequest().method,
            path: service.getDcuFilterRequest().url,
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

    it('should make request for fetching data concentrator units filters', done => {
      service.getDcuFilter().subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
