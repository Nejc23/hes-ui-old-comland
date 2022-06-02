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

import { AuditSearchDto } from '../models/audit-search-dto';

@Injectable({
  providedIn: 'root'
})
export class AuditService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation logPost
   */
  static readonly LogPostPath = '/log';

  /**
   * Gets Audit log.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `logPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  logPost$Response(params?: { body?: AuditSearchDto }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, AuditService.LogPostPath, 'post');
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
          return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
        })
      );
  }

  /**
   * Gets Audit log.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `logPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  logPost(params?: { body?: any }): Observable<any> {
    return this.logPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation eventTypesGet
   */
  static readonly EventTypesGetPath = '/event-types';

  /**
   * Gets Audit event types.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `eventTypesGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  eventTypesGet$Response(params?: {}): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, AuditService.EventTypesGetPath, 'get');
    if (params) {
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
          return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
        })
      );
  }

  /**
   * Gets Audit event types.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `eventTypesGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  eventTypesGet(params?: {}): Observable<any> {
    return this.eventTypesGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
