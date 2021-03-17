import {
  IActionRequestJobsAssignExisting,
  IActionResponseJobsAssignExisting
} from './../../../src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { IActionRequestRelays, IActionResponseRelays } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';

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

  const requestBody: IActionRequestJobsAssignExisting = {
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
      useWildcards: true
    },
    includedIds: ['0A4A1AE4-3964-47D3-9E38-C017833FFE0C', 'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E', '15A607EA-DEB7-46E5-BD5D-F8A067AD2842'],
    scheduleJobIds: ['67825C25-2AAB-4CB8-B4F8-72D5704C22FA', '12325C25-2AAB-4CB8-B4F8-72D5704C2221']
  };

  const responseBody: IActionResponseJobsAssignExisting = {
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
      useWildcards: true
    },
    requestId: 'cca9906e-929b-4104-ab54-f866df79b632',
    includedIds: ['0A4A1AE4-3964-47D3-9E38-C017833FFE0C', 'B1EB39A3-94DA-421A-8E1E-E3F5254A8C8E', '15A607EA-DEB7-46E5-BD5D-F8A067AD2842'],
    scheduleJobIds: ['67825C25-2AAB-4CB8-B4F8-72D5704C22FA', '12325C25-2AAB-4CB8-B4F8-72D5704C2221']
  };

  describe('myGrid.link trigger jobs assign existing with included ids', () => {
    beforeAll((done) => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_FOR_JOBS_ASSIGN_EXISTING_WITH_IDS',
          uponReceiving: 'a request for trigger jobs assign existing with ids in request - myGrid.Link',
          withRequest: {
            method: service.postJobsAssignExistingRequest(requestBody).method,
            path: service.postJobsAssignExistingRequest(requestBody).url,
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

    it('should make request for trigger jobs assign existing with ids in request - myGrid.Link', (done) => {
      service.postJobsAssignExisting(requestBody).subscribe(
        (res: IActionResponseJobsAssignExisting) => {
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
