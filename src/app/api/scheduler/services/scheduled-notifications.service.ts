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

import { ScheduledNotificationDto } from '../models/scheduled-notification-dto';

@Injectable({
  providedIn: 'root'
})
export class ScheduledNotificationsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation notificationsJobsPost
   */
  static readonly NotificationsJobsPostPath = '/notifications/jobs';

  /**
   * Insert new schedule job.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `notificationsJobsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  notificationsJobsPost$Response(params?: { body?: ScheduledNotificationDto }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ScheduledNotificationsService.NotificationsJobsPostPath, 'post');
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
   * To access the full response (for headers, for example), `notificationsJobsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  notificationsJobsPost(params?: { body?: ScheduledNotificationDto }): Observable<void> {
    return this.notificationsJobsPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation notificationsJobsScheduleJobIdGet
   */
  static readonly NotificationsJobsScheduleJobIdGetPath = '/notifications/jobs/{scheduleJobId}';

  /**
   * Insert new schedule job.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `notificationsJobsScheduleJobIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  notificationsJobsScheduleJobIdGet$Response(params: { scheduleJobId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ScheduledNotificationsService.NotificationsJobsScheduleJobIdGetPath, 'get');
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
   * Insert new schedule job.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `notificationsJobsScheduleJobIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  notificationsJobsScheduleJobIdGet(params: { scheduleJobId: string }): Observable<void> {
    return this.notificationsJobsScheduleJobIdGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation notificationsJobsScheduleJobIdPost
   */
  static readonly NotificationsJobsScheduleJobIdPostPath = '/notifications/jobs/{scheduleJobId}';

  /**
   * Insert new schedule job.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `notificationsJobsScheduleJobIdPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  notificationsJobsScheduleJobIdPost$Response(params: {
    scheduleJobId: string;
    body?: ScheduledNotificationDto;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ScheduledNotificationsService.NotificationsJobsScheduleJobIdPostPath, 'post');
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
   * To access the full response (for headers, for example), `notificationsJobsScheduleJobIdPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  notificationsJobsScheduleJobIdPost(params: { scheduleJobId: string; body?: ScheduledNotificationDto }): Observable<void> {
    return this.notificationsJobsScheduleJobIdPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
