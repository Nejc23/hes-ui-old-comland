import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import * as _ from 'lodash';
import { RegistersSelectService } from 'src/app/core/repository/services/registers-select/registers-select.service';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { GridResponse } from 'src/app/core/repository/interfaces/helpers/grid-response.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: RegistersSelectService;

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
    service = getTestBed().get(RegistersSelectService);
  });

  describe('Meter unit registers', () => {
    const responseBody: RegistersSelectList[] = [
      {
        id: 1,
        name: 'Register PLC temp 1',
        type: 'PLC',
        description: 'description plc 1'
      },
      {
        id: 2,
        name: 'Register PLC temp 2',
        type: 'PLC',
        description: 'description plc 2'
      },
      {
        id: 3,
        name: 'Register PLC temp 3',
        type: 'PLC',
        description: 'description plc 3'
      },
      {
        id: 4,
        name: 'Register PLC temp 4',
        type: 'PLC',
        description: 'description plc 4'
      },
      {
        id: 5,
        name: 'Register PLC temp 5',
        type: 'PLC',
        description: 'description plc 5'
      }
    ];

    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_GET_METER_UNIT_REGISTERS',
          uponReceiving: 'a request for getting meter unit registers',
          withRequest: {
            method: service.getMeterUnitRegistersRequest().method,
            path: service.getMeterUnitRegistersRequest().url,
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

    it('should make request for fetching meter unit registers', done => {
      service.getMeterUnitRegisters().subscribe(res => {
        expect(res).toEqual(responseBody);
        done();
      });
    });
  });
});
