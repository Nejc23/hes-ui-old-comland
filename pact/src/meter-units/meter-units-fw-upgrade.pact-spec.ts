import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MeterUnitsFwUpgrade, DcResponse } from 'src/app/core/repository/interfaces/meter-units/meter-units-fw-upgrade.interface';
import { MyGridLinkService } from 'src/app/core/repository/services/myGridLink/myGridLink.service';

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

  const requestBody: MeterUnitsFwUpgrade = {
    fileId: '32-323-4fgf-ew-434',
    imageIdent: 'identifyer',
    imageSize: 5442,
    signature: 'signature',
    overrideFillLastBlock: true,
    deviceIds: ['kfkff-werre-rerrr', 'froo4344-434443-4344-4344']
  };

  const responseBody: DcResponse = {
    fileId: '32-323-4fgf-ew-434',
    imageIdent: 'identifyer',
    imageSize: 5442,
    signature: 'signature',
    overrideFillLastBlock: true,
    deviceIds: ['kfkff-werre-rerrr', 'froo4344-434443-4344-4344'],
    requestId: '3090f96a-e341-437c-92bb-2e10d5a8062a'
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
        (res: DcResponse) => {
          expect(res.requestId).toEqual(responseBody.requestId);
          expect(res.deviceIds).toEqual(responseBody.deviceIds);
          expect(res.fileId).toEqual(responseBody.fileId);
          expect(res.imageIdent).toEqual(responseBody.imageIdent);
          expect(res.imageSize).toEqual(responseBody.imageSize);
          expect(res.overrideFillLastBlock).toEqual(responseBody.overrideFillLastBlock);
          expect(res.signature).toEqual(responseBody.signature);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
