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

import { JobsDevicesDto } from '../models/jobs-devices-dto';
import { LinkDeviceToSchedulesRequest } from '../models/link-device-to-schedules-request';

@Injectable({
  providedIn: 'root'
})
export class JobDevicesService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation jobDevicePost
   */
  static readonly JobDevicePostPath = '/job-device';

  /**
   * Insert new schedule device.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `jobDevicePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobDevicePost$Response(params?: { body?: LinkDeviceToSchedulesRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, JobDevicesService.JobDevicePostPath, 'post');
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
   * Insert new schedule device.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `jobDevicePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobDevicePost(params?: { body?: LinkDeviceToSchedulesRequest }): Observable<void> {
    return this.jobDevicePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation jobsMetersPost
   */
  static readonly JobsMetersPostPath = '/jobs-meters';

  /**
   * Links devices to jobs.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `jobsMetersPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobsMetersPost$Response(params?: { body?: JobsDevicesDto }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, JobDevicesService.JobsMetersPostPath, 'post');
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
   * Links devices to jobs.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `jobsMetersPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobsMetersPost(params?: { body?: JobsDevicesDto }): Observable<void> {
    return this.jobsMetersPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation jobDeviceScheduleJobIdDeviceIdDelete
   */
  static readonly JobDeviceScheduleJobIdDeviceIdDeletePath = '/job-device/{scheduleJobId}/{deviceId}';

  /**
   * Unlinks device from a scheduled job, both given as a parameter.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `jobDeviceScheduleJobIdDeviceIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  jobDeviceScheduleJobIdDeviceIdDelete$Response(params: {
    /**
     * Scheduled job Id
     */
    scheduleJobId: string;

    /**
     * Device Id
     */
    deviceId: string;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, JobDevicesService.JobDeviceScheduleJobIdDeviceIdDeletePath, 'delete');
    if (params) {
      rb.path('scheduleJobId', params.scheduleJobId, {});
      rb.path('deviceId', params.deviceId, {});
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
   * Unlinks device from a scheduled job, both given as a parameter.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `jobDeviceScheduleJobIdDeviceIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  jobDeviceScheduleJobIdDeviceIdDelete(params: {
    /**
     * Scheduled job Id
     */
    scheduleJobId: string;

    /**
     * Device Id
     */
    deviceId: string;
  }): Observable<void> {
    return this.jobDeviceScheduleJobIdDeviceIdDelete$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
