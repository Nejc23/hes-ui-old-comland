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

import { ImportDeviceFileProcessingResultDto } from '../models/import-device-file-processing-result-dto';

@Injectable({
  providedIn: 'root'
})
export class DeviceImportService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation devicesImportPost
   */
  static readonly DevicesImportPostPath = '/devices/import';

  /**
   * Import devices from excel file.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `devicesImportPost()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  devicesImportPost$Response(params?: {
    body?: {
      ContentType?: string;
      ContentDisposition?: string;
      Headers?: {
        [key: string]: Array<string>;
      };
      Length?: number;
      Name?: string;
      FileName?: string;
    };
  }): Observable<StrictHttpResponse<ImportDeviceFileProcessingResultDto>> {
    const rb = new RequestBuilder(this.rootUrl, DeviceImportService.DevicesImportPostPath, 'post');
    if (params) {
      rb.body(params.body, 'multipart/form-data');
    }

    return this.http
      .request(
        rb.build({
          responseType: 'json',
          accept: 'application/json'
        })
      )
      .pipe(
        filter((r: any) => r instanceof HttpResponse),
        map((r: HttpResponse<any>) => {
          return r as StrictHttpResponse<ImportDeviceFileProcessingResultDto>;
        })
      );
  }

  /**
   * Import devices from excel file.
   *
   *
   *
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `devicesImportPost$Response()` instead.
   *
   * This method sends `multipart/form-data` and handles request body of type `multipart/form-data`.
   */
  devicesImportPost(params?: {
    body?: {
      ContentType?: string;
      ContentDisposition?: string;
      Headers?: {
        [key: string]: Array<string>;
      };
      Length?: number;
      Name?: string;
      FileName?: string;
    };
  }): Observable<ImportDeviceFileProcessingResultDto> {
    return this.devicesImportPost$Response(params).pipe(
      map((r: StrictHttpResponse<ImportDeviceFileProcessingResultDto>) => r.body as ImportDeviceFileProcessingResultDto)
    );
  }
}
