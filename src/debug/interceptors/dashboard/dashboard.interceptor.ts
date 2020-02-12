import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import * as _ from 'lodash';
import { DashboardModel } from 'src/app/core/repository/interfaces/dashboards/dashboard.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

@Injectable()
export class DashboardInterceptor {
  constructor() {}

  /* TODO DK: to se ne rabi preveri in vrži ven
  // Get dashboards
  static interceptDashboards(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [{ id: 1, value: 'Dashboard 1' }, { id: 2, value: 'Dashboard 2' }];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptDashboards(request: HttpRequest<any>): boolean {
    return new RegExp('/api/dashboards$').test(request.url) && request.method.endsWith('GET');
  }
*/

  //#region  Get dashboard
  static interceptDashboardGetOne(): Observable<HttpEvent<any>> {
    const data: DashboardModel = {
      id: 1,
      refreshEveryMinute: true,
      dashboardName: 'Dashboard 1'
    };

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptDashboardGetOne(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/dashboards/[0-9]+$`).test(request.url) && request.method.endsWith('GET');
  }
  //#endregion

  //#region  post dashboard
  static canInterceptDashboardPost(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/dashboards`).test(request.url) && request.method.endsWith('POST');
  }

  // Post dashboard
  static interceptDashboardPost(request: HttpRequest<DashboardModel>, list: Codelist<number>[]): Observable<HttpEvent<any>> {
    const maxId = _.maxBy(list, 'id');
    const data: DashboardModel = {
      id: maxId.id + 1,
      refreshEveryMinute: request.body.refreshEveryMinute,
      dashboardName: request.body.dashboardName
    };

    list.push({ id: data.id, value: data.dashboardName });

    return of(
      new HttpResponse({
        status: 201,
        body: data
      })
    );
  }
  //#endregion

  //#region  put dashboard
  static canInterceptDashboardPut(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/dashboards/[0-9]+$`).test(request.url) && request.method.endsWith('PUT');
  }

  // Put dashboard
  static interceptDashboardPut(request: HttpRequest<any>, list: Codelist<number>[]): Observable<HttpEvent<DashboardModel>> {
    const body: DashboardModel = request.body;

    const dashboard = _.findLast(list, x => x.id === body.id);
    dashboard.value = body.dashboardName;

    return of(
      new HttpResponse({
        status: 200,
        body
      })
    );
  }
  //#endregion
}
