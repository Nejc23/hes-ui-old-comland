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

@Injectable({
  providedIn: 'root'
})
export class ImportService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation importFileTypePost
   */
  static readonly ImportFileTypePostPath = '/import/{fileType}';

  /**
   * Import GULF.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `importFileTypePost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  importFileTypePost$Response(params: {
    fileType: string;
    body?: {
      file?: Blob | null;
    };
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ImportService.ImportFileTypePostPath, 'post');
    if (params) {
      rb.path('fileType', params.fileType, {});
      rb.body(params.body, 'multipart/form-data');
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
   * Import GULF.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `importFileTypePost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  importFileTypePost(params: {
    fileType: string;
    body?: {
      file?: Blob | null;
    };
  }): Observable<void> {
    return this.importFileTypePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation importImportIdGet
   */
  static readonly ImportImportIdGetPath = '/import/{importId}';

  /**
   * Check GULF import job.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `importImportIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  importImportIdGet$Response(params: { importId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ImportService.ImportImportIdGetPath, 'get');
    if (params) {
      rb.path('importId', params.importId, {});
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
   * Check GULF import job.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `importImportIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  importImportIdGet(params: { importId: string }): Observable<void> {
    return this.importImportIdGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
