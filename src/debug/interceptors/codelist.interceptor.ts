import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';
import { companies } from 'src/app/core/repository/consts/authentication-endpoint-url.const';
import { dcuStatuses, dcuTags, dcuTypes, dcuVendors } from 'src/app/core/repository/consts/data-concentrator-units.const';
import { schedulerJobs } from 'src/app/core/repository/consts/jobs.const';
import { CodelistExt } from 'src/app/shared/repository/interfaces/codelists/codelist-ext.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

@Injectable()
export class CodelistInterceptor {
  constructor(private jwtHelperService: JwtHelperService) {}

  static interceptDcuStatus(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 0,
        value: 'unknow'
      },
      {
        id: 1,
        value: 'ACTIVE'
      },
      {
        id: 2,
        value: 'INACTIVE'
      },
      {
        id: 3,
        value: 'MOUNTED'
      },
      {
        id: 4,
        value: 'DELETED'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptDcuStatus(request: HttpRequest<any>): boolean {
    return new RegExp(dcuStatuses).test(request.url);
  }

  static interceptDcuType(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 1,
        value: 'DC450G3'
      },
      {
        id: 2,
        value: 'AC750'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptDcuType(request: HttpRequest<any>): boolean {
    return new RegExp(dcuTypes).test(request.url);
  }

  static interceptDcuVendor(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 0,
        value: 'unknown'
      },
      {
        id: 1,
        value: 'LANDISGYR'
      },
      {
        id: 2,
        value: 'ISKRAEMECO'
      },
      {
        id: 3,
        value: 'ENSOR'
      },
      {
        id: 4,
        value: 'ELSTER'
      },
      {
        id: 5,
        value: 'SAGEMCOM'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptDcuVendor(request: HttpRequest<any>): boolean {
    return new RegExp(dcuVendors).test(request.url);
  }

  static interceptDcuTag(): Observable<HttpEvent<any>> {
    const data: Codelist<number>[] = [
      {
        id: 1,
        value: 'tag 1'
      },
      {
        id: 2,
        value: 'tag 2'
      },
      {
        id: 3,
        value: 'tag 3'
      },
      {
        id: 4,
        value: 'tag 4'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptDcuTag(request: HttpRequest<any>): boolean {
    return new RegExp(dcuTags).test(request.url);
  }

  // list of user companies
  static interceptCompanies(request: HttpRequest<any>): Observable<HttpEvent<any>> {
    const helper = new JwtHelperService();
    const token = request.headers.get('Authorization').replace('Bearer ', '');
    const decodedToken = helper.decodeToken(token);
    let data: Codelist<number>[];
    if (decodedToken.family_name.includes('SuperAdmin')) {
      data = [
        {
          id: 1,
          value: 'Metricsx'
        },
        {
          id: 2,
          value: 'Comland'
        },
        {
          id: 3,
          value: 'Eles'
        }
      ];
    } else {
      data = [
        {
          id: 1,
          value: 'Metricsx'
        }
      ];
    }

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }

  static canInterceptCompanies(request: HttpRequest<any>): boolean {
    return new RegExp(companies).test(request.url);
  }

  static canInterceptReadingJobList(request: HttpRequest<any>): boolean {
    return new RegExp(`${schedulerJobs}\\?type=2`).test(request.url);
  }

  static interceptReadingJobList(): Observable<HttpEvent<any>> {
    const data: CodelistExt<string>[] = [
      {
        id: '3323-3434-4344-443',
        value: 'reading job 1',
        nextRun: '2021-07-24T08:30:30+00:00'
      },
      {
        id: '55-3434-4344-35',
        value: 'reading job 2',
        nextRun: '2021-02-2T08:30:30+00:00'
      },
      {
        id: '55-3434-4344-55',
        value: 'reading job 42',
        nextRun: '2021-02-2T08:30:30+00:00'
      },
      {
        id: '55-3434-4344-3444',
        value: 'reading job 5',
        nextRun: '2021-02-2T08:30:30+00:00'
      }
    ];

    return of(
      new HttpResponse({
        status: 200,
        body: data
      })
    );
  }
}
