/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';
import { RequestBuilder } from '../request-builder';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { EventDataRequest } from '../models/event-data-request';
import { ExportEventDataRequest } from '../models/export-event-data-request';
import { GetDataRequest } from '../models/get-data-request';
import { GetSlaRequestDto } from '../models/get-sla-request-dto';
import { InstantRegisterRequest } from '../models/instant-register-request';
import { ProfileDataRequest } from '../models/profile-data-request';
import { QualityTrendSlaDto } from '../models/quality-trend-sla-dto';
import { SlaDto } from '../models/sla-dto';
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

  /**
   * Path part for operation v2DeviceSlaPost
   */
  static readonly V2DeviceSlaPostPath = '/v2/device/sla';

  /**
   * Gets meter SLA data.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2DeviceSlaPost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2DeviceSlaPost$Plain$Response(params?: { body?: GetSlaRequestDto }): Observable<StrictHttpResponse<Array<SlaDto>>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataV2Service.V2DeviceSlaPostPath, 'post');
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
          return r as StrictHttpResponse<Array<SlaDto>>;
        })
      );
  }

  /**
   * Gets meter SLA data.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `v2DeviceSlaPost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2DeviceSlaPost$Plain(params?: { body?: GetSlaRequestDto }): Observable<Array<SlaDto>> {
    return this.v2DeviceSlaPost$Plain$Response(params).pipe(map((r: StrictHttpResponse<Array<SlaDto>>) => r.body as Array<SlaDto>));
  }

  /**
   * Gets meter SLA data.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2DeviceSlaPost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2DeviceSlaPost$Json$Response(params?: { body?: GetSlaRequestDto }): Observable<StrictHttpResponse<Array<SlaDto>>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataV2Service.V2DeviceSlaPostPath, 'post');
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
          return r as StrictHttpResponse<Array<SlaDto>>;
        })
      );
  }

  /**
   * Gets meter SLA data.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `v2DeviceSlaPost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2DeviceSlaPost$Json(params?: { body?: GetSlaRequestDto }): Observable<Array<SlaDto>> {
    return this.v2DeviceSlaPost$Json$Response(params).pipe(map((r: StrictHttpResponse<Array<SlaDto>>) => r.body as Array<SlaDto>));
  }

  /**
   * Path part for operation v2ConcentratorSlaPost
   */
  static readonly V2ConcentratorSlaPostPath = '/v2/concentrator/sla';

  /**
   * Gets concentrator SLA data.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2ConcentratorSlaPost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2ConcentratorSlaPost$Plain$Response(params?: { body?: GetSlaRequestDto }): Observable<StrictHttpResponse<Array<SlaDto>>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataV2Service.V2ConcentratorSlaPostPath, 'post');
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
          return r as StrictHttpResponse<Array<SlaDto>>;
        })
      );
  }

  /**
   * Gets concentrator SLA data.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `v2ConcentratorSlaPost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2ConcentratorSlaPost$Plain(params?: { body?: GetSlaRequestDto }): Observable<Array<SlaDto>> {
    return this.v2ConcentratorSlaPost$Plain$Response(params).pipe(map((r: StrictHttpResponse<Array<SlaDto>>) => r.body as Array<SlaDto>));
  }

  /**
   * Gets concentrator SLA data.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2ConcentratorSlaPost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2ConcentratorSlaPost$Json$Response(params?: { body?: GetSlaRequestDto }): Observable<StrictHttpResponse<Array<SlaDto>>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataV2Service.V2ConcentratorSlaPostPath, 'post');
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
          return r as StrictHttpResponse<Array<SlaDto>>;
        })
      );
  }

  /**
   * Gets concentrator SLA data.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `v2ConcentratorSlaPost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  v2ConcentratorSlaPost$Json(params?: { body?: GetSlaRequestDto }): Observable<Array<SlaDto>> {
    return this.v2ConcentratorSlaPost$Json$Response(params).pipe(map((r: StrictHttpResponse<Array<SlaDto>>) => r.body as Array<SlaDto>));
  }

  /**
   * Path part for operation v2DeviceDeviceIdSlaTrendGet
   */
  static readonly V2DeviceDeviceIdSlaTrendGetPath = '/v2/device/{deviceId}/sla/trend';

  /**
   * Gets meter quality trend SLA.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2DeviceDeviceIdSlaTrendGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2DeviceDeviceIdSlaTrendGet$Plain$Response(params: {
    /**
     * Device id
     */
    deviceId: string;

    /**
     * Device quality trend SLA data for last N days; default is -30 days
     */
    lastNDays?: number;
  }): Observable<StrictHttpResponse<QualityTrendSlaDto>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataV2Service.V2DeviceDeviceIdSlaTrendGetPath, 'get');
    if (params) {
      rb.path('deviceId', params.deviceId, {});
      rb.query('lastNDays', params.lastNDays, {});
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
          return r as StrictHttpResponse<QualityTrendSlaDto>;
        })
      );
  }

  /**
   * Gets meter quality trend SLA.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `v2DeviceDeviceIdSlaTrendGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2DeviceDeviceIdSlaTrendGet$Plain(params: {
    /**
     * Device id
     */
    deviceId: string;

    /**
     * Device quality trend SLA data for last N days; default is -30 days
     */
    lastNDays?: number;
  }): Observable<QualityTrendSlaDto> {
    return this.v2DeviceDeviceIdSlaTrendGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<QualityTrendSlaDto>) => r.body as QualityTrendSlaDto)
    );
  }

  /**
   * Gets meter quality trend SLA.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2DeviceDeviceIdSlaTrendGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2DeviceDeviceIdSlaTrendGet$Json$Response(params: {
    /**
     * Device id
     */
    deviceId: string;

    /**
     * Device quality trend SLA data for last N days; default is -30 days
     */
    lastNDays?: number;
  }): Observable<StrictHttpResponse<QualityTrendSlaDto>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataV2Service.V2DeviceDeviceIdSlaTrendGetPath, 'get');
    if (params) {
      rb.path('deviceId', params.deviceId, {});
      rb.query('lastNDays', params.lastNDays, {});
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
          return r as StrictHttpResponse<QualityTrendSlaDto>;
        })
      );
  }

  /**
   * Gets meter quality trend SLA.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `v2DeviceDeviceIdSlaTrendGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2DeviceDeviceIdSlaTrendGet$Json(params: {
    /**
     * Device id
     */
    deviceId: string;

    /**
     * Device quality trend SLA data for last N days; default is -30 days
     */
    lastNDays?: number;
  }): Observable<QualityTrendSlaDto> {
    return this.v2DeviceDeviceIdSlaTrendGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<QualityTrendSlaDto>) => r.body as QualityTrendSlaDto)
    );
  }

  /**
   * Path part for operation v2ConcentratorConcentratorIdSlaTrendGet
   */
  static readonly V2ConcentratorConcentratorIdSlaTrendGetPath = '/v2/concentrator/{concentratorId}/sla/trend';

  /**
   * Gets concentrator quality trend SLA.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2ConcentratorConcentratorIdSlaTrendGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2ConcentratorConcentratorIdSlaTrendGet$Plain$Response(params: {
    /**
     * Concentrator id
     */
    concentratorId: string;

    /**
     * Concentrator quality trend SLA data for last N days; default is -30 days
     */
    lastNDays?: number;
  }): Observable<StrictHttpResponse<QualityTrendSlaDto>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataV2Service.V2ConcentratorConcentratorIdSlaTrendGetPath, 'get');
    if (params) {
      rb.path('concentratorId', params.concentratorId, {});
      rb.query('lastNDays', params.lastNDays, {});
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
          return r as StrictHttpResponse<QualityTrendSlaDto>;
        })
      );
  }

  /**
   * Gets concentrator quality trend SLA.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `v2ConcentratorConcentratorIdSlaTrendGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2ConcentratorConcentratorIdSlaTrendGet$Plain(params: {
    /**
     * Concentrator id
     */
    concentratorId: string;

    /**
     * Concentrator quality trend SLA data for last N days; default is -30 days
     */
    lastNDays?: number;
  }): Observable<QualityTrendSlaDto> {
    return this.v2ConcentratorConcentratorIdSlaTrendGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<QualityTrendSlaDto>) => r.body as QualityTrendSlaDto)
    );
  }

  /**
   * Gets concentrator quality trend SLA.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `v2ConcentratorConcentratorIdSlaTrendGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2ConcentratorConcentratorIdSlaTrendGet$Json$Response(params: {
    /**
     * Concentrator id
     */
    concentratorId: string;

    /**
     * Concentrator quality trend SLA data for last N days; default is -30 days
     */
    lastNDays?: number;
  }): Observable<StrictHttpResponse<QualityTrendSlaDto>> {
    const rb = new RequestBuilder(this.rootUrl, GetDataV2Service.V2ConcentratorConcentratorIdSlaTrendGetPath, 'get');
    if (params) {
      rb.path('concentratorId', params.concentratorId, {});
      rb.query('lastNDays', params.lastNDays, {});
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
          return r as StrictHttpResponse<QualityTrendSlaDto>;
        })
      );
  }

  /**
   * Gets concentrator quality trend SLA.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `v2ConcentratorConcentratorIdSlaTrendGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  v2ConcentratorConcentratorIdSlaTrendGet$Json(params: {
    /**
     * Concentrator id
     */
    concentratorId: string;

    /**
     * Concentrator quality trend SLA data for last N days; default is -30 days
     */
    lastNDays?: number;
  }): Observable<QualityTrendSlaDto> {
    return this.v2ConcentratorConcentratorIdSlaTrendGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<QualityTrendSlaDto>) => r.body as QualityTrendSlaDto)
    );
  }
}
