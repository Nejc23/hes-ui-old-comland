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

import { DayActionCreateDto } from '../models/day-action-create-dto';

@Injectable({
  providedIn: 'root'
})
export class DayActionService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation configurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGet
   */
  static readonly ConfigurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGetPath =
    '/configurations/{configurationId}/days/{dayId}/can-delete-day-actions/{dayActionId}';

  /**
   * Can delete day action.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGet$Plain$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;

    /**
     * Day action id
     */
    dayActionId: string;
  }): Observable<StrictHttpResponse<boolean>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      DayActionService.ConfigurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGetPath,
      'get'
    );
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('dayId', params.dayId, {});
      rb.path('dayActionId', params.dayActionId, {});
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
   * Can delete day action.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGet$Plain(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;

    /**
     * Day action id
     */
    dayActionId: string;
  }): Observable<boolean> {
    return this.configurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Can delete day action.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGet$Json$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;

    /**
     * Day action id
     */
    dayActionId: string;
  }): Observable<StrictHttpResponse<boolean>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      DayActionService.ConfigurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGetPath,
      'get'
    );
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('dayId', params.dayId, {});
      rb.path('dayActionId', params.dayActionId, {});
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
   * Can delete day action.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGet$Json(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;

    /**
     * Day action id
     */
    dayActionId: string;
  }): Observable<boolean> {
    return this.configurationsConfigurationIdDaysDayIdCanDeleteDayActionsDayActionIdGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation configurationsConfigurationIdDaysDayIdDayActionsPost
   */
  static readonly ConfigurationsConfigurationIdDaysDayIdDayActionsPostPath = '/configurations/{configurationId}/days/{dayId}/day-actions';

  /**
   * Create day action.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdDaysDayIdDayActionsPost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdDaysDayIdDayActionsPost$Plain$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;

    /**
     * Day object
     */
    body?: DayActionCreateDto;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, DayActionService.ConfigurationsConfigurationIdDaysDayIdDayActionsPostPath, 'post');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('dayId', params.dayId, {});
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
   * Create day action.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdDaysDayIdDayActionsPost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdDaysDayIdDayActionsPost$Plain(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;

    /**
     * Day object
     */
    body?: DayActionCreateDto;
  }): Observable<string> {
    return this.configurationsConfigurationIdDaysDayIdDayActionsPost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Create day action.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdDaysDayIdDayActionsPost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdDaysDayIdDayActionsPost$Json$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;

    /**
     * Day object
     */
    body?: DayActionCreateDto;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, DayActionService.ConfigurationsConfigurationIdDaysDayIdDayActionsPostPath, 'post');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('dayId', params.dayId, {});
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
   * Create day action.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdDaysDayIdDayActionsPost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdDaysDayIdDayActionsPost$Json(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;

    /**
     * Day object
     */
    body?: DayActionCreateDto;
  }): Observable<string> {
    return this.configurationsConfigurationIdDaysDayIdDayActionsPost$Json$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation configurationsConfigurationIdDaysDayIdDayActionsDayActionIdDelete
   */
  static readonly ConfigurationsConfigurationIdDaysDayIdDayActionsDayActionIdDeletePath =
    '/configurations/{configurationId}/days/{dayId}/day-actions/{dayActionId}';

  /**
   * Delete day action.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdDaysDayIdDayActionsDayActionIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdDaysDayIdDayActionsDayActionIdDelete$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;

    /**
     * Day action id
     */
    dayActionId: string;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(
      this.rootUrl,
      DayActionService.ConfigurationsConfigurationIdDaysDayIdDayActionsDayActionIdDeletePath,
      'delete'
    );
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('dayId', params.dayId, {});
      rb.path('dayActionId', params.dayActionId, {});
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
   * Delete day action.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdDaysDayIdDayActionsDayActionIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdDaysDayIdDayActionsDayActionIdDelete(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Day id
     */
    dayId: string;

    /**
     * Day action id
     */
    dayActionId: string;
  }): Observable<void> {
    return this.configurationsConfigurationIdDaysDayIdDayActionsDayActionIdDelete$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }
}
