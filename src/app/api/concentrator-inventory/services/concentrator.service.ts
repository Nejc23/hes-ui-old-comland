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

import { AddConcentratorRequest } from '../models/add-concentrator-request';
import { ConcentratorDto } from '../models/concentrator-dto';
import { IUpdateConcentratorDetail } from '../models/i-update-concentrator-detail';
import { UpdateConcentratorDetail } from '../models/update-concentrator-detail';
import { UpdateConcentratorsStateDto } from '../models/update-concentrators-state-dto';

@Injectable({
  providedIn: 'root'
})
export class ConcentratorService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation addConcentratorPost
   */
  static readonly AddConcentratorPostPath = '/add-concentrator';

  /**
   * Adds concentrator.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addConcentratorPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addConcentratorPost$Response(params?: { body?: AddConcentratorRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorService.AddConcentratorPostPath, 'post');
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
   * Adds concentrator.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `addConcentratorPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  addConcentratorPost(params?: { body?: AddConcentratorRequest }): Observable<void> {
    return this.addConcentratorPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation concentratorConcenteratorIdGet
   */
  static readonly ConcentratorConcenteratorIdGetPath = '/concentrator/{concenteratorId}';

  /**
   * Get concentrator details by id.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `concentratorConcenteratorIdGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  concentratorConcenteratorIdGet$Plain$Response(params: { concenteratorId: string }): Observable<StrictHttpResponse<ConcentratorDto>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorService.ConcentratorConcenteratorIdGetPath, 'get');
    if (params) {
      rb.path('concenteratorId', params.concenteratorId, {});
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
          return r as StrictHttpResponse<ConcentratorDto>;
        })
      );
  }

  /**
   * Get concentrator details by id.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `concentratorConcenteratorIdGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  concentratorConcenteratorIdGet$Plain(params: { concenteratorId: string }): Observable<ConcentratorDto> {
    return this.concentratorConcenteratorIdGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<ConcentratorDto>) => r.body as ConcentratorDto)
    );
  }

  /**
   * Get concentrator details by id.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `concentratorConcenteratorIdGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  concentratorConcenteratorIdGet$Json$Response(params: { concenteratorId: string }): Observable<StrictHttpResponse<ConcentratorDto>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorService.ConcentratorConcenteratorIdGetPath, 'get');
    if (params) {
      rb.path('concenteratorId', params.concenteratorId, {});
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
          return r as StrictHttpResponse<ConcentratorDto>;
        })
      );
  }

  /**
   * Get concentrator details by id.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `concentratorConcenteratorIdGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  concentratorConcenteratorIdGet$Json(params: { concenteratorId: string }): Observable<ConcentratorDto> {
    return this.concentratorConcenteratorIdGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<ConcentratorDto>) => r.body as ConcentratorDto)
    );
  }

  /**
   * Path part for operation concentratorConcenteratorIdPut
   */
  static readonly ConcentratorConcenteratorIdPutPath = '/concentrator/{concenteratorId}';

  /**
   * Update concentrator details.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `concentratorConcenteratorIdPut$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  concentratorConcenteratorIdPut$Plain$Response(params: {
    concenteratorId: string;
    body?: UpdateConcentratorDetail;
  }): Observable<StrictHttpResponse<Array<IUpdateConcentratorDetail>>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorService.ConcentratorConcenteratorIdPutPath, 'put');
    if (params) {
      rb.path('concenteratorId', params.concenteratorId, {});
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
          return r as StrictHttpResponse<Array<IUpdateConcentratorDetail>>;
        })
      );
  }

  /**
   * Update concentrator details.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `concentratorConcenteratorIdPut$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  concentratorConcenteratorIdPut$Plain(params: {
    concenteratorId: string;
    body?: UpdateConcentratorDetail;
  }): Observable<Array<IUpdateConcentratorDetail>> {
    return this.concentratorConcenteratorIdPut$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Array<IUpdateConcentratorDetail>>) => r.body as Array<IUpdateConcentratorDetail>)
    );
  }

  /**
   * Update concentrator details.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `concentratorConcenteratorIdPut$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  concentratorConcenteratorIdPut$Json$Response(params: {
    concenteratorId: string;
    body?: UpdateConcentratorDetail;
  }): Observable<StrictHttpResponse<Array<IUpdateConcentratorDetail>>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorService.ConcentratorConcenteratorIdPutPath, 'put');
    if (params) {
      rb.path('concenteratorId', params.concenteratorId, {});
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
          return r as StrictHttpResponse<Array<IUpdateConcentratorDetail>>;
        })
      );
  }

  /**
   * Update concentrator details.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `concentratorConcenteratorIdPut$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  concentratorConcenteratorIdPut$Json(params: {
    concenteratorId: string;
    body?: UpdateConcentratorDetail;
  }): Observable<Array<IUpdateConcentratorDetail>> {
    return this.concentratorConcenteratorIdPut$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Array<IUpdateConcentratorDetail>>) => r.body as Array<IUpdateConcentratorDetail>)
    );
  }

  /**
   * Path part for operation updateConcentratorsStatePost
   */
  static readonly UpdateConcentratorsStatePostPath = '/update-concentrators-state';

  /**
   * Update concentrators state.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateConcentratorsStatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateConcentratorsStatePost$Response(params?: { body?: UpdateConcentratorsStateDto }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorService.UpdateConcentratorsStatePostPath, 'post');
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
   * Update concentrators state.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `updateConcentratorsStatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  updateConcentratorsStatePost(params?: { body?: UpdateConcentratorsStateDto }): Observable<void> {
    return this.updateConcentratorsStatePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
