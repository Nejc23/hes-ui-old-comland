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

import { JToken } from '../models/j-token';

@Injectable({
  providedIn: 'root'
})
export class UserGridConfigService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation userKeyConfigurationConfigurationKeyGet
   */
  static readonly UserKeyConfigurationConfigurationKeyGetPath = '/{userKey}/configuration/{configurationKey}';

  /**
   * Gets the grid config for the given user and grid keys.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `userKeyConfigurationConfigurationKeyGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  userKeyConfigurationConfigurationKeyGet$Response(params: {
    userKey: string;
    configurationKey: string;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, UserGridConfigService.UserKeyConfigurationConfigurationKeyGetPath, 'get');
    if (params) {
      rb.path('userKey', params.userKey, {});
      rb.path('configurationKey', params.configurationKey, {});
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
   * Gets the grid config for the given user and grid keys.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `userKeyConfigurationConfigurationKeyGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  userKeyConfigurationConfigurationKeyGet(params: { userKey: string; configurationKey: string }): Observable<void> {
    return this.userKeyConfigurationConfigurationKeyGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation userKeyConfigurationConfigurationKeyPut
   */
  static readonly UserKeyConfigurationConfigurationKeyPutPath = '/{userKey}/configuration/{configurationKey}';

  /**
   * Stores the grid config for the given user and grid keys.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `userKeyConfigurationConfigurationKeyPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  userKeyConfigurationConfigurationKeyPut$Response(params: {
    userKey: string;
    configurationKey: string;
    body?: {
      [key: string]: JToken;
    };
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, UserGridConfigService.UserKeyConfigurationConfigurationKeyPutPath, 'put');
    if (params) {
      rb.path('userKey', params.userKey, {});
      rb.path('configurationKey', params.configurationKey, {});
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
   * Stores the grid config for the given user and grid keys.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `userKeyConfigurationConfigurationKeyPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  userKeyConfigurationConfigurationKeyPut(params: {
    userKey: string;
    configurationKey: string;
    body?: {
      [key: string]: JToken;
    };
  }): Observable<void> {
    return this.userKeyConfigurationConfigurationKeyPut$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
