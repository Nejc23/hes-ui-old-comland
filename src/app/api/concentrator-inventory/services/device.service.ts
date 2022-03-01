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

import { DeviceRequest } from '../models/device-request';
import { FilterDeviceRequest } from '../models/filter-device-request';
import { MeterData } from '../models/meter-data';
import { UpdateMetersStateDto } from '../models/update-meters-state-dto';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation filterDevicesPost
   */
  static readonly FilterDevicesPostPath = '/filter-devices';

  /**
   * Gets devices by filter.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `filterDevicesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  filterDevicesPost$Response(params?: { body?: FilterDeviceRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, DeviceService.FilterDevicesPostPath, 'post');
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
   * Gets devices by filter.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `filterDevicesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  filterDevicesPost(params?: { body?: FilterDeviceRequest }): Observable<void> {
    return this.filterDevicesPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation devicesPost
   */
  static readonly DevicesPostPath = '/devices';

  /**
   * Gets devices by ids.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `devicesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  devicesPost$Response(params?: { body?: DeviceRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, DeviceService.DevicesPostPath, 'post');
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
   * Gets devices by ids.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `devicesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  devicesPost(params?: { body?: DeviceRequest }): Observable<void> {
    return this.devicesPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation meterDeviceIdGet
   */
  static readonly MeterDeviceIdGetPath = '/meter/{deviceId}';

  /**
   * Gets device info by deviceId.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `meterDeviceIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  meterDeviceIdGet$Response(params: { deviceId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, DeviceService.MeterDeviceIdGetPath, 'get');
    if (params) {
      rb.path('deviceId', params.deviceId, {});
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
   * Gets device info by deviceId.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `meterDeviceIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  meterDeviceIdGet(params: { deviceId: string }): Observable<void> {
    return this.meterDeviceIdGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation meterDeviceIdPut
   */
  static readonly MeterDeviceIdPutPath = '/meter/{deviceId}';

  /**
   * Update meter.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `meterDeviceIdPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterDeviceIdPut$Response(params: { deviceId: string; body?: MeterData }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, DeviceService.MeterDeviceIdPutPath, 'put');
    if (params) {
      rb.path('deviceId', params.deviceId, {});
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
   * Update meter.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `meterDeviceIdPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterDeviceIdPut(params: { deviceId: string; body?: MeterData }): Observable<void> {
    return this.meterDeviceIdPut$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation meterPost
   */
  static readonly MeterPostPath = '/meter';

  /**
   * Add meter.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `meterPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterPost$Response(params?: { body?: MeterData }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, DeviceService.MeterPostPath, 'post');
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
   * Add meter.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `meterPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterPost(params?: { body?: MeterData }): Observable<void> {
    return this.meterPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation updateMetersStatePost
   */
  static readonly UpdateMetersStatePostPath = '/update-meters-state';

  /**
   * Update meters state.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateMetersStatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateMetersStatePost$Response(params?: { body?: UpdateMetersStateDto }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, DeviceService.UpdateMetersStatePostPath, 'post');
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
   * Update meters state.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateMetersStatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateMetersStatePost(params?: { body?: UpdateMetersStateDto }): Observable<void> {
    return this.updateMetersStatePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
