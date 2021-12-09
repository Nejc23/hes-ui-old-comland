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

import { DayCreateDto } from '../models/day-create-dto';
import { DayUpdateDto } from '../models/day-update-dto';

@Injectable({
  providedIn: 'root'
})
export class DayService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation configurationsConfigurationIdCanDeleteDaysDayIdGet
   */
  static readonly ConfigurationsConfigurationIdCanDeleteDaysDayIdGetPath = '/configurations/{configurationId}/can-delete-days/{dayId}';

  /**
   * Can delete day.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdCanDeleteDaysDayIdGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdCanDeleteDaysDayIdGet$Plain$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;
  }): Observable<StrictHttpResponse<boolean>> {
    const rb = new RequestBuilder(this.rootUrl, DayService.ConfigurationsConfigurationIdCanDeleteDaysDayIdGetPath, 'get');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('dayId', params.dayId, {});
    }

    return this.http
      .request(
        rb.build({
          responseType: 'text',
          accept: 'text/plain'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
        })
      );
  }

  /**
   * Can delete day.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdCanDeleteDaysDayIdGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdCanDeleteDaysDayIdGet$Plain(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;
  }): Observable<boolean> {
    return this.configurationsConfigurationIdCanDeleteDaysDayIdGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Can delete day.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdCanDeleteDaysDayIdGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdCanDeleteDaysDayIdGet$Json$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;
  }): Observable<StrictHttpResponse<boolean>> {
    const rb = new RequestBuilder(this.rootUrl, DayService.ConfigurationsConfigurationIdCanDeleteDaysDayIdGetPath, 'get');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('dayId', params.dayId, {});
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'text/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return (r as HttpResponse<any>).clone({ body: String((r as HttpResponse<any>).body) === 'true' }) as StrictHttpResponse<boolean>;
        })
      );
  }

  /**
   * Can delete day.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdCanDeleteDaysDayIdGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdCanDeleteDaysDayIdGet$Json(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;
  }): Observable<boolean> {
    return this.configurationsConfigurationIdCanDeleteDaysDayIdGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation configurationsConfigurationIdDaysPost
   */
  static readonly ConfigurationsConfigurationIdDaysPostPath = '/configurations/{configurationId}/days';

  /**
   * Create day.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdDaysPost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdDaysPost$Plain$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day object
     */
    body?: DayCreateDto;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, DayService.ConfigurationsConfigurationIdDaysPostPath, 'post');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'text',
          accept: 'text/plain'
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
   * Create day.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdDaysPost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdDaysPost$Plain(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day object
     */
    body?: DayCreateDto;
  }): Observable<string> {
    return this.configurationsConfigurationIdDaysPost$Plain$Response(params).pipe(map((r: StrictHttpResponse<string>) => r.body as string));
  }

  /**
   * Create day.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdDaysPost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdDaysPost$Json$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day object
     */
    body?: DayCreateDto;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, DayService.ConfigurationsConfigurationIdDaysPostPath, 'post');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.body(params.body, 'application/*+json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'text/json'
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
   * Create day.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdDaysPost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdDaysPost$Json(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day object
     */
    body?: DayCreateDto;
  }): Observable<string> {
    return this.configurationsConfigurationIdDaysPost$Json$Response(params).pipe(map((r: StrictHttpResponse<string>) => r.body as string));
  }

  /**
   * Path part for operation configurationsConfigurationIdDaysDayIdPut
   */
  static readonly ConfigurationsConfigurationIdDaysDayIdPutPath = '/configurations/{configurationId}/days/{dayId}';

  /**
   * Update day.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdDaysDayIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdDaysDayIdPut$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;

    /**
     * Configuration object
     */
    body?: DayUpdateDto;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, DayService.ConfigurationsConfigurationIdDaysDayIdPutPath, 'put');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('dayId', params.dayId, {});
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
   * Update day.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdDaysDayIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdDaysDayIdPut(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;

    /**
     * Configuration object
     */
    body?: DayUpdateDto;
  }): Observable<void> {
    return this.configurationsConfigurationIdDaysDayIdPut$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation configurationsConfigurationIdDaysDayIdDelete
   */
  static readonly ConfigurationsConfigurationIdDaysDayIdDeletePath = '/configurations/{configurationId}/days/{dayId}';

  /**
   * Delete day.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdDaysDayIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdDaysDayIdDelete$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, DayService.ConfigurationsConfigurationIdDaysDayIdDeletePath, 'delete');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('dayId', params.dayId, {});
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
   * Delete day.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdDaysDayIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdDaysDayIdDelete(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;
  }): Observable<void> {
    return this.configurationsConfigurationIdDaysDayIdDelete$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
