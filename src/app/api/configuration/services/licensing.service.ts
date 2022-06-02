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

@Injectable({
  providedIn: 'root'
})
export class LicensingService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation licensingGet
   */
  static readonly LicensingGetPath = '/licensing';

  /**
   * Gets the grid config for the given user and grid keys.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `licensingGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  licensingGet$Response(params?: {}): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, LicensingService.LicensingGetPath, 'get');
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
   * Gets the grid config for the given user and grid keys.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `licensingGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  licensingGet(params?: {}): Observable<any> {
    return this.licensingGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
