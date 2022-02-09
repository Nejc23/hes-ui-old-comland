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

import { DeviceMetaDataDto } from '../models/device-meta-data-dto';

@Injectable({
  providedIn: 'root'
})
export class MeterPropertyService extends BaseService {
  /**
   * Path part for operation meterMetadataPost
   */
  static readonly MeterMetadataPostPath = '/meter/metadata';
  /**
   * Path part for operation meterDeviceIdMetadataGet
   */
  static readonly MeterDeviceIdMetadataGetPath = '/meter/{deviceId}/metadata';
  /**
   * Path part for operation meterDeviceIdMetadataPut
   */
  static readonly MeterMetadataDeviceMetaDataIdPutPath = '/meter/metadata/{deviceMetaDataId}';
  /**
   * Path part for operation meterDeviceIdMetadataDelete
   */
  static readonly MeterDeviceIdMetadataDeletePath = '/meter/{deviceId}/metadata';
  /**
   * Delete meter metadata.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `meterDeviceIdMetadataDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  /**
   * Path part for operation meterMetadataDeviceMetaDataIdDelete
   */
  static readonly MeterMetadataDeviceMetaDataIdDeletePath = '/meter/metadata/{deviceMetaDataId}';

  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Add meter metadata.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `meterMetadataPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterMetadataPost$Response(params?: { body?: DeviceMetaDataDto }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, MeterPropertyService.MeterMetadataPostPath, 'post');
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
   * Add meter metadata.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `meterMetadataPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterMetadataPost(params?: { body?: DeviceMetaDataDto }): Observable<void> {
    return this.meterMetadataPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Get meter metadata.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `meterDeviceIdMetadataGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  meterDeviceIdMetadataGet$Response(params: { deviceId: string }): Observable<StrictHttpResponse<Array<DeviceMetaDataDto>>> {
    const rb = new RequestBuilder(this.rootUrl, MeterPropertyService.MeterDeviceIdMetadataGetPath, 'get');
    if (params) {
      rb.path('deviceId', params.deviceId, {});
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
          return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<Array<DeviceMetaDataDto>>;
        })
      );
  }

  /**
   * Get meter metadata.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `meterDeviceIdMetadataGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  meterDeviceIdMetadataGet(params: { deviceId: string }): Observable<Array<DeviceMetaDataDto>> {
    return this.meterDeviceIdMetadataGet$Response(params).pipe(
      map((r: StrictHttpResponse<Array<DeviceMetaDataDto>>) => r.body as Array<DeviceMetaDataDto>)
    );
  }

  /**
   * Update meter metadata.
   *
   *
   *
   /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `meterMetadataDeviceMetaDataIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterMetadataDeviceMetaDataIdPut$Response(params: {
    deviceMetaDataId: string;
    body?: DeviceMetaDataDto;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, MeterPropertyService.MeterMetadataDeviceMetaDataIdPutPath, 'put');
    if (params) {
      rb.path('deviceMetaDataId', params.deviceMetaDataId, {});
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
   * Update meter metadata.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `meterDeviceIdMetadataPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */

  /**
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `meterMetadataDeviceMetaDataIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterMetadataDeviceMetaDataIdPut(params: { deviceMetaDataId: string; body?: DeviceMetaDataDto }): Observable<void> {
    return this.meterMetadataDeviceMetaDataIdPut$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `meterMetadataDeviceMetaDataIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  meterMetadataDeviceMetaDataIdDelete$Response(params: { deviceMetaDataId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, MeterPropertyService.MeterMetadataDeviceMetaDataIdDeletePath, 'delete');
    if (params) {
      rb.path('deviceMetaDataId', params.deviceMetaDataId, {});
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
   * Delete meter metadata.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `meterDeviceIdMetadataDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  meterDeviceIdMetadataDelete(params: { deviceMetaDataId: string }): Observable<void> {
    return this.meterMetadataDeviceMetaDataIdDelete$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
