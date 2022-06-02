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

import { DisconnectorRegisters } from '../models/disconnector-registers';

@Injectable({
  providedIn: 'root'
})
export class DisconnectorConfigService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation disconnectorTemplateIdRegistersGet
   */
  static readonly DisconnectorTemplateIdRegistersGetPath = '/disconnector/{templateId}/registers';

  /**
   * Retrieves registers to read before or after disconnector disconnect/reconnect for a given TemplateId.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `disconnectorTemplateIdRegistersGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  disconnectorTemplateIdRegistersGet$Response(params: { templateId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, DisconnectorConfigService.DisconnectorTemplateIdRegistersGetPath, 'get');
    if (params) {
      rb.path('templateId', params.templateId, {});
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
   * Retrieves registers to read before or after disconnector disconnect/reconnect for a given TemplateId.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `disconnectorTemplateIdRegistersGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  disconnectorTemplateIdRegistersGet(params: { templateId: string }): Observable<void> {
    return this.disconnectorTemplateIdRegistersGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation disconnectorTemplateIdRegistersPut
   */
  static readonly DisconnectorTemplateIdRegistersPutPath = '/disconnector/{templateId}/registers';

  /**
   * Inserts or updates the registers to read before or after disconnector disconnect/reconnect.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `disconnectorTemplateIdRegistersPut()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  disconnectorTemplateIdRegistersPut$Response(params: {
    templateId: string;
    body?: DisconnectorRegisters;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, DisconnectorConfigService.DisconnectorTemplateIdRegistersPutPath, 'put');
    if (params) {
      rb.path('templateId', params.templateId, {});
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
   * Inserts or updates the registers to read before or after disconnector disconnect/reconnect.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `disconnectorTemplateIdRegistersPut$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  disconnectorTemplateIdRegistersPut(params: { templateId: string; body?: DisconnectorRegisters }): Observable<void> {
    return this.disconnectorTemplateIdRegistersPut$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation disconnectorTemplateIdRegistersDelete
   */
  static readonly DisconnectorTemplateIdRegistersDeletePath = '/disconnector/{templateId}/registers';

  /**
   * Deletes registers to read before or after disconnector disconnect/reconnect for a given TemplateId.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `disconnectorTemplateIdRegistersDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  disconnectorTemplateIdRegistersDelete$Response(params: { templateId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, DisconnectorConfigService.DisconnectorTemplateIdRegistersDeletePath, 'delete');
    if (params) {
      rb.path('templateId', params.templateId, {});
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
   * Deletes registers to read before or after disconnector disconnect/reconnect for a given TemplateId.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `disconnectorTemplateIdRegistersDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  disconnectorTemplateIdRegistersDelete(params: { templateId: string }): Observable<void> {
    return this.disconnectorTemplateIdRegistersDelete$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation disconnectorRegistersGet
   */
  static readonly DisconnectorRegistersGetPath = '/disconnector/registers';

  /**
   * Retrieves all registers for all templates to be read before or after disconnector disconnect/reconnect.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `disconnectorRegistersGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  disconnectorRegistersGet$Response(params?: {}): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, DisconnectorConfigService.DisconnectorRegistersGetPath, 'get');
    if (params) {
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
   * Retrieves all registers for all templates to be read before or after disconnector disconnect/reconnect.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `disconnectorRegistersGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  disconnectorRegistersGet(params?: {}): Observable<void> {
    return this.disconnectorRegistersGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
