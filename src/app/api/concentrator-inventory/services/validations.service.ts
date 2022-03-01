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

import { ValidateHostnameDto } from '../models/validate-hostname-dto';
import { ValidateHostnameWithPortDto } from '../models/validate-hostname-with-port-dto';

@Injectable({
  providedIn: 'root'
})
export class ValidationsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation concentratorValidationsHostnamePost
   */
  static readonly ConcentratorValidationsHostnamePostPath = '/concentrator/validations/hostname';

  /**
   * Validates hostname - used by DC.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `concentratorValidationsHostnamePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  concentratorValidationsHostnamePost$Response(params?: { body?: ValidateHostnameDto }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ValidationsService.ConcentratorValidationsHostnamePostPath, 'post');
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
   * Validates hostname - used by DC.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `concentratorValidationsHostnamePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  concentratorValidationsHostnamePost(params?: { body?: ValidateHostnameDto }): Observable<void> {
    return this.concentratorValidationsHostnamePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation meterValidationsHostnamePost
   */
  static readonly MeterValidationsHostnamePostPath = '/meter/validations/hostname';

  /**
   * Validates hostname - used by meter.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `meterValidationsHostnamePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterValidationsHostnamePost$Response(params?: { body?: ValidateHostnameWithPortDto }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ValidationsService.MeterValidationsHostnamePostPath, 'post');
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
   * Validates hostname - used by meter.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `meterValidationsHostnamePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterValidationsHostnamePost(params?: { body?: ValidateHostnameWithPortDto }): Observable<void> {
    return this.meterValidationsHostnamePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
