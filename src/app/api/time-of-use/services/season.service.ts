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

import { SeasonCreateDto } from '../models/season-create-dto';
import { SeasonUpdateDto } from '../models/season-update-dto';

@Injectable({
  providedIn: 'root'
})
export class SeasonService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation configurationsConfigurationIdCanDeleteSeasonsSeasonIdGet
   */
  static readonly ConfigurationsConfigurationIdCanDeleteSeasonsSeasonIdGetPath =
    '/configurations/{configurationId}/can-delete-seasons/{seasonId}';

  /**
   * Can delete season.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdCanDeleteSeasonsSeasonIdGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdCanDeleteSeasonsSeasonIdGet$Plain$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Season id
     */
    seasonId: string;
  }): Observable<StrictHttpResponse<boolean>> {
    const rb = new RequestBuilder(this.rootUrl, SeasonService.ConfigurationsConfigurationIdCanDeleteSeasonsSeasonIdGetPath, 'get');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('seasonId', params.seasonId, {});
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
   * Can delete season.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdCanDeleteSeasonsSeasonIdGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdCanDeleteSeasonsSeasonIdGet$Plain(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Season id
     */
    seasonId: string;
  }): Observable<boolean> {
    return this.configurationsConfigurationIdCanDeleteSeasonsSeasonIdGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Can delete season.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdCanDeleteSeasonsSeasonIdGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdCanDeleteSeasonsSeasonIdGet$Json$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Season id
     */
    seasonId: string;
  }): Observable<StrictHttpResponse<boolean>> {
    const rb = new RequestBuilder(this.rootUrl, SeasonService.ConfigurationsConfigurationIdCanDeleteSeasonsSeasonIdGetPath, 'get');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('seasonId', params.seasonId, {});
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
   * Can delete season.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdCanDeleteSeasonsSeasonIdGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdCanDeleteSeasonsSeasonIdGet$Json(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Season id
     */
    seasonId: string;
  }): Observable<boolean> {
    return this.configurationsConfigurationIdCanDeleteSeasonsSeasonIdGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Path part for operation configurationsConfigurationIdSeasonsPost
   */
  static readonly ConfigurationsConfigurationIdSeasonsPostPath = '/configurations/{configurationId}/seasons';

  /**
   * Create season.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdSeasonsPost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdSeasonsPost$Plain$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Season object
     */
    body?: SeasonCreateDto;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, SeasonService.ConfigurationsConfigurationIdSeasonsPostPath, 'post');
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
   * Create season.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdSeasonsPost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdSeasonsPost$Plain(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Season object
     */
    body?: SeasonCreateDto;
  }): Observable<string> {
    return this.configurationsConfigurationIdSeasonsPost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Create season.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdSeasonsPost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdSeasonsPost$Json$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Season object
     */
    body?: SeasonCreateDto;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, SeasonService.ConfigurationsConfigurationIdSeasonsPostPath, 'post');
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
   * Create season.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdSeasonsPost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdSeasonsPost$Json(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Season object
     */
    body?: SeasonCreateDto;
  }): Observable<string> {
    return this.configurationsConfigurationIdSeasonsPost$Json$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation configurationsConfigurationIdSeasonsSeasonIdPut
   */
  static readonly ConfigurationsConfigurationIdSeasonsSeasonIdPutPath = '/configurations/{configurationId}/seasons/{seasonId}';

  /**
   * Update season.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdSeasonsSeasonIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdSeasonsSeasonIdPut$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Season id
     */
    seasonId: string;

    /**
     * Configuration object
     */
    body?: SeasonUpdateDto;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, SeasonService.ConfigurationsConfigurationIdSeasonsSeasonIdPutPath, 'put');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('seasonId', params.seasonId, {});
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
   * Update season.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdSeasonsSeasonIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdSeasonsSeasonIdPut(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Season id
     */
    seasonId: string;

    /**
     * Configuration object
     */
    body?: SeasonUpdateDto;
  }): Observable<void> {
    return this.configurationsConfigurationIdSeasonsSeasonIdPut$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation configurationsConfigurationIdSeasonsSeasonIdDelete
   */
  static readonly ConfigurationsConfigurationIdSeasonsSeasonIdDeletePath = '/configurations/{configurationId}/seasons/{seasonId}';

  /**
   * Delete season.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdSeasonsSeasonIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdSeasonsSeasonIdDelete$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Season id
     */
    seasonId: string;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, SeasonService.ConfigurationsConfigurationIdSeasonsSeasonIdDeletePath, 'delete');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('seasonId', params.seasonId, {});
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
   * Delete season.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdSeasonsSeasonIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdSeasonsSeasonIdDelete(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Season id
     */
    seasonId: string;
  }): Observable<void> {
    return this.configurationsConfigurationIdSeasonsSeasonIdDelete$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }
}
