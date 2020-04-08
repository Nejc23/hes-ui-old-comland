import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: MeterUnitsService;

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
    service = getTestBed().get(MeterUnitsService);
  });

  describe('Meter unit filters get request', () => {
    const data: MeterUnitsLayout[] = [
      {
        id: 1,
        name: 'My saved filter 1',
        vendorFilter: null,
        statusesFilter: [
          { id: 1, value: 'Active' },
          { id: 3, value: 'Mouted' }
        ],
        readStatusFilter: {
          operation: { id: 'Greater Than', value: 'Greater Than' },
          value1: 12,
          value2: null
        },
        tagsFilter: [
          { id: 3, value: 'tag 3' },
          { id: 2, value: 'tag 2' },
          { id: 1, value: 'tag 1' }
        ],
        firmwareFilter: [{ id: 1, value: 'frmware 1' }],
        breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
        showDeletedMeterUnitsFilter: true,
        showOnlyMeterUnitsWithMBusInfoFilter: false,
        gridLayout:
          '%5B%7B%22colId%22%3A%220%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A27%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id%22%2C%22hide%22%3Atrue%2C%22aggFunc%22%3Anull%2C%22width%22%3A20%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A130%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22metersValue%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22type%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A53%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22idNumber%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22ip%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22lastCommunication%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A266%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
      },
      {
        id: 2,
        name: 'My saved filter 2',
        vendorFilter: { id: 1, value: 'Vendor 1' },
        statusesFilter: [
          { id: 1, value: 'Active' },
          { id: 2, value: 'Inactive' }
        ],
        readStatusFilter: {
          operation: { id: 'In Range', value: 'In Range' },
          value1: 20.5,
          value2: 50.3
        },
        tagsFilter: [
          { id: 3, value: 'tag 3' },
          { id: 1, value: 'tag 1' }
        ],
        firmwareFilter: [{ id: 1, value: 'frmware 1' }],
        breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
        showDeletedMeterUnitsFilter: true,
        showOnlyMeterUnitsWithMBusInfoFilter: true,
        gridLayout:
          '%5B%7B%22colId%22%3A%220%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A27%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id%22%2C%22hide%22%3Atrue%2C%22aggFunc%22%3Anull%2C%22width%22%3A20%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A130%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22metersValue%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22type%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A53%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22idNumber%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22ip%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22lastCommunication%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A266%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
      },
      {
        id: 3,
        name: 'My saved filter 3',
        vendorFilter: { id: 2, value: 'Vendor 2' },
        statusesFilter: [{ id: 2, value: 'Inactive' }],
        readStatusFilter: {
          operation: { id: '', value: '' },
          value1: 0,
          value2: null
        },
        tagsFilter: [],
        firmwareFilter: [{ id: 2, value: 'frmware 2' }],
        breakerStateFilter: [{ id: 2, value: 'breaker state 2' }],
        showDeletedMeterUnitsFilter: false,
        showOnlyMeterUnitsWithMBusInfoFilter: false,
        gridLayout:
          '%5B%7B%22colId%22%3A%220%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A27%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id%22%2C%22hide%22%3Atrue%2C%22aggFunc%22%3Anull%2C%22width%22%3A20%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A130%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22metersValue%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22type%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A53%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22idNumber%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22ip%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22lastCommunication%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A266%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
      },
      {
        id: 4,
        name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        vendorFilter: { id: 2, value: 'Vendor 2' },
        statusesFilter: [],
        readStatusFilter: {
          operation: { id: '', value: '' },
          value1: 0,
          value2: null
        },
        tagsFilter: [],
        firmwareFilter: [{ id: 2, value: 'frmware 2' }],
        breakerStateFilter: [{ id: 2, value: 'breaker state 2' }],
        showDeletedMeterUnitsFilter: true,
        showOnlyMeterUnitsWithMBusInfoFilter: false,
        gridLayout:
          '%5B%7B%22colId%22%3A%220%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A27%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id%22%2C%22hide%22%3Atrue%2C%22aggFunc%22%3Anull%2C%22width%22%3A20%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A130%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22metersValue%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22type%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A53%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22idNumber%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22ip%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22lastCommunication%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A266%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
      }
    ];

    const responseBody: MeterUnitsLayout[] = data;
    const meterUnitTypeId = 1;
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_METER_UNIT_FILTERS_BY_TYPE',
          uponReceiving: 'a request for getting meter unit filters by type',
          withRequest: {
            method: service.getMeterUnitsLayoutRequest(meterUnitTypeId).method,
            path: service.getMeterUnitsLayoutRequest(meterUnitTypeId).url,
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

    it('should make request for fetching meter unit filters by type', done => {
      service.getMeterUnitsLayout(meterUnitTypeId).subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
