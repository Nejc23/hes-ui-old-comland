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

import { CryptoClientCertificateDto } from '../models/crypto-client-certificate-dto';
import { CryptoCredentialDto } from '../models/crypto-credential-dto';

@Injectable({
  providedIn: 'root'
})
export class ManagementService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation managementClientCertificatesRequestGet
   */
  static readonly ManagementClientCertificatesRequestGetPath = '/management/client-certificates-request';

  /**
   * Get all client certificates.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `managementClientCertificatesRequestGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  managementClientCertificatesRequestGet$Plain$Response(params?: {}): Observable<StrictHttpResponse<Array<CryptoClientCertificateDto>>> {
    const rb = new RequestBuilder(this.rootUrl, ManagementService.ManagementClientCertificatesRequestGetPath, 'get');
    if (params) {
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
          return r as StrictHttpResponse<Array<CryptoClientCertificateDto>>;
        })
      );
  }

  /**
   * Get all client certificates.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `managementClientCertificatesRequestGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  managementClientCertificatesRequestGet$Plain(params?: {}): Observable<Array<CryptoClientCertificateDto>> {
    return this.managementClientCertificatesRequestGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CryptoClientCertificateDto>>) => r.body as Array<CryptoClientCertificateDto>)
    );
  }

  /**
   * Get all client certificates.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `managementClientCertificatesRequestGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  managementClientCertificatesRequestGet$Json$Response(params?: {}): Observable<StrictHttpResponse<Array<CryptoClientCertificateDto>>> {
    const rb = new RequestBuilder(this.rootUrl, ManagementService.ManagementClientCertificatesRequestGetPath, 'get');
    if (params) {
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
          return r as StrictHttpResponse<Array<CryptoClientCertificateDto>>;
        })
      );
  }

  /**
   * Get all client certificates.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `managementClientCertificatesRequestGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  managementClientCertificatesRequestGet$Json(params?: {}): Observable<Array<CryptoClientCertificateDto>> {
    return this.managementClientCertificatesRequestGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CryptoClientCertificateDto>>) => r.body as Array<CryptoClientCertificateDto>)
    );
  }

  /**
   * Path part for operation managementClientCertificatesRequestPendingGet
   */
  static readonly ManagementClientCertificatesRequestPendingGetPath = '/management/client-certificates-request/pending';

  /**
   * Get all pending client certificates.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `managementClientCertificatesRequestPendingGet$Plain()` instead.
   *
   * This method doesn't expect any request body.
   */
  managementClientCertificatesRequestPendingGet$Plain$Response(params?: {}): Observable<
    StrictHttpResponse<Array<CryptoClientCertificateDto>>
  > {
    const rb = new RequestBuilder(this.rootUrl, ManagementService.ManagementClientCertificatesRequestPendingGetPath, 'get');
    if (params) {
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
          return r as StrictHttpResponse<Array<CryptoClientCertificateDto>>;
        })
      );
  }

  /**
   * Get all pending client certificates.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `managementClientCertificatesRequestPendingGet$Plain$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  managementClientCertificatesRequestPendingGet$Plain(params?: {}): Observable<Array<CryptoClientCertificateDto>> {
    return this.managementClientCertificatesRequestPendingGet$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CryptoClientCertificateDto>>) => r.body as Array<CryptoClientCertificateDto>)
    );
  }

  /**
   * Get all pending client certificates.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `managementClientCertificatesRequestPendingGet$Json()` instead.
   *
   * This method doesn't expect any request body.
   */
  managementClientCertificatesRequestPendingGet$Json$Response(params?: {}): Observable<
    StrictHttpResponse<Array<CryptoClientCertificateDto>>
  > {
    const rb = new RequestBuilder(this.rootUrl, ManagementService.ManagementClientCertificatesRequestPendingGetPath, 'get');
    if (params) {
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
          return r as StrictHttpResponse<Array<CryptoClientCertificateDto>>;
        })
      );
  }

  /**
   * Get all pending client certificates.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `managementClientCertificatesRequestPendingGet$Json$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  managementClientCertificatesRequestPendingGet$Json(params?: {}): Observable<Array<CryptoClientCertificateDto>> {
    return this.managementClientCertificatesRequestPendingGet$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Array<CryptoClientCertificateDto>>) => r.body as Array<CryptoClientCertificateDto>)
    );
  }

  /**
   * Path part for operation managementClientCertificateRequestIdConfirmPost
   */
  static readonly ManagementClientCertificateRequestIdConfirmPostPath = '/management/client-certificate-request/{id}/confirm';

  /**
   * Trigger confirm of client certificate.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `managementClientCertificateRequestIdConfirmPost()` instead.
   *
   * This method doesn't expect any request body.
   */
  managementClientCertificateRequestIdConfirmPost$Response(params: { id: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ManagementService.ManagementClientCertificateRequestIdConfirmPostPath, 'post');
    if (params) {
      rb.path('id', params.id, {});
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
   * Trigger confirm of client certificate.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `managementClientCertificateRequestIdConfirmPost$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  managementClientCertificateRequestIdConfirmPost(params: { id: string }): Observable<void> {
    return this.managementClientCertificateRequestIdConfirmPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation managementClientCertificateRequestIdRejectPost
   */
  static readonly ManagementClientCertificateRequestIdRejectPostPath = '/management/client-certificate-request/{id}/reject';

  /**
   * Trigger reject of client certificate.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `managementClientCertificateRequestIdRejectPost()` instead.
   *
   * This method doesn't expect any request body.
   */
  managementClientCertificateRequestIdRejectPost$Response(params: { id: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ManagementService.ManagementClientCertificateRequestIdRejectPostPath, 'post');
    if (params) {
      rb.path('id', params.id, {});
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
   * Trigger reject of client certificate.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `managementClientCertificateRequestIdRejectPost$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  managementClientCertificateRequestIdRejectPost(params: { id: string }): Observable<void> {
    return this.managementClientCertificateRequestIdRejectPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation managementDownloadDataconcentratorClientCertificatePost
   */
  static readonly ManagementDownloadDataconcentratorClientCertificatePostPath = '/management/download-dataconcentrator-client-certificate';

  /**
   * Download DataConcentrator client certificate.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `managementDownloadDataconcentratorClientCertificatePost$Plain()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  managementDownloadDataconcentratorClientCertificatePost$Plain$Response(params?: {
    body?: CryptoCredentialDto;
  }): Observable<StrictHttpResponse<Blob>> {
    const rb = new RequestBuilder(this.rootUrl, ManagementService.ManagementDownloadDataconcentratorClientCertificatePostPath, 'post');
    if (params) {
      rb.body(params.body, 'application/*+json');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'blob',
          accept: 'text/plain'
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
   * Download DataConcentrator client certificate.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `managementDownloadDataconcentratorClientCertificatePost$Plain$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  managementDownloadDataconcentratorClientCertificatePost$Plain(params?: { body?: CryptoCredentialDto }): Observable<Blob> {
    return this.managementDownloadDataconcentratorClientCertificatePost$Plain$Response(params).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }

  /**
   * Download DataConcentrator client certificate.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `managementDownloadDataconcentratorClientCertificatePost$Json()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  managementDownloadDataconcentratorClientCertificatePost$Json$Response(params?: {
    body?: CryptoCredentialDto;
  }): Observable<StrictHttpResponse<Blob>> {
    const rb = new RequestBuilder(this.rootUrl, ManagementService.ManagementDownloadDataconcentratorClientCertificatePostPath, 'post');
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
   * Download DataConcentrator client certificate.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `managementDownloadDataconcentratorClientCertificatePost$Json$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  managementDownloadDataconcentratorClientCertificatePost$Json(params?: { body?: CryptoCredentialDto }): Observable<Blob> {
    return this.managementDownloadDataconcentratorClientCertificatePost$Json$Response(params).pipe(
      map((r: StrictHttpResponse<Blob>) => r.body as Blob)
    );
  }
}
