/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { ScheduledRekeyDto } from '../models/scheduled-rekey-dto';

@Injectable({
  providedIn: 'root'
})
export class ScheduledRekeyService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation rekeyJobsPost
   */
  static readonly RekeyJobsPostPath = '/rekey/jobs';

  /**
   * Insert new schedule job.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `rekeyJobsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  rekeyJobsPost$Response(params?: { body?: ScheduledRekeyDto }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ScheduledRekeyService.RekeyJobsPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'text',
          accept: '*/*'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
        })
      );
  }

  /**
   * Insert new schedule job.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `rekeyJobsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  rekeyJobsPost(params?: { body?: ScheduledRekeyDto }): Observable<void> {
    return this.rekeyJobsPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation rekeyJobsScheduleJobIdGet
   */
  static readonly RekeyJobsScheduleJobIdGetPath = '/rekey/jobs/{scheduleJobId}';

  /**
   * Get rekey job.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `rekeyJobsScheduleJobIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  rekeyJobsScheduleJobIdGet$Response(params: { scheduleJobId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ScheduledRekeyService.RekeyJobsScheduleJobIdGetPath, 'get');
    if (params) {
      rb.path('scheduleJobId', params.scheduleJobId, {});
    }

    return this.http
      .request(
        rb.build({
          responseType: 'text',
          accept: '*/*'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
        })
      );
  }

  /**
   * Get rekey job.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `rekeyJobsScheduleJobIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  rekeyJobsScheduleJobIdGet(params: { scheduleJobId: string }): Observable<void> {
    return this.rekeyJobsScheduleJobIdGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation rekeyJobsScheduleJobIdPost
   */
  static readonly RekeyJobsScheduleJobIdPostPath = '/rekey/jobs/{scheduleJobId}';

  /**
   * Insert new schedule job.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `rekeyJobsScheduleJobIdPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  rekeyJobsScheduleJobIdPost$Response(params: { scheduleJobId: string; body?: ScheduledRekeyDto }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ScheduledRekeyService.RekeyJobsScheduleJobIdPostPath, 'post');
    if (params) {
      rb.path('scheduleJobId', params.scheduleJobId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'text',
          accept: '*/*'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
        })
      );
  }

  /**
   * Insert new schedule job.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `rekeyJobsScheduleJobIdPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  rekeyJobsScheduleJobIdPost(params: { scheduleJobId: string; body?: ScheduledRekeyDto }): Observable<void> {
    return this.rekeyJobsScheduleJobIdPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
