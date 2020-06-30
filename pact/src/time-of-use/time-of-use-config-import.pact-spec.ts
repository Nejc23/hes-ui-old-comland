import { setupPactProvider, pactFinalize, pactVerify, pactSetAngular } from 'pact/helpers/pact-setup.helper';
import { getTestBed } from '@angular/core/testing';
import { defaultResponseHeader, defaultRequestHeader } from 'pact/helpers/default-header.helper';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { MeterUnitsTouConfigImport } from 'src/app/core/repository/interfaces/meter-units/meter-units-tou-config-import.interface';

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

  const typeId = 1;
  const requestBody: MeterUnitsTouConfigImport = {
    timeOfUseName: 'NameYourTimeOfUseFile',
    fileContent:
      'data:text/xml;base64,PHRvdSBpZD0iVG91SWQiIGFjdGl2YXRpb25EYXRlPSIzMC4xMi4yMDIwIj4KICA8cGxhbnM+CiAgICA8cGxhbiBpZD0iMSI+CiAgICAgIDxhdCBob3VyPSIxMiIgbWludXRlPSIzMCI+CiAgICAgICAgPHNjcmlwdD4xPC9zY3JpcHQ+CiAgICAgIDwvYXQ+CiAgICA8L3BsYW4+CiAgPC9wbGFucz4KICA8d2Vla3M+CiAgICA8d2VlayBpZD0iMSI+CiAgICAgIDx3ZWVrLWRheSBpZD0iMSI+CiAgICAgICAgPHBsYW4gcmVmPSIxIiAvPgogICAgICA8L3dlZWstZGF5PgogICAgICA8d2Vlay1kYXkgaWQ9IjIiPgogICAgICAgIDxwbGFuIHJlZj0iMSIgLz4KICAgICAgPC93ZWVrLWRheT4KICAgICAgPHdlZWstZGF5IGlkPSIzIj4KICAgICAgICA8cGxhbiByZWY9IjEiIC8+CiAgICAgIDwvd2Vlay1kYXk+CiAgICAgIDx3ZWVrLWRheSBpZD0iNCI+CiAgICAgICAgPHBsYW4gcmVmPSIxIiAvPgogICAgICA8L3dlZWstZGF5PgogICAgICA8d2Vlay1kYXkgaWQ9IjUiPgogICAgICAgIDxwbGFuIHJlZj0iMSIgLz4KICAgICAgPC93ZWVrLWRheT4KICAgICAgPHdlZWstZGF5IGlkPSI2Ij4KICAgICAgICA8cGxhbiByZWY9IjEiIC8+CiAgICAgIDwvd2Vlay1kYXk+CiAgICAgIDx3ZWVrLWRheSBpZD0iNyI+CiAgICAgICAgPHBsYW4gcmVmPSIxIiAvPgogICAgICA8L3dlZWstZGF5PgogICAgPC93ZWVrPgogIDwvd2Vla3M+CiAgPHNlYXNvbnM+CiAgICA8c2Vhc29uIGlkPSIxIiBkYXk9IjMwIiBtb250aD0iMTIiPgogICAgICA8d2VlayByZWY9IjEiIC8+CiAgICA8L3NlYXNvbj4KICA8L3NlYXNvbnM+CiAgPHNwZWNpYWwtZGF5cz4KICAgIDxzcGVjaWFsLWRheSBkYXk9IjMwIiBtb250aD0iMTIiIHllYXI9IjIwMjEiPgogICAgICA8cGxhbiByZWY9IjEiIC8+CiAgICA8L3NwZWNpYWwtZGF5PgogICAgPHNwZWNpYWwtZGF5IGRheT0iMzAiIG1vbnRoPSIxMiI+CiAgICAgIDxwbGFuIHJlZj0iMSIgLz4KICAgIDwvc3BlY2lhbC1kYXk+CiAgPC9zcGVjaWFsLWRheXM+CjwvdG91Pg=='
  };

  describe('TOU import xml configuration file', () => {
    beforeAll(done => {
      provider
        .addInteraction({
          state: 'A_REQUEST_FOR_TOU_IMPORT_CONFIGURATION',
          uponReceiving: 'a request for import TOU xml config',
          withRequest: {
            method: service.importConfigTouRequest(requestBody).method,
            path: service.importConfigTouRequest(requestBody).url,
            body: requestBody,
            headers: defaultRequestHeader
          },
          willRespondWith: {
            status: 201,
            headers: {
              ...defaultResponseHeader
            },
            body: null
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

    it('should make request for import TOU xml config', done => {
      service.importConfigTou(requestBody).subscribe(
        () => {
          done();
        },
        err => {
          done.fail(err);
        }
      );
    });
  });
});
