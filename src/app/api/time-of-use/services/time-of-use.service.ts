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

import { TimeOfUseFile } from '../models/time-of-use-file';

@Injectable({
  providedIn: 'root'
})
export class TimeOfUseService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation importTimeOfUsePost
   */
  static readonly ImportTimeOfUsePostPath = '/import-time-of-use';

  /**
   * Import time of use from xml file.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `importTimeOfUsePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  importTimeOfUsePost$Response(params?: { body?: TimeOfUseFile }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, TimeOfUseService.ImportTimeOfUsePostPath, 'post');
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
   * Import time of use from xml file.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `importTimeOfUsePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  importTimeOfUsePost(params?: { body?: TimeOfUseFile }): Observable<void> {
    return this.importTimeOfUsePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
