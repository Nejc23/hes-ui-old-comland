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

import { ConfigurationBasicDto } from '../models/configuration-basic-dto';
import { ConfigurationCreateDto } from '../models/configuration-create-dto';
import { ConfigurationDetailDto } from '../models/configuration-detail-dto';
import { ConfigurationUpdateDto } from '../models/configuration-update-dto';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation configurationsGet
   */
  static readonly ConfigurationsGetPath = '/configurations';

  /**
   * Get all configurations.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsGet$Plain$Response(params?: {}): Observable<StrictHttpResponse<Array<ConfigurationBasicDto>>> {
    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationsGetPath, 'get');
    if (params) {
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
          return r as StrictHttpResponse<Array<ConfigurationBasicDto>>;
        })
      );
  }

  /**
   * Get all configurations.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsGet$Plain(params?: {}): Observable<Array<ConfigurationBasicDto>> {
    return this.configurationsGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ConfigurationBasicDto>>) => r.body as Array<ConfigurationBasicDto>)
    );
  }

  /**
   * Get all configurations.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsGet$Json$Response(params?: {}): Observable<StrictHttpResponse<Array<ConfigurationBasicDto>>> {
    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationsGetPath, 'get');
    if (params) {
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
          return r as StrictHttpResponse<Array<ConfigurationBasicDto>>;
        })
      );
  }

  /**
   * Get all configurations.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsGet$Json(params?: {}): Observable<Array<ConfigurationBasicDto>> {
    return this.configurationsGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Array<ConfigurationBasicDto>>) => r.body as Array<ConfigurationBasicDto>)
    );
  }

  /**
   * Path part for operation configurationsPost
   */
  static readonly ConfigurationsPostPath = '/configurations';

  /**
   * Create new configuration.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsPost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsPost$Plain$Response(params?: {
    /**
     * Configuration object
     */
    body?: ConfigurationCreateDto;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationsPostPath, 'post');
    if (params) {
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
   * Create new configuration.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsPost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsPost$Plain(params?: {
    /**
     * Configuration object
     */
    body?: ConfigurationCreateDto;
  }): Observable<string> {
    return this.configurationsPost$Plain$Response(params).pipe(map((r: StrictHttpResponse<string>) => r.body as string));
  }

  /**
   * Create new configuration.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsPost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsPost$Json$Response(params?: {
    /**
     * Configuration object
     */
    body?: ConfigurationCreateDto;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationsPostPath, 'post');
    if (params) {
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
   * Create new configuration.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsPost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsPost$Json(params?: {
    /**
     * Configuration object
     */
    body?: ConfigurationCreateDto;
  }): Observable<string> {
    return this.configurationsPost$Json$Response(params).pipe(map((r: StrictHttpResponse<string>) => r.body as string));
  }

  /**
   * Path part for operation configurationsConfigurationIdGet
   */
  static readonly ConfigurationsConfigurationIdGetPath = '/configurations/{configurationId}';

  /**
   * Get configuration.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdGet$Plain$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;
  }): Observable<StrictHttpResponse<ConfigurationDetailDto>> {
    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationsConfigurationIdGetPath, 'get');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
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
          return r as StrictHttpResponse<ConfigurationDetailDto>;
        })
      );
  }

  /**
   * Get configuration.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdGet$Plain(params: {
    /**
     * Configuration id
     */
    configurationId: string;
  }): Observable<ConfigurationDetailDto> {
    return this.configurationsConfigurationIdGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<ConfigurationDetailDto>) => r.body as ConfigurationDetailDto)
    );
  }

  /**
   * Get configuration.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdGet$Json$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;
  }): Observable<StrictHttpResponse<ConfigurationDetailDto>> {
    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationsConfigurationIdGetPath, 'get');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
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
          return r as StrictHttpResponse<ConfigurationDetailDto>;
        })
      );
  }

  /**
   * Get configuration.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdGet$Json(params: {
    /**
     * Configuration id
     */
    configurationId: string;
  }): Observable<ConfigurationDetailDto> {
    return this.configurationsConfigurationIdGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<ConfigurationDetailDto>) => r.body as ConfigurationDetailDto)
    );
  }

  /**
   * Path part for operation configurationsConfigurationIdPut
   */
  static readonly ConfigurationsConfigurationIdPutPath = '/configurations/{configurationId}';

  /**
   * Update configuration.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdPut$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Configuration object
     */
    body?: ConfigurationUpdateDto;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationsConfigurationIdPutPath, 'put');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
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
   * Update configuration.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdPut(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Configuration object
     */
    body?: ConfigurationUpdateDto;
  }): Observable<void> {
    return this.configurationsConfigurationIdPut$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation configurationsConfigurationIdDelete
   */
  static readonly ConfigurationsConfigurationIdDeletePath = '/configurations/{configurationId}';

  /**
   * Delete configuration.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdDelete$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.ConfigurationsConfigurationIdDeletePath, 'delete');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
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
   * Delete configuration.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdDelete(params: {
    /**
     * Configuration id
     */
    configurationId: string;
  }): Observable<void> {
    return this.configurationsConfigurationIdDelete$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation canDeleteConfigurationsConfigurationIdGet
   */
  static readonly CanDeleteConfigurationsConfigurationIdGetPath = '/can-delete-configurations/{configurationId}';

  /**
   * Can delete configuration.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `canDeleteConfigurationsConfigurationIdGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  canDeleteConfigurationsConfigurationIdGet$Plain$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;
  }): Observable<StrictHttpResponse<boolean>> {
    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.CanDeleteConfigurationsConfigurationIdGetPath, 'get');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
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
   * Can delete configuration.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `canDeleteConfigurationsConfigurationIdGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  canDeleteConfigurationsConfigurationIdGet$Plain(params: {
    /**
     * Configuration id
     */
    configurationId: string;
  }): Observable<boolean> {
    return this.canDeleteConfigurationsConfigurationIdGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }

  /**
   * Can delete configuration.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `canDeleteConfigurationsConfigurationIdGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  canDeleteConfigurationsConfigurationIdGet$Json$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;
  }): Observable<StrictHttpResponse<boolean>> {
    const rb = new RequestBuilder(this.rootUrl, ConfigurationService.CanDeleteConfigurationsConfigurationIdGetPath, 'get');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
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
   * Can delete configuration.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `canDeleteConfigurationsConfigurationIdGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  canDeleteConfigurationsConfigurationIdGet$Json(params: {
    /**
     * Configuration id
     */
    configurationId: string;
  }): Observable<boolean> {
    return this.canDeleteConfigurationsConfigurationIdGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<boolean>) => r.body as boolean)
    );
  }
}
