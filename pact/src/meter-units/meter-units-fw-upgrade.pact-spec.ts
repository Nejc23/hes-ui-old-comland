import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';
import { MeterUnitsFwUpgrade, DcResponse } from 'src/app/core/repository/interfaces/meter-units/meter-units-fw-upgrade.interface';

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

  const requestBody: MeterUnitsFwUpgrade = {
    imageGuid: '32-323-4fgf-ew-434',
    imageIdenifyer: 'identifyer',
    imageSize: 5442,
    imageSignature: 'signature',
    imageFillLastBlock: true,
    bulkActionsRequestParam: {
      id: ['kfkff-werre-rerrr', 'froo4344-434443-4344-4344'],
      filter: null
    }
  };

  const responseBody: DcResponse = {
    status: 'waiting for activiation'
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
          expect(res.status).toEqual(responseBody.status);
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
