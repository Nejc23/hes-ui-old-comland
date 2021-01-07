import {
  IActionRequestSetDisplaySettings,
  IActionResponseSetDisplaySettings
} from './../../../src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { IActionRequestTOUData, IActionResponseTOUData } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';

describe('Pact consumer test', () => {
  let provider;
  let service: MyGridLinkService;

  beforeAll((done) => {
    provider = setupPactProvider(done);
  });

  afterAll((done) => {
    pactFinalize(provider, done);
  });

  afterEach((done) => {
    pactVerify(provider, done);
  });

  beforeAll(() => {
    pactSetAngular();
    service = getTestBed().inject(MyGridLinkService);
  });

  const requestBody: IActionRequestSetDisplaySettings = {
    displayGroupName: 'Operating display list',
    displayRegisters: ['Pmax+_T0', 'R1_T2'],
    filter: [
      {
        propName: 'Vendor',
        propValue: '2',
        filterOperation: 'Equal'
      },
      {
        propName: 'Status',
        propValue: '2',
        filterOperation: 'Equal'
      },
      {
        propName: 'Firmware',
        propValue: '2',
        filterOperation: 'Contains'
      }
    ],
    pageSize: 1,
    pageNumber: 1,
    sort: [
      {
        index: 0,
        propName: 'Firmware',
        sortOrder: 'Ascending'
      }
    ],
    textSearch: {
      value: '1234',
      propNames: ['vendor', 'firmware', 'status'],
      useWildcards: false
    }
  };

  const responseBody: IActionResponseSetDisplaySettings = {
    requestId: 'cca9906e-929b-4104-ab54-f866df79b632',
    displayGroupName: 'Operating display list',
    displayRegisters: ['Pmax+_T0', 'R1_T2'],
    filter: [
      {
        propName: 'Vendor',
        propValue: '2',
        filterOperation: 'Equal'
      },
      {
        propName: 'Status',
        propValue: '2',
        filterOperation: 'Equal'
      },
      {
        propName: 'Firmware',
        propValue: '2',
        filterOperation: 'Contains'
      }
    ],
    pageSize: 1,
    pageNumber: 1,
    sort: [
      {
        index: 0,
        propName: 'Firmware',
        sortOrder: 'Ascending'
      }
    ],
    textSearch: {
      value: '1234',
      propNames: ['vendor', 'firmware', 'status'],
      useWildcards: false
    }
  };

  describe('myGrid.link trigger set display settings with filter request', () => {
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_FOR_TRIGGER_SET_DISPLAY_SETTINGS_WITH_FILTER',
          uponReceiving: 'a request for trigger set display settings with filter in request - myGrid.Link',
          withRequest: {
            method: service.setDisplaySettingsRequest(requestBody).method,
            path: service.setDisplaySettingsRequest(requestBody).url,
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
          (err) => {
            done.fail(err);
          }
        );
    });

    it('should make request for trigger set display settings with filter in request - myGrid.Link', (done) => {
      service.setDisplaySettings(requestBody).subscribe(
        (res: IActionResponseSetDisplaySettings) => {
          expect(res).toEqual(responseBody);
          done();
        },
        (err) => {
          done.fail(err);
        }
      );
    });
  });
});
