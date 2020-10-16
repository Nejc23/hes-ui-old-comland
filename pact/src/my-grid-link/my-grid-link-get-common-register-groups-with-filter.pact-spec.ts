import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import {
  RequestCommonRegisterGroup,
  ResponseCommonRegisterGroup
} from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';

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
    service = getTestBed().inject(MyGridLinkService);
  });

  const requestBody: RequestCommonRegisterGroup = {
    deviceIds: null,
    filter: {
      statuses: [{ id: 1, value: 'active' }],
      readStatus: {
        operation: { id: 'Greater Than', value: 'Greater Than' },
        value1: 12,
        value2: null
      },
      vendor: { id: 2, value: 'Vendor 2' },
      tags: [
        { id: 1, value: 'tag1' },
        { id: 2, value: 'tag2' }
      ],
      firmware: [{ id: 1, value: '12.3.1' }],
      disconnectorState: [
        { id: 1, value: 'breaker 1' },
        { id: 5, value: 'breaker 5' }
      ],
      showChildInfoMBus: true,
      showDeleted: true
    },
    search: [{ colId: 'all', type: 'like', value: 'name' }],
    excludeIds: ['cca9906e-929b-4104-ab54-f866df-79b632'],
    type: 'MONITOR'
  };

  const responseBody: ResponseCommonRegisterGroup[] = [
    {
      registerGroupId: '3e46c193-2272-4193-8341-4364c5e7f52c',
      name: 'Monitor',
      type: 'MONITOR',
      registerDefinitions: [
        {
          registerDefinitionId: '2dde25ae-ad60-4402-badd-18dbe1d40dd3',
          name: 'Current L3 monitor',
          obisCode: '1.0.71.4.0.255',
          classId: 21,
          attributeId: 2,
          type: 'MONITOR_PHASE_3',
          dataType: 'unknown',
          iecCode: '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0'
        },
        {
          registerDefinitionId: '97179cc6-bd90-43aa-9f15-8cc19ef38eb8',
          name: 'Current L2 monitor',
          obisCode: '1.0.51.4.0.255',
          classId: 21,
          attributeId: 2,
          type: 'MONITOR_PHASE_2',
          dataType: 'unknown',
          iecCode: '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0'
        },
        {
          registerDefinitionId: '199b8d38-ec3e-438c-9126-a593dd029a76',
          name: 'Current L1 monitor',
          obisCode: '1.0.31.4.0.255',
          classId: 21,
          attributeId: 2,
          type: 'MONITOR_PHASE_1',
          dataType: 'unknown',
          iecCode: '0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0'
        }
      ]
    },
    {
      registerGroupId: 'fb9a9c67-8f76-4c2b-b75f-68ee301f2124',
      name: 'Monitor',
      type: 'MONITOR',
      registerDefinitions: [
        {
          registerDefinitionId: '6ce3983d-e653-41e6-a314-4edd928f1728',
          name: 'Current L2 monitor',
          obisCode: '1.0.51.4.0.255',
          classId: 21,
          attributeId: 2,
          type: 'MONITOR_PHASE_2',
          dataType: 'val',
          iecCode: null
        },
        {
          registerDefinitionId: '25a7dc30-1324-41ae-9288-7200bba9f4b9',
          name: 'Current L1 monitor',
          obisCode: '1.0.31.4.0.255',
          classId: 21,
          attributeId: 2,
          type: 'MONITOR_PHASE_1',
          dataType: 'vaal',
          iecCode: null
        },
        {
          registerDefinitionId: '0cfd6b13-643d-40ec-921d-7205933c4012',
          name: 'Current L3 monitor',
          obisCode: '1.0.71.4.0.255',
          classId: 21,
          attributeId: 2,
          type: 'MONITOR_PHASE_3',
          dataType: 'vaal',
          iecCode: null
        }
      ]
    }
  ];

  describe('myGrid.link get common register groups with filter request', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_FOR_GET_COMMON_REGISTER_GROUPS_WITH_FILTER',
          uponReceiving: 'a request for getting common register groups with filter in request - myGrid.Link',
          withRequest: {
            method: service.getCommonRegisterGroupRequest(requestBody).method,
            path: service.getCommonRegisterGroupRequest(requestBody).url,
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

    it('should make request for getting common register groups with filter in request - myGrid.Link', done => {
      service.getCommonRegisterGroup(requestBody).subscribe(
        (res: ResponseCommonRegisterGroup[]) => {
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
