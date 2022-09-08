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

import { AddNewJobRequest } from '../models/add-new-job-request';
import { AddNewScheduleDeviceRequest } from '../models/add-new-schedule-device-request';
import { GetJobListSearchRequest } from '../models/get-job-list-search-request';
import { IJobCommand } from '../models/i-job-command';
import { IJobCommandResponseGridModel } from '../models/i-job-command-response-grid-model';
import { IResponseJobModel } from '../models/i-response-job-model';
import { JobType } from '../models/job-type';
import { UpdateJobRequest } from '../models/update-job-request';

@Injectable({
  providedIn: 'root'
})
export class JobsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation jobsGet
   */
  static readonly JobsGetPath = '/jobs';

  /**
   * Return Jobs By Type.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `jobsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  jobsGet$Response(params?: { type?: Array<JobType> }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.JobsGetPath, 'get');
    if (params) {
      rb.query('type', params.type, {});
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
   * Return Jobs By Type.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `jobsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  jobsGet(params?: { type?: Array<JobType> }): Observable<void> {
    return this.jobsGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation jobsPost
   */
  static readonly JobsPostPath = '/jobs';

  /**
   * Insert new schedule job.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `jobsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobsPost$Response(params?: { body?: AddNewJobRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.JobsPostPath, 'post');
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
   * To access the full response (for headers, for example), `jobsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobsPost(params?: { body?: AddNewJobRequest }): Observable<void> {
    return this.jobsPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation jobsJobIdGet
   */
  static readonly JobsJobIdGetPath = '/jobs/{jobId}';

  /**
   * Returns job details (without assigned devices - to retrieve that information, please use the "/device-inventory-ui/meter-units-for-job" endpoint).
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `jobsJobIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  jobsJobIdGet$Response(params: { jobId: string }): Observable<StrictHttpResponse<IJobCommandResponseGridModel>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.JobsJobIdGetPath, 'get');
    if (params) {
      rb.path('jobId', params.jobId, {});
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<IJobCommandResponseGridModel>;
        })
      );
  }

  /**
   * Returns job details (without assigned devices - to retrieve that information, please use the "/device-inventory-ui/meter-units-for-job" endpoint).
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `jobsJobIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  jobsJobIdGet(params: { jobId: string }): Observable<IJobCommandResponseGridModel> {
    return this.jobsJobIdGet$Response(params).pipe(
      map((r: StrictHttpResponse<IJobCommandResponseGridModel>) => r.body as IJobCommandResponseGridModel)
    );
  }

  /**
   * Path part for operation jobsJobIdPut
   */
  static readonly JobsJobIdPutPath = '/jobs/{jobId}';

  /**
   * Update job.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `jobsJobIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobsJobIdPut$Response(params: { jobId: string; body?: UpdateJobRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.JobsJobIdPutPath, 'put');
    if (params) {
      rb.path('jobId', params.jobId, {});
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
   * Update job.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `jobsJobIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobsJobIdPut(params: { jobId: string; body?: UpdateJobRequest }): Observable<void> {
    return this.jobsJobIdPut$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation jobsJobIdDelete
   */
  static readonly JobsJobIdDeletePath = '/jobs/{jobId}';

  /**
   * Delete job.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `jobsJobIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  jobsJobIdDelete$Response(params: { jobId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.JobsJobIdDeletePath, 'delete');
    if (params) {
      rb.path('jobId', params.jobId, {});
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
   * Delete job.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `jobsJobIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  jobsJobIdDelete(params: { jobId: string }): Observable<void> {
    return this.jobsJobIdDelete$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation activeJobsPost
   */
  static readonly ActiveJobsPostPath = '/active-jobs';

  /**
   * Returns list of active jobs.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `activeJobsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  activeJobsPost$Response(params?: { body?: GetJobListSearchRequest }): Observable<StrictHttpResponse<IJobCommandResponseGridModel>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.ActiveJobsPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<IJobCommandResponseGridModel>;
        })
      );
  }

  /**
   * Returns list of active jobs.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `activeJobsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  activeJobsPost(params?: { body?: GetJobListSearchRequest }): Observable<IJobCommandResponseGridModel> {
    return this.activeJobsPost$Response(params).pipe(
      map((r: StrictHttpResponse<IJobCommandResponseGridModel>) => r.body as IJobCommandResponseGridModel)
    );
  }

  /**
   * Path part for operation activeJobsDeviceIdGet
   */
  static readonly ActiveJobsDeviceIdGetPath = '/active-jobs/{deviceId}';

  /**
   * Returns list of active jobs for current device.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `activeJobsDeviceIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  activeJobsDeviceIdGet$Response(params: { deviceId: string }): Observable<StrictHttpResponse<Array<IResponseJobModel>>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.ActiveJobsDeviceIdGetPath, 'get');
    if (params) {
      rb.path('deviceId', params.deviceId, {});
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<Array<IResponseJobModel>>;
        })
      );
  }

  /**
   * Returns list of active jobs for current device.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `activeJobsDeviceIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  activeJobsDeviceIdGet(params: { deviceId: string }): Observable<Array<IResponseJobModel>> {
    return this.activeJobsDeviceIdGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<IResponseJobModel>>) => r.body as Array<IResponseJobModel>)
    );
  }

  /**
   * Path part for operation jobsListPost
   */
  static readonly JobsListPostPath = '/jobs-list';

  /**
   * Returns list of jobs, with search filters and paging.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `jobsListPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobsListPost$Response(params?: { body?: GetJobListSearchRequest }): Observable<StrictHttpResponse<IJobCommandResponseGridModel>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.JobsListPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<IJobCommandResponseGridModel>;
        })
      );
  }

  /**
   * Returns list of jobs, with search filters and paging.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `jobsListPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobsListPost(params?: { body?: GetJobListSearchRequest }): Observable<IJobCommandResponseGridModel> {
    return this.jobsListPost$Response(params).pipe(
      map((r: StrictHttpResponse<IJobCommandResponseGridModel>) => r.body as IJobCommandResponseGridModel)
    );
  }

  /**
   * Path part for operation jobsListByJobIdPost
   */
  static readonly JobsListByJobIdPostPath = '/jobs-list-by-job-id';

  /**
   * Returns job list filtered by list of job ids.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `jobsListByJobIdPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobsListByJobIdPost$Response(params?: { body?: Array<string> }): Observable<StrictHttpResponse<Array<IJobCommand>>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.JobsListByJobIdPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<Array<IJobCommand>>;
        })
      );
  }

  /**
   * Returns job list filtered by list of job ids.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `jobsListByJobIdPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobsListByJobIdPost(params?: { body?: Array<string> }): Observable<Array<IJobCommand>> {
    return this.jobsListByJobIdPost$Response(params).pipe(map((r: StrictHttpResponse<Array<IJobCommand>>) => r.body as Array<IJobCommand>));
  }

  /**
   * Path part for operation jobsEnableJobIdEnablePut
   */
  static readonly JobsEnableJobIdEnablePutPath = '/jobs-enable/{jobId}/{enable}';

  /**
   * Enable/disable job: 1- enable; 0 - disable.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `jobsEnableJobIdEnablePut()` instead.
   *
   * This method doesn't expect any request body.
   */
  jobsEnableJobIdEnablePut$Response(params: { jobId: string; enable: number }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.JobsEnableJobIdEnablePutPath, 'put');
    if (params) {
      rb.path('jobId', params.jobId, {});
      rb.path('enable', params.enable, {});
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
   * Enable/disable job: 1- enable; 0 - disable.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `jobsEnableJobIdEnablePut$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  jobsEnableJobIdEnablePut(params: { jobId: string; enable: number }): Observable<void> {
    return this.jobsEnableJobIdEnablePut$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation jobsExecuteJobIdPut
   */
  static readonly JobsExecuteJobIdPutPath = '/jobs-execute/{jobId}';

  /**
   * Execute job now.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `jobsExecuteJobIdPut()` instead.
   *
   * This method doesn't expect any request body.
   */
  jobsExecuteJobIdPut$Response(params: { jobId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.JobsExecuteJobIdPutPath, 'put');
    if (params) {
      rb.path('jobId', params.jobId, {});
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
   * Execute job now.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `jobsExecuteJobIdPut$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  jobsExecuteJobIdPut(params: { jobId: string }): Observable<void> {
    return this.jobsExecuteJobIdPut$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation addNewScheduleDevicePost
   */
  static readonly AddNewScheduleDevicePostPath = '/add-new-schedule-device';

  /**
   * Insert new schedule device.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addNewScheduleDevicePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addNewScheduleDevicePost$Response(params?: { body?: AddNewScheduleDeviceRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.AddNewScheduleDevicePostPath, 'post');
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
   * To access the full response (for headers, for example), `addNewScheduleDevicePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addNewScheduleDevicePost(params?: { body?: AddNewScheduleDeviceRequest }): Observable<void> {
    return this.addNewScheduleDevicePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation deviceDeviceIdNextReadGet
   */
  static readonly DeviceDeviceIdNextReadGetPath = '/device/{deviceId}/next-read';

  /**
   * Gets device next read.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceDeviceIdNextReadGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceDeviceIdNextReadGet$Response(params: {
    /**
     * Device id
     */
    deviceId: string;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.DeviceDeviceIdNextReadGetPath, 'get');
    if (params) {
      rb.path('deviceId', params.deviceId, {});
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<string>;
        })
      );
  }

  /**
   * Gets device next read.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deviceDeviceIdNextReadGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceDeviceIdNextReadGet(params: {
    /**
     * Device id
     */
    deviceId: string;
  }): Observable<string> {
    return this.deviceDeviceIdNextReadGet$Response(params).pipe(map((r: StrictHttpResponse<string>) => r.body as string));
  }

  /**
   * Path part for operation concentratorConcentratorIdNextReadGet
   */
  static readonly ConcentratorConcentratorIdNextReadGetPath = '/concentrator/{concentratorId}/next-read';

  /**
   * Gets concentrator next read.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `concentratorConcentratorIdNextReadGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  concentratorConcentratorIdNextReadGet$Response(params: {
    /**
     * Concentrator id
     */
    concentratorId: string;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, JobsService.ConcentratorConcentratorIdNextReadGetPath, 'get');
    if (params) {
      rb.path('concentratorId', params.concentratorId, {});
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<string>;
        })
      );
  }

  /**
   * Gets concentrator next read.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `concentratorConcentratorIdNextReadGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  concentratorConcentratorIdNextReadGet(params: {
    /**
     * Concentrator id
     */
    concentratorId: string;
  }): Observable<string> {
    return this.concentratorConcentratorIdNextReadGet$Response(params).pipe(map((r: StrictHttpResponse<string>) => r.body as string));
  }
}
