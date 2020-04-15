import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, materialize, dematerialize, mergeMap } from 'rxjs/operators';
import { CodelistInterceptor } from './codelist.interceptor';
import { AuthenticateInterceptor } from './authentication/authenticate.interceptor';
import { UserRequestResetPasswordInterceptor } from './authentication/user-request-reset-password.interceptor';
import { UserChangePasswordInterceptor } from './authentication/user-change-password.interceptor';
import { UserNewPasswordInterceptor } from './authentication/user-new-password.interceptor';
import { DataConcentratorUnitsListInterceptor } from './data-concentrator-units/data-concentrator-units-list.interceptor';
import { DcuGridLayoutInterceptor } from './data-concentrator-units/dcu-grid-layout.interceptor';
import { DataConcentratorUnitInterceptor } from './data-concentrator-units/data-concentrator-unit.interceptor';
import { MeterUnitsListInterceptor } from './meter-units/meter-units-list.interceptor';
import { MeterUnitsTypeGridLayoutInterceptor } from './meter-units/meter-units-type-grid-layout.interceptor';
import { MeterUnitCodelistInterceptor } from './meter-units/code-lists.interceptor';
import { RegistersSelectInterceptor } from './registers-select/registers-select.interceptor';
import { MeterUnitsSchedulerInterceptor } from './meter-units/meter-units-scheduler.interceptor';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor() {
    this.setVariables();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`${request.method} ${request.url}`);
    return (
      of(null)
        .pipe(
          mergeMap(() => {
            // DCU
            if (DataConcentratorUnitsListInterceptor.canInterceptDataConcentratorUnitsList(request)) {
              return DataConcentratorUnitsListInterceptor.interceptDataConcentratorUnitsList(request);
            }

            if (DcuGridLayoutInterceptor.canInterceptDcuLayoutGet(request)) {
              return DcuGridLayoutInterceptor.interceptDcuLayoutGet();
            }

            if (DcuGridLayoutInterceptor.canInterceptDcuLayoutPost(request)) {
              return DcuGridLayoutInterceptor.interceptDcuLayoutPost(request);
            }

            if (DataConcentratorUnitInterceptor.canInterceptDcuCreatePost(request)) {
              return DataConcentratorUnitInterceptor.interceptDcuCreatePost(request);
            }

            if (DcuGridLayoutInterceptor.canInterceptDcuLayoutPut(request)) {
              return DcuGridLayoutInterceptor.interceptDcuLayoutPut(request);
            }

            if (DcuGridLayoutInterceptor.canInterceptDcuLayoutDelete(request)) {
              return DcuGridLayoutInterceptor.interceptDcuLayoutDelete(request);
            }

            if (MeterUnitsSchedulerInterceptor.canInterceptMeterUnitSchedulerPost(request)) {
              return MeterUnitsSchedulerInterceptor.interceptMeterUnitSchedulerPost(request);
            }

            // registers
            if (RegistersSelectInterceptor.canInterceptMeterUnitRegisters(request)) {
              return RegistersSelectInterceptor.interceptMeterUnitRegisters(request);
            }

            // codelists dcu
            if (CodelistInterceptor.canInterceptDcuStatus(request)) {
              return CodelistInterceptor.interceptDcuStatus();
            }
            if (CodelistInterceptor.canInterceptDcuTag(request)) {
              return CodelistInterceptor.interceptDcuTag();
            }
            if (CodelistInterceptor.canInterceptDcuType(request)) {
              return CodelistInterceptor.interceptDcuType();
            }
            if (CodelistInterceptor.canInterceptDcuVendor(request)) {
              return CodelistInterceptor.interceptDcuVendor();
            }

            // meter unit codelists
            if (MeterUnitCodelistInterceptor.canInterceptMeterUnitType(request)) {
              return MeterUnitCodelistInterceptor.interceptMeterUnitType();
            }
            if (MeterUnitCodelistInterceptor.canInterceptMeterUnitStatus(request)) {
              return MeterUnitCodelistInterceptor.interceptMeterUnitStatus();
            }
            if (MeterUnitCodelistInterceptor.canInterceptMeterUnitVendor(request)) {
              return MeterUnitCodelistInterceptor.interceptMeterUnitVendor();
            }
            if (MeterUnitCodelistInterceptor.canInterceptMeterUnitTag(request)) {
              return MeterUnitCodelistInterceptor.interceptMeterUnitTag();
            }
            if (MeterUnitCodelistInterceptor.canInterceptMeterUnitFirmware(request)) {
              return MeterUnitCodelistInterceptor.interceptMeterUnitFirmware();
            }
            if (MeterUnitCodelistInterceptor.canInterceptMeterUnitBreakerState(request)) {
              return MeterUnitCodelistInterceptor.interceptMeterUnitBreakerState();
            }

            // authenticate
            if (AuthenticateInterceptor.canInterceptAuthenticateUser(request)) {
              return AuthenticateInterceptor.interceptAuthenticateUser();
            }
            if (AuthenticateInterceptor.canInterceptRefreshToken(request)) {
              return AuthenticateInterceptor.interceptRefreshToken();
            }
            if (UserRequestResetPasswordInterceptor.canInterceptUserRequestResetPassword(request)) {
              return UserRequestResetPasswordInterceptor.interceptUserRequestResetPassword();
            }
            if (UserChangePasswordInterceptor.canInterceptUserChangePassword(request)) {
              return UserChangePasswordInterceptor.interceptUserChangePassword();
            }
            if (UserNewPasswordInterceptor.canInterceptUserNewPassword(request)) {
              return UserNewPasswordInterceptor.interceptUserNewPassword();
            }

            // meter Units
            if (MeterUnitsListInterceptor.canInterceptMeterUnitsList(request)) {
              return MeterUnitsListInterceptor.interceptMeterUnitsList(request);
            }

            if (MeterUnitsTypeGridLayoutInterceptor.canInterceptMutLayoutGet(request)) {
              return MeterUnitsTypeGridLayoutInterceptor.interceptMutLayoutGet();
            }

            if (MeterUnitsTypeGridLayoutInterceptor.canInterceptMutLayoutPost(request)) {
              return MeterUnitsTypeGridLayoutInterceptor.interceptMutLayoutPost(request);
            }

            if (MeterUnitsTypeGridLayoutInterceptor.canInterceptMutLayoutPut(request)) {
              return MeterUnitsTypeGridLayoutInterceptor.interceptMutLayoutPut(request);
            }

            if (MeterUnitsTypeGridLayoutInterceptor.canInterceptMutLayoutDelete(request)) {
              return MeterUnitsTypeGridLayoutInterceptor.interceptMutLayoutDelete(request);
            }

            // pass through any requests not handled above
            return next.handle(request);
          })
        )

        // call materialize and dematerialize to ensure delay even if an error is thrown
        // (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize())
    );
  }

  setVariables() {
    //
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
