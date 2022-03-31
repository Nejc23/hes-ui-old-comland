/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';

import { EventDataRequest } from '../models/event-data-request';
import { ExportEventDataRequest } from '../models/export-event-data-request';
import { GetDataRequest } from '../models/get-data-request';
import { InstantRegisterRequest } from '../models/instant-register-request';
import { ProfileDataRequest } from '../models/profile-data-request';
import { EventData } from '../../alarms-events/event-data-dto';

@Injectable({
  providedIn: 'root'
})
export class GetDataV2Service extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation v2GetEventsDataPost
   */
  static readonly V2GetEventsDataPostPath = '/v2/get-events-data';

  /**
   * Gets event data v2.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2GetEventsDataPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2GetEventsDataPost$Response(params?: { body?: EventDataRequest }): Observable<StrictHttpResponse<EventData>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataV2Service.V2GetEventsDataPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: '*/*'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<EventData>;
        })
      );
  }

  /**
   * Gets event data v2.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `v2GetEventsDataPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2GetEventsDataPost(params?: { body?: EventDataRequest }): Observable<EventData> {
    return this.v2GetEventsDataPost$Response(params).pipe(map((r: StrictHttpResponse<EventData>) => r.body as EventData));
  }

  /**
   * Path part for operation v2ExportEventsDataPost
   */
  static readonly V2ExportEventsDataPostPath = '/v2/export-events-data';

  /**
   * Exports event data.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2ExportEventsDataPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2ExportEventsDataPost$Response(params?: { body?: ExportEventDataRequest }): Observable<StrictHttpResponse<Blob>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataV2Service.V2ExportEventsDataPostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'blob',
          accept: 'text/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<Blob>;
        })
      );
  }

  /**
   * Exports event data.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `v2ExportEventsDataPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2ExportEventsDataPost(params?: { body?: ExportEventDataRequest }): Observable<StrictHttpResponse<Blob>> {
    // return this.v2ExportEventsDataPost$Response(params).pipe(map((r: StrictHttpResponse<Blob>) => r.body as Blob));
    return this.v2ExportEventsDataPost$Response(params);
  }

  /**
   * Path part for operation v2GetProfilesPost
   */
  static readonly V2GetProfilesPostPath = '/v2/get-profiles';

  /**
   * Gets profile data v2.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2GetProfilesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2GetProfilesPost$Response(params?: { body?: ProfileDataRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataV2Service.V2GetProfilesPostPath, 'post');
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
   * Gets profile data v2.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `v2GetProfilesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2GetProfilesPost(params?: { body?: ProfileDataRequest }): Observable<void> {
    return this.v2GetProfilesPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation v2GetInstantaneousValuesPost
   */
  static readonly V2GetInstantaneousValuesPostPath = '/v2/get-instantaneous-values';

  /**
   * Gets instant data v2.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2GetInstantaneousValuesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2GetInstantaneousValuesPost$Response(params?: { body?: InstantRegisterRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataV2Service.V2GetInstantaneousValuesPostPath, 'post');
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
   * Gets instant data v2.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `v2GetInstantaneousValuesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2GetInstantaneousValuesPost(params?: { body?: InstantRegisterRequest }): Observable<void> {
    return this.v2GetInstantaneousValuesPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation v2GetDataPost
   */
  static readonly V2GetDataPostPath = '/v2/get-data';

  /**
   * Gets data by reading names v2.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2GetDataPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2GetDataPost$Response(params?: { body?: GetDataRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataV2Service.V2GetDataPostPath, 'post');
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
   * Gets data by reading names v2.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `v2GetDataPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2GetDataPost(params?: { body?: GetDataRequest }): Observable<void> {
    return this.v2GetDataPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
