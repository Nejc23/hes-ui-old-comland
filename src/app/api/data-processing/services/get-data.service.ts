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

import { GetDataRequest } from '../models/get-data-request';
import { InstantRegisterRequest } from '../models/instant-register-request';
import { ProfileDataRequest } from '../models/profile-data-request';

@Injectable({
  providedIn: 'root'
})
export class GetDataService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation getProfilesPost
   */
  static readonly GetProfilesPostPath = '/get-profiles';

  /**
   * Gets profile data.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getProfilesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getProfilesPost$Response(params?: { body?: ProfileDataRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataService.GetProfilesPostPath, 'post');
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
   * Gets profile data.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getProfilesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getProfilesPost(params?: { body?: ProfileDataRequest }): Observable<void> {
    return this.getProfilesPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation getEventsPost
   */
  static readonly GetEventsPostPath = '/get-events';

  /**
   * Gets event data.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getEventsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getEventsPost$Response(params?: { body?: ProfileDataRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataService.GetEventsPostPath, 'post');
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
   * Gets event data.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getEventsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getEventsPost(params?: { body?: ProfileDataRequest }): Observable<void> {
    return this.getEventsPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation getInstantaneousValuesPost
   */
  static readonly GetInstantaneousValuesPostPath = '/get-instantaneous-values';

  /**
   * Gets instant data.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getInstantaneousValuesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getInstantaneousValuesPost$Response(params?: { body?: InstantRegisterRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataService.GetInstantaneousValuesPostPath, 'post');
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
   * Gets instant data.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getInstantaneousValuesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getInstantaneousValuesPost(params?: { body?: InstantRegisterRequest }): Observable<void> {
    return this.getInstantaneousValuesPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation getDataPost
   */
  static readonly GetDataPostPath = '/get-data';

  /**
   * Gets data by reading names.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getDataPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getDataPost$Response(params?: { body?: GetDataRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataService.GetDataPostPath, 'post');
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
   * Gets data by reading names.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getDataPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getDataPost(params?: { body?: GetDataRequest }): Observable<void> {
    return this.getDataPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation getPropertiesPost
   */
  static readonly GetPropertiesPostPath = '/get-properties';

  /**
   * Gets property data.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPropertiesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getPropertiesPost$Response(params?: { body?: InstantRegisterRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataService.GetPropertiesPostPath, 'post');
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
   * Gets property data.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `getPropertiesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  getPropertiesPost(params?: { body?: InstantRegisterRequest }): Observable<void> {
    return this.getPropertiesPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
