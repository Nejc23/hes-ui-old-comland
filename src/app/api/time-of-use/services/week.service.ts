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

import { WeekCreateDto } from '../models/week-create-dto';
import { WeekUpdateDto } from '../models/week-update-dto';

@Injectable({
  providedIn: 'root'
})
export class WeekService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation configurationsConfigurationIdCanDeleteWeeksWeekIdGet
   */
  static readonly ConfigurationsConfigurationIdCanDeleteWeeksWeekIdGetPath = '/configurations/{configurationId}/can-delete-weeks/{weekId}';

  /**
   * Can delete week.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdCanDeleteWeeksWeekIdGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdCanDeleteWeeksWeekIdGet$Plain$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Week id
     */
    weekId: string;
  }): Observable<StrictHttpResponse<boolean>> {
    const rb = new RequestBuilder(this.rootUrl, WeekService.ConfigurationsConfigurationIdCanDeleteWeeksWeekIdGetPath, 'get');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('weekId', params.weekId, {});
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
   * Can delete week.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdCanDeleteWeeksWeekIdGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdCanDeleteWeeksWeekIdGet$Plain(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Week id
     */
    weekId: string;
  }): Observable<boolean> {
    return this.configurationsConfigurationIdCanDeleteWeeksWeekIdGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Can delete week.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdCanDeleteWeeksWeekIdGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdCanDeleteWeeksWeekIdGet$Json$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Week id
     */
    weekId: string;
  }): Observable<StrictHttpResponse<boolean>> {
    const rb = new RequestBuilder(this.rootUrl, WeekService.ConfigurationsConfigurationIdCanDeleteWeeksWeekIdGetPath, 'get');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('weekId', params.weekId, {});
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
   * Can delete week.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdCanDeleteWeeksWeekIdGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdCanDeleteWeeksWeekIdGet$Json(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Week id
     */
    weekId: string;
  }): Observable<boolean> {
    return this.configurationsConfigurationIdCanDeleteWeeksWeekIdGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation configurationsConfigurationIdWeeksPost
   */
  static readonly ConfigurationsConfigurationIdWeeksPostPath = '/configurations/{configurationId}/weeks';

  /**
   * Create week.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdWeeksPost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdWeeksPost$Plain$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Week object
     */
    body?: WeekCreateDto;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, WeekService.ConfigurationsConfigurationIdWeeksPostPath, 'post');
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
   * Create week.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdWeeksPost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdWeeksPost$Plain(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Week object
     */
    body?: WeekCreateDto;
  }): Observable<string> {
    return this.configurationsConfigurationIdWeeksPost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Create week.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdWeeksPost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdWeeksPost$Json$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Week object
     */
    body?: WeekCreateDto;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, WeekService.ConfigurationsConfigurationIdWeeksPostPath, 'post');
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
   * Create week.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdWeeksPost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdWeeksPost$Json(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Week object
     */
    body?: WeekCreateDto;
  }): Observable<string> {
    return this.configurationsConfigurationIdWeeksPost$Json$Response(params).pipe(map((r: StrictHttpResponse<string>) => r.body as string));
  }

  /**
   * Path part for operation configurationsConfigurationIdWeeksWeekIdPut
   */
  static readonly ConfigurationsConfigurationIdWeeksWeekIdPutPath = '/configurations/{configurationId}/weeks/{weekId}';

  /**
   * Update week.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdWeeksWeekIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdWeeksWeekIdPut$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Week id
     */
    weekId: string;

    /**
     * Configuration object
     */
    body?: WeekUpdateDto;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, WeekService.ConfigurationsConfigurationIdWeeksWeekIdPutPath, 'put');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('weekId', params.weekId, {});
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
   * Update week.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdWeeksWeekIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdWeeksWeekIdPut(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Week id
     */
    weekId: string;

    /**
     * Configuration object
     */
    body?: WeekUpdateDto;
  }): Observable<void> {
    return this.configurationsConfigurationIdWeeksWeekIdPut$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation configurationsConfigurationIdWeeksWeekIdDelete
   */
  static readonly ConfigurationsConfigurationIdWeeksWeekIdDeletePath = '/configurations/{configurationId}/weeks/{weekId}';

  /**
   * Delete week.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdWeeksWeekIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdWeeksWeekIdDelete$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Week id
     */
    weekId: string;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, WeekService.ConfigurationsConfigurationIdWeeksWeekIdDeletePath, 'delete');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('weekId', params.weekId, {});
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
   * Delete week.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdWeeksWeekIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdWeeksWeekIdDelete(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Week id
     */
    weekId: string;
  }): Observable<void> {
    return this.configurationsConfigurationIdWeeksWeekIdDelete$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
