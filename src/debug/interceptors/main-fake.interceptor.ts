import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, materialize, dematerialize, mergeMap } from 'rxjs/operators';
import { CodelistInterceptor } from './codelist.interceptor';
import { GridInterceptor } from './grid-items/grid.interceptor';
import { DashboardInterceptor } from './dashboard/dashboard.interceptor';
import { CodelistDashboardsInterceptor } from './codelists/codelist-dashboards.interceptor';
import { GridItemsDataInterceptor } from './grid-items/grid-items-data.interceptor';
import { UsersListInterceptor } from './users/users.list.interceptor';
import { UserInterceptor } from './users/user.interceptor';
import { AuthenticateInterceptor } from './authentication/authenticate.interceptor';
import { UserRequestResetPasswordInterceptor } from './authentication/user-request-reset-password.interceptor';
import { UserChangePasswordInterceptor } from './authentication/user-change-password.interceptor';
import { UserNewPasswordInterceptor } from './authentication/user-new-password.interceptor';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { SampleInterceptor } from './codelists/sample/sample.interceptor';
import { UsersSampleInterceptor } from './codelists/users-sample/users-sample.interceptor';
import { DataConcentratorUnitsListInterceptor } from './data-concentrator-units/data-concentrator-units-list.interceptor';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  listDashboards: Codelist<number>[];
  graphValues: any[];
  currentDate: Date = new Date();
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

            if (SampleInterceptor.canInterceptSample(request)) {
              return SampleInterceptor.interceptSample();
            }
            if (UsersSampleInterceptor.canInterceptUsersSample(request)) {
              return UsersSampleInterceptor.interceptUsersSample(request);
            }

            //#region  dashboards
            /* TODO DK: to se ne rabi vrži ven
            if (DashboardInterceptor.canInterceptDashboards(request)) {
              return DashboardInterceptor.interceptDashboards();
            }*/
            if (DashboardInterceptor.canInterceptDashboardGetOne(request)) {
              return DashboardInterceptor.interceptDashboardGetOne();
            }
            if (DashboardInterceptor.canInterceptDashboardPost(request)) {
              return DashboardInterceptor.interceptDashboardPost(request, this.listDashboards);
            }
            if (DashboardInterceptor.canInterceptDashboardPut(request)) {
              return DashboardInterceptor.interceptDashboardPut(request, this.listDashboards);
            }
            //#endregion

            // grid random data
            if (GridInterceptor.canInterceptGrid(request)) {
              return GridInterceptor.interceptGrid(request);
            }

            if (GridItemsDataInterceptor.canInterceptGridItems(request)) {
              return GridItemsDataInterceptor.interceptGridItems(request);
            }

            if (GridInterceptor.canInterceptGridPut(request)) {
              return GridInterceptor.interceptGridPut(request);
            }

            /*
            // grid India fake data
            if (GridIndiaInterceptor.canInterceptGridIndia(request)) {
              return GridIndiaInterceptor.interceptGridIndia(request);
            }

            if (GridItemsIndiaDataInterceptor.canInterceptGridItemsIndia(request)) {
              return GridItemsIndiaDataInterceptor.interceptGridItemsIndia(request);
            }
            */

            /* for settings widgets list in BE
            if (GridInterceptor.canInterceptGridListItems(request)) {
              return GridInterceptor.interceptGridListItems();
            }*/
            // codelists
            if (CodelistInterceptor.canInterceptPowerlines(request)) {
              return CodelistInterceptor.interceptPowerlines();
            }
            if (CodelistInterceptor.canInterceptDevicesWithPhotos(request)) {
              return CodelistInterceptor.interceptDevicesWithPhotos();
            }
            if (CodelistDashboardsInterceptor.canInterceptDashboards(request)) {
              return CodelistDashboardsInterceptor.interceptDashboards(this.listDashboards);
            }
            if (CodelistInterceptor.canInterceptVoltageLevel(request)) {
              return CodelistInterceptor.interceptVoltageLevel();
            }
            if (CodelistInterceptor.canInterceptWireType(request)) {
              return CodelistInterceptor.interceptWireType();
            }
            if (CodelistInterceptor.canInterceptReportType(request)) {
              return CodelistInterceptor.interceptReportType();
            }
            if (CodelistInterceptor.canInterceptAccessType(request)) {
              return CodelistInterceptor.interceptAccessType();
            }

            // users
            if (UsersListInterceptor.canInterceptUsersList(request)) {
              return UsersListInterceptor.interceptUsersList();
            }

            if (UserInterceptor.canInterceptUserGetOne(request)) {
              return UserInterceptor.interceptUserGetOne();
            }

            if (UserInterceptor.canInterceptUserPost(request)) {
              return UserInterceptor.interceptUserPost(request);
            }

            if (UserInterceptor.canInterceptUserPut(request)) {
              return UserInterceptor.interceptUserPut(request);
            }

            if (UserInterceptor.canInterceptUserDelete(request)) {
              return UserInterceptor.interceptUserDelete(request);
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
    this.listDashboards = [
      { id: 1, value: 'Dashboard 1' },
      { id: 2, value: 'Dashboard my 2' }
    ];
    // this.listDashboards = [];
  }
}

export let fakeBackendProvider = {
  // use fake backend in place of Http service for backend-less development
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
