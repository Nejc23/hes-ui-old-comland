import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';
import {
  IActionRequestFwUpgradeData,
  IActionResponseFwUpgradeData
} from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';

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

  const requestBody: IActionRequestFwUpgradeData = {
    fileId: '32-323-4fgf-ew-434',
    imageIdent: 'identifyer',
    imageSize: 5442,
    signature: 'signature',
    overrideFillLastBlock: true,
    deviceIds: ['kfkff-werre-rerrr', 'froo4344-434443-4344-4344'],
    pageSize: 1,
    pageNumber: 1,
    sort: [
      {
        index: 0,
        propName: 'Firmware',
        sortOrder: 'Ascending'
      }
    ],
    textSearch: ''
  };

  const responseBody: IActionResponseFwUpgradeData = {
    fileId: '32-323-4fgf-ew-434',
    imageIdent: 'identifyer',
    imageSize: 5442,
    signature: 'signature',
    overrideFillLastBlock: true,
    deviceIds: ['kfkff-werre-rerrr', 'froo4344-434443-4344-4344'],
    requestId: '3090f96a-e341-437c-92bb-2e10d5a8062a',
    pageSize: 1,
    pageNumber: 1,
    sort: [
      {
        index: 0,
        propName: 'Firmware',
        sortOrder: 'Ascending'
      }
    ],
    textSearch: ''
  };

  describe('Meter unit fw upgrade', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_FW_UPGRADE',
          uponReceiving: 'a request for meter unit fw upgrade',
          withRequest: {
            method: service.createFwUpgradeRequest(requestBody).method,
            path: service.createFwUpgradeRequest(requestBody).url,
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

    it('should make request for meter unit fw upgrade', done => {
      service.createFwUpgrade(requestBody).subscribe(
        (res: IActionResponseFwUpgradeData) => {
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
