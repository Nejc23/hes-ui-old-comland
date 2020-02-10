import { Injectable } from '@angular/core';
import { HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Codelist } from 'src/app/shared/forms/interfaces/codelist.interface';

@Injectable()
export class CodelistDashboardsInterceptor {
  constructor() {}

  static interceptDashboards(list: Codelist<number>[]): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = list;
    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptDashboards(request: HttpRequest<any>): boolean {
    return new RegExp(`/api/dashboards`).test(request.url);
  }
}
