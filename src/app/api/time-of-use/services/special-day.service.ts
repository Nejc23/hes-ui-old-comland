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

import { SpecialDayCreateDto } from '../models/special-day-create-dto';

@Injectable({
  providedIn: 'root'
})
export class SpecialDayService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation configurationsConfigurationIdSpecialDaysPost
   */
  static readonly ConfigurationsConfigurationIdSpecialDaysPostPath = '/configurations/{configurationId}/special-days';

  /**
   * Create special day.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdSpecialDaysPost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdSpecialDaysPost$Plain$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * SpecialDay object
     */
    body?: SpecialDayCreateDto;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, SpecialDayService.ConfigurationsConfigurationIdSpecialDaysPostPath, 'post');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
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
   * Create special day.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdSpecialDaysPost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdSpecialDaysPost$Plain(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * SpecialDay object
     */
    body?: SpecialDayCreateDto;
  }): Observable<string> {
    return this.configurationsConfigurationIdSpecialDaysPost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Create special day.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdSpecialDaysPost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdSpecialDaysPost$Json$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * SpecialDay object
     */
    body?: SpecialDayCreateDto;
  }): Observable<StrictHttpResponse<string>> {
    const rb = new RequestBuilder(this.rootUrl, SpecialDayService.ConfigurationsConfigurationIdSpecialDaysPostPath, 'post');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
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
   * Create special day.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdSpecialDaysPost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  configurationsConfigurationIdSpecialDaysPost$Json(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * SpecialDay object
     */
    body?: SpecialDayCreateDto;
  }): Observable<string> {
    return this.configurationsConfigurationIdSpecialDaysPost$Json$Response(params).pipe(
      map((r: StrictHttpResponse<string>) => r.body as string)
    );
  }

  /**
   * Path part for operation configurationsConfigurationIdSpecialDaysSpecialDayIdDelete
   */
  static readonly ConfigurationsConfigurationIdSpecialDaysSpecialDayIdDeletePath =
    '/configurations/{configurationId}/special-days/{specialDayId}';

  /**
   * Delete special day.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `configurationsConfigurationIdSpecialDaysSpecialDayIdDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdSpecialDaysSpecialDayIdDelete$Response(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Special day id
     */
    specialDayId: string;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, SpecialDayService.ConfigurationsConfigurationIdSpecialDaysSpecialDayIdDeletePath, 'delete');
    if (params) {
      rb.path('configurationId', params.configurationId, {});
      rb.path('specialDayId', params.specialDayId, {});
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
   * Delete special day.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `configurationsConfigurationIdSpecialDaysSpecialDayIdDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  configurationsConfigurationIdSpecialDaysSpecialDayIdDelete(params: {
    /**
     * Configuration id
     */
    configurationId: string;

    /**
     * Special day id
     */
    specialDayId: string;
  }): Observable<void> {
    return this.configurationsConfigurationIdSpecialDaysSpecialDayIdDelete$Response(params).pipe(
      map((r: StrictHttpResponse<void>) => r.body as void)
    );
  }
}
