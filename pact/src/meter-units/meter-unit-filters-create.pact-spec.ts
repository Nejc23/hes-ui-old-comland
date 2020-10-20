import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';

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
    service = getTestBed().inject(MeterUnitsService);
  });

  const typeId = 1;
  const requestBody: MeterUnitsLayout = {
    id: null,
    name: 'Test filter 1',
    statusesFilter: [{ id: 1, value: 'Active' }],
    readStatusFilter: {
      operation: { id: 'Greater Than', value: 'Greater Than' },
      value1: 12,
      value2: null
    },
    tagsFilter: [{ id: 1, value: 'tag 1' }],
    vendorFilter: { id: 1, value: 'Vendor 1' },
    firmwareFilter: [{ id: 1, value: 'frmware 1' }],
    breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
    ciiStateFilter: [{ id: 1, value: 'cii state 1' }],
    showDeletedMeterUnitsFilter: true,
    showOnlyMeterUnitsWithMBusInfoFilter: false,
    showMeterUnitsWithoutTemplateFilter: false,
    showOnlyImageReadyForActivationFilter: false,
    gridLayout:
      '%5B%7B%22colId%22%3A%220%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A27%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id%22%2C%22hide%22%3Atrue%2C%22aggFunc%22%3Anull%2C%22width%22%3A20%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A130%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22metersValue%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22type%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A53%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22idNumber%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22ip%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22lastCommunication%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A266%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
  };

  const responseBody: MeterUnitsLayout = {
    id: 1,
    name: 'Test filter 1',
    statusesFilter: [{ id: 1, value: 'Active' }],
    readStatusFilter: {
      operation: { id: 'Greater Than', value: 'Greater Than' },
      value1: 12,
      value2: null
    },
    tagsFilter: [{ id: 1, value: 'tag 1' }],
    vendorFilter: { id: 1, value: 'Vendor 1' },
    firmwareFilter: [{ id: 1, value: 'frmware 1' }],
    breakerStateFilter: [{ id: 1, value: 'breaker state 1' }],
    ciiStateFilter: [{ id: 1, value: 'cii state 1' }],
    showDeletedMeterUnitsFilter: true,
    showOnlyMeterUnitsWithMBusInfoFilter: false,
    showMeterUnitsWithoutTemplateFilter: false,
    showOnlyImageReadyForActivationFilter: false,
    gridLayout:
      '%5B%7B%22colId%22%3A%220%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A27%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22id%22%2C%22hide%22%3Atrue%2C%22aggFunc%22%3Anull%2C%22width%22%3A20%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22status%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A130%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22name%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22metersValue%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22readStatusPercent%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A80%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3A%22left%22%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22type%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A53%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22vendor%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22idNumber%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22ip%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A66%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22lastCommunication%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A93%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%2C%7B%22colId%22%3A%22tags%22%2C%22hide%22%3Afalse%2C%22aggFunc%22%3Anull%2C%22width%22%3A266%2C%22pivotIndex%22%3Anull%2C%22pinned%22%3Anull%2C%22rowGroupIndex%22%3Anull%7D%5D'
  };

  describe('Meter unit filter create by type', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_CREATE_METER_UNIT_FILTER_BY_TYPE',
          uponReceiving: 'a request for creating meter unit filter by type',
          withRequest: {
            method: service.createMeterUnitsLayoutRequest(typeId, requestBody).method,
            path: service.createMeterUnitsLayoutRequest(typeId, requestBody).url,
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

    it('should make request for creating meter unit filter by type', done => {
      service.createMeterUnitsLayout(typeId, requestBody).subscribe(
        (res: MeterUnitsLayout) => {
          expect(res.id).toEqual(responseBody.id);
          expect(res.id).toBeGreaterThan(0);
          expect(res.name).toEqual(responseBody.name);
          expect(res.statusesFilter).toEqual(responseBody.statusesFilter);
          expect(res.tagsFilter).toEqual(responseBody.tagsFilter);
          expect(res.vendorFilter).toEqual(responseBody.vendorFilter);
          expect(res.readStatusFilter.operation).toEqual(responseBody.readStatusFilter.operation);
          expect(res.readStatusFilter.value1).toEqual(responseBody.readStatusFilter.value1);
          expect(res.readStatusFilter.value2).toEqual(responseBody.readStatusFilter.value2);
          expect(res.firmwareFilter).toEqual(responseBody.firmwareFilter);
          expect(res.breakerStateFilter).toEqual(responseBody.breakerStateFilter);
          expect(res.showDeletedMeterUnitsFilter).toEqual(responseBody.showDeletedMeterUnitsFilter);
          expect(res.showOnlyMeterUnitsWithMBusInfoFilter).toEqual(responseBody.showOnlyMeterUnitsWithMBusInfoFilter);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
