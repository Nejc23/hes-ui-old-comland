import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import { ResponseTOUData, RequestTOUData } from 'src/app/core/repository/interfaces/myGridLink/myGridLink.interceptor';

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

  const requestBody: RequestTOUData = {
    deviceIds: null,
    timeOfUseId: '717D9FD6-478E-4C72-8A3A-0722D85A07B1',
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
    }
  };

  const responseBody: ResponseTOUData = {
    requestId: 'cca9906e-929b-4104-ab54-f866df79b632',
    deviceIds: null,
    timeOfUseId: '717D9FD6-478E-4C72-8A3A-0722D85A07B1',
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
    }
  };

  describe('myGrid.link trigger TOU upload with filter request', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_MY_GRID_LINK_FOR_TRIGGER_TOU_UPLOAD_WITH_FILTER',
          uponReceiving: 'a request for trigger TOU upload with filter in request - myGrid.Link',
          withRequest: {
            method: service.postMyGridTOUDeviceRequest(requestBody).method,
            path: service.postMyGridTOUDeviceRequest(requestBody).url,
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

    it('should make request for trigger TOU upload with filter in request - myGrid.Link', done => {
      service.postMyGridTOUDevice(requestBody).subscribe(
        (res: ResponseTOUData) => {
          expect(res.requestId).toEqual(responseBody.requestId);
          expect(res.deviceIds).toEqual(responseBody.deviceIds);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
