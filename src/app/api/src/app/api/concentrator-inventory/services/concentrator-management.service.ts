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

import { CiiRequest } from '../models/cii-request';
import { ClearAlarmsRequest } from '../models/clear-alarms-request';
import { ClearFfRegisterRequest } from '../models/clear-ff-register-request';
import { ConcentratorEventsRequest } from '../models/concentrator-events-request';
import { ConcentratorRekeyRequest } from '../models/concentrator-rekey-request';
import { ConcentratorUpgradeRequest } from '../models/concentrator-upgrade-request';
import { DataExportRequest } from '../models/data-export-request';
import { DeviceBreakerRequest } from '../models/device-breaker-request';
import { DeviceClockSyncRequest } from '../models/device-clock-sync-request';
import { DeviceDiscoveryRequest } from '../models/device-discovery-request';
import { DeviceRelayRequest } from '../models/device-relay-request';
import { DeviceUpgradeActivationRequest } from '../models/device-upgrade-activation-request';
import { DeviceUpgradeRequest } from '../models/device-upgrade-request';
import { EnableHlsRequest } from '../models/enable-hls-request';
import { GetDeviceBillingValuesRequest } from '../models/get-device-billing-values-request';
import { GetDeviceFwUpgradeStatusRequest } from '../models/get-device-fw-upgrade-status-request';
import { GetDeviceNamedBillingValuesRequest } from '../models/get-device-named-billing-values-request';
import { GetDeviceRegisterValueNamedRequest } from '../models/get-device-register-value-named-request';
import { GetDeviceRegisterValueRequest } from '../models/get-device-register-value-request';
import { MeterParametrizationExecuteRequest } from '../models/meter-parametrization-execute-request';
import { MeterParametrizationParseRequest } from '../models/meter-parametrization-parse-request';
import { MeterPasswordChangeRequest } from '../models/meter-password-change-request';
import { MeterRekeyRequest } from '../models/meter-rekey-request';
import { ReadDeviceProfileDataWebApiRequest } from '../models/read-device-profile-data-web-api-request';
import { ReadDeviceRegisterGroupDataRequest } from '../models/read-device-register-group-data-request';
import { ReadMeterByGroupRequest } from '../models/read-meter-by-group-request';
import { ReadRegistersByTypeRequest } from '../models/read-registers-by-type-request';
import { SetBreakerModeRequest } from '../models/set-breaker-mode-request';
import { SetConcentratorTimeFilterableRequest } from '../models/set-concentrator-time-filterable-request';
import { SetConcentratorTimeRequest } from '../models/set-concentrator-time-request';
import { SetDeviceDisplaySettingsRequest } from '../models/set-device-display-settings-request';
import { SetDeviceLimiterRequest } from '../models/set-device-limiter-request';
import { SetDeviceMonitorRequest } from '../models/set-device-monitor-request';
import { SetRelayModeRequest } from '../models/set-relay-mode-request';
import { SetTimeOfUseRequest } from '../models/set-time-of-use-request';
import { TriggerGetByRegisterTypeRequest } from '../models/trigger-get-by-register-type-request';
import { TriggerReadShortNamesRequest } from '../models/trigger-read-short-names-request';

@Injectable({
  providedIn: 'root'
})
export class ConcentratorManagementService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /**
   * Path part for operation onDemandCiiActivatePost
   */
  static readonly OnDemandCiiActivatePostPath = '/on-demand/cii/activate';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandCiiActivatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandCiiActivatePost$Response(params?: { body?: CiiRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandCiiActivatePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandCiiActivatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandCiiActivatePost(params?: { body?: CiiRequest }): Observable<void> {
    return this.onDemandCiiActivatePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandCiiDeactivatePost
   */
  static readonly OnDemandCiiDeactivatePostPath = '/on-demand/cii/deactivate';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandCiiDeactivatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandCiiDeactivatePost$Response(params?: { body?: CiiRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandCiiDeactivatePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandCiiDeactivatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandCiiDeactivatePost(params?: { body?: CiiRequest }): Observable<void> {
    return this.onDemandCiiDeactivatePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandCiiStatePost
   */
  static readonly OnDemandCiiStatePostPath = '/on-demand/cii/state';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandCiiStatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandCiiStatePost$Response(params?: { body?: TriggerGetByRegisterTypeRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandCiiStatePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandCiiStatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandCiiStatePost(params?: { body?: TriggerGetByRegisterTypeRequest }): Observable<void> {
    return this.onDemandCiiStatePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation readingReadConcentratorEventsDataPost
   */
  static readonly ReadingReadConcentratorEventsDataPostPath = '/reading/read-concentrator-events-data';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `readingReadConcentratorEventsDataPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  readingReadConcentratorEventsDataPost$Response(params?: { body?: ConcentratorEventsRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.ReadingReadConcentratorEventsDataPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `readingReadConcentratorEventsDataPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  readingReadConcentratorEventsDataPost(params?: { body?: ConcentratorEventsRequest }): Observable<void> {
    return this.readingReadConcentratorEventsDataPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation triggerConcentratorUpgradePost
   */
  static readonly TriggerConcentratorUpgradePostPath = '/trigger-concentrator-upgrade';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `triggerConcentratorUpgradePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerConcentratorUpgradePost$Response(params?: { body?: ConcentratorUpgradeRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.TriggerConcentratorUpgradePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `triggerConcentratorUpgradePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerConcentratorUpgradePost(params?: { body?: ConcentratorUpgradeRequest }): Observable<void> {
    return this.triggerConcentratorUpgradePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation triggerDataExportPost
   */
  static readonly TriggerDataExportPostPath = '/trigger-data-export';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `triggerDataExportPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerDataExportPost$Response(params?: { body?: DataExportRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.TriggerDataExportPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `triggerDataExportPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerDataExportPost(params?: { body?: DataExportRequest }): Observable<void> {
    return this.triggerDataExportPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation dataExportJobsGet
   */
  static readonly DataExportJobsGetPath = '/data-export-jobs';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `dataExportJobsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  dataExportJobsGet$Response(params?: { isExport?: boolean }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.DataExportJobsGetPath, 'get');
    if (params) {
      rb.query('isExport', params.isExport, {});
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `dataExportJobsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  dataExportJobsGet(params?: { isExport?: boolean }): Observable<void> {
    return this.dataExportJobsGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation triggerDeviceDiscoveryPost
   */
  static readonly TriggerDeviceDiscoveryPostPath = '/trigger-device-discovery';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `triggerDeviceDiscoveryPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerDeviceDiscoveryPost$Response(params?: { body?: DeviceDiscoveryRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.TriggerDeviceDiscoveryPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `triggerDeviceDiscoveryPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerDeviceDiscoveryPost(params?: { body?: DeviceDiscoveryRequest }): Observable<void> {
    return this.triggerDeviceDiscoveryPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation triggerDeviceUpgradePost
   */
  static readonly TriggerDeviceUpgradePostPath = '/trigger-device-upgrade';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `triggerDeviceUpgradePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerDeviceUpgradePost$Response(params?: { body?: DeviceUpgradeRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.TriggerDeviceUpgradePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `triggerDeviceUpgradePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerDeviceUpgradePost(params?: { body?: DeviceUpgradeRequest }): Observable<void> {
    return this.triggerDeviceUpgradePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation triggerDeviceUpgradeActivatePost
   */
  static readonly TriggerDeviceUpgradeActivatePostPath = '/trigger-device-upgrade/activate';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `triggerDeviceUpgradeActivatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerDeviceUpgradeActivatePost$Response(params?: { body?: DeviceUpgradeActivationRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.TriggerDeviceUpgradeActivatePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `triggerDeviceUpgradeActivatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerDeviceUpgradeActivatePost(params?: { body?: DeviceUpgradeActivationRequest }): Observable<void> {
    return this.triggerDeviceUpgradeActivatePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation triggerSetConcentratorTimePost
   */
  static readonly TriggerSetConcentratorTimePostPath = '/trigger-set-concentrator-time';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `triggerSetConcentratorTimePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerSetConcentratorTimePost$Response(params?: { body?: SetConcentratorTimeRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.TriggerSetConcentratorTimePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `triggerSetConcentratorTimePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerSetConcentratorTimePost(params?: { body?: SetConcentratorTimeRequest }): Observable<void> {
    return this.triggerSetConcentratorTimePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation triggerSetConcentratorTimeFilterablePost
   */
  static readonly TriggerSetConcentratorTimeFilterablePostPath = '/trigger-set-concentrator-time-filterable';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `triggerSetConcentratorTimeFilterablePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerSetConcentratorTimeFilterablePost$Response(params?: {
    body?: SetConcentratorTimeFilterableRequest;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.TriggerSetConcentratorTimeFilterablePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `triggerSetConcentratorTimeFilterablePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerSetConcentratorTimeFilterablePost(params?: { body?: SetConcentratorTimeFilterableRequest }): Observable<void> {
    return this.triggerSetConcentratorTimeFilterablePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandTriggerGetNamedBillingValuesPost
   */
  static readonly OnDemandTriggerGetNamedBillingValuesPostPath = '/on-demand/trigger-get-named-billing-values';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandTriggerGetNamedBillingValuesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerGetNamedBillingValuesPost$Response(params?: {
    body?: GetDeviceNamedBillingValuesRequest;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandTriggerGetNamedBillingValuesPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandTriggerGetNamedBillingValuesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerGetNamedBillingValuesPost(params?: { body?: GetDeviceNamedBillingValuesRequest }): Observable<void> {
    return this.onDemandTriggerGetNamedBillingValuesPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandTriggerGetBillingValuesPost
   */
  static readonly OnDemandTriggerGetBillingValuesPostPath = '/on-demand/trigger-get-billing-values';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandTriggerGetBillingValuesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerGetBillingValuesPost$Response(params?: { body?: GetDeviceBillingValuesRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandTriggerGetBillingValuesPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandTriggerGetBillingValuesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerGetBillingValuesPost(params?: { body?: GetDeviceBillingValuesRequest }): Observable<void> {
    return this.onDemandTriggerGetBillingValuesPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandTriggerGetNamedRegisterValuePost
   */
  static readonly OnDemandTriggerGetNamedRegisterValuePostPath = '/on-demand/trigger-get-named-register-value';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandTriggerGetNamedRegisterValuePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerGetNamedRegisterValuePost$Response(params?: {
    body?: GetDeviceRegisterValueNamedRequest;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandTriggerGetNamedRegisterValuePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandTriggerGetNamedRegisterValuePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerGetNamedRegisterValuePost(params?: { body?: GetDeviceRegisterValueNamedRequest }): Observable<void> {
    return this.onDemandTriggerGetNamedRegisterValuePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandTriggerGetRegisterValuePost
   */
  static readonly OnDemandTriggerGetRegisterValuePostPath = '/on-demand/trigger-get-register-value';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandTriggerGetRegisterValuePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerGetRegisterValuePost$Response(params?: { body?: GetDeviceRegisterValueRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandTriggerGetRegisterValuePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandTriggerGetRegisterValuePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerGetRegisterValuePost(params?: { body?: GetDeviceRegisterValueRequest }): Observable<void> {
    return this.onDemandTriggerGetRegisterValuePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation readingReadDeviceFwUpgradeStatusPost
   */
  static readonly ReadingReadDeviceFwUpgradeStatusPostPath = '/reading/read-device-fw-upgrade-status';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `readingReadDeviceFwUpgradeStatusPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  readingReadDeviceFwUpgradeStatusPost$Response(params?: { body?: GetDeviceFwUpgradeStatusRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.ReadingReadDeviceFwUpgradeStatusPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `readingReadDeviceFwUpgradeStatusPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  readingReadDeviceFwUpgradeStatusPost(params?: { body?: GetDeviceFwUpgradeStatusRequest }): Observable<void> {
    return this.readingReadDeviceFwUpgradeStatusPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandTriggerDeviceDisconnectPost
   */
  static readonly OnDemandTriggerDeviceDisconnectPostPath = '/on-demand/trigger-device-disconnect';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandTriggerDeviceDisconnectPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerDeviceDisconnectPost$Response(params?: { body?: DeviceBreakerRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandTriggerDeviceDisconnectPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandTriggerDeviceDisconnectPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerDeviceDisconnectPost(params?: { body?: DeviceBreakerRequest }): Observable<void> {
    return this.onDemandTriggerDeviceDisconnectPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandTriggerDeviceConnectPost
   */
  static readonly OnDemandTriggerDeviceConnectPostPath = '/on-demand/trigger-device-connect';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandTriggerDeviceConnectPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerDeviceConnectPost$Response(params?: { body?: DeviceBreakerRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandTriggerDeviceConnectPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandTriggerDeviceConnectPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerDeviceConnectPost(params?: { body?: DeviceBreakerRequest }): Observable<void> {
    return this.onDemandTriggerDeviceConnectPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandTriggerGetDisconnectorStatePost
   */
  static readonly OnDemandTriggerGetDisconnectorStatePostPath = '/on-demand/trigger-get-disconnector-state';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandTriggerGetDisconnectorStatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerGetDisconnectorStatePost$Response(params?: {
    body?: TriggerGetByRegisterTypeRequest;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandTriggerGetDisconnectorStatePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandTriggerGetDisconnectorStatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerGetDisconnectorStatePost(params?: { body?: TriggerGetByRegisterTypeRequest }): Observable<void> {
    return this.onDemandTriggerGetDisconnectorStatePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandRelayGetStatePost
   */
  static readonly OnDemandRelayGetStatePostPath = '/on-demand/relay/get-state';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandRelayGetStatePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandRelayGetStatePost$Response(params?: { body?: TriggerGetByRegisterTypeRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandRelayGetStatePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandRelayGetStatePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandRelayGetStatePost(params?: { body?: TriggerGetByRegisterTypeRequest }): Observable<void> {
    return this.onDemandRelayGetStatePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation triggerSetDisplaySettingsPost
   */
  static readonly TriggerSetDisplaySettingsPostPath = '/trigger-set-display-settings';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `triggerSetDisplaySettingsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerSetDisplaySettingsPost$Response(params?: { body?: SetDeviceDisplaySettingsRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.TriggerSetDisplaySettingsPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `triggerSetDisplaySettingsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerSetDisplaySettingsPost(params?: { body?: SetDeviceDisplaySettingsRequest }): Observable<void> {
    return this.triggerSetDisplaySettingsPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandTriggerClockSyncPost
   */
  static readonly OnDemandTriggerClockSyncPostPath = '/on-demand/trigger-clock-sync';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandTriggerClockSyncPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerClockSyncPost$Response(params?: { body?: DeviceClockSyncRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandTriggerClockSyncPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandTriggerClockSyncPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerClockSyncPost(params?: { body?: DeviceClockSyncRequest }): Observable<void> {
    return this.onDemandTriggerClockSyncPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandRelayDisconnectPost
   */
  static readonly OnDemandRelayDisconnectPostPath = '/on-demand/relay/disconnect';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandRelayDisconnectPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandRelayDisconnectPost$Response(params?: { body?: DeviceRelayRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandRelayDisconnectPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandRelayDisconnectPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandRelayDisconnectPost(params?: { body?: DeviceRelayRequest }): Observable<void> {
    return this.onDemandRelayDisconnectPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandRelayConnectPost
   */
  static readonly OnDemandRelayConnectPostPath = '/on-demand/relay/connect';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandRelayConnectPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandRelayConnectPost$Response(params?: { body?: DeviceRelayRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandRelayConnectPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandRelayConnectPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandRelayConnectPost(params?: { body?: DeviceRelayRequest }): Observable<void> {
    return this.onDemandRelayConnectPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandRegistersTypePost
   */
  static readonly OnDemandRegistersTypePostPath = '/on-demand/registers/type';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandRegistersTypePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandRegistersTypePost$Response(params?: { body?: ReadRegistersByTypeRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandRegistersTypePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandRegistersTypePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandRegistersTypePost(params?: { body?: ReadRegistersByTypeRequest }): Observable<void> {
    return this.onDemandRegistersTypePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandReadMeterPost
   */
  static readonly OnDemandReadMeterPostPath = '/on-demand/read-meter';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandReadMeterPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandReadMeterPost$Response(params?: { body?: ReadMeterByGroupRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandReadMeterPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandReadMeterPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandReadMeterPost(params?: { body?: ReadMeterByGroupRequest }): Observable<void> {
    return this.onDemandReadMeterPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandTriggerReadShortNamesPost
   */
  static readonly OnDemandTriggerReadShortNamesPostPath = '/on-demand/trigger-read-short-names';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandTriggerReadShortNamesPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerReadShortNamesPost$Response(params?: { body?: TriggerReadShortNamesRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandTriggerReadShortNamesPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandTriggerReadShortNamesPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerReadShortNamesPost(params?: { body?: TriggerReadShortNamesRequest }): Observable<void> {
    return this.onDemandTriggerReadShortNamesPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandTriggerSetBreakerModePost
   */
  static readonly OnDemandTriggerSetBreakerModePostPath = '/on-demand/trigger-set-breaker-mode';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandTriggerSetBreakerModePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerSetBreakerModePost$Response(params?: { body?: SetBreakerModeRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandTriggerSetBreakerModePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandTriggerSetBreakerModePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerSetBreakerModePost(params?: { body?: SetBreakerModeRequest }): Observable<void> {
    return this.onDemandTriggerSetBreakerModePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandTriggerSetLimiterPost
   */
  static readonly OnDemandTriggerSetLimiterPostPath = '/on-demand/trigger-set-limiter';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandTriggerSetLimiterPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerSetLimiterPost$Response(params?: { body?: SetDeviceLimiterRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandTriggerSetLimiterPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandTriggerSetLimiterPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerSetLimiterPost(params?: { body?: SetDeviceLimiterRequest }): Observable<void> {
    return this.onDemandTriggerSetLimiterPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandTriggerClearFfRegisterPost
   */
  static readonly OnDemandTriggerClearFfRegisterPostPath = '/on-demand/trigger-clear-ff-register';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandTriggerClearFfRegisterPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerClearFfRegisterPost$Response(params?: { body?: ClearFfRegisterRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandTriggerClearFfRegisterPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandTriggerClearFfRegisterPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerClearFfRegisterPost(params?: { body?: ClearFfRegisterRequest }): Observable<void> {
    return this.onDemandTriggerClearFfRegisterPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandTriggerSetDeviceMonitorPost
   */
  static readonly OnDemandTriggerSetDeviceMonitorPostPath = '/on-demand/trigger-set-device-monitor';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandTriggerSetDeviceMonitorPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerSetDeviceMonitorPost$Response(params?: { body?: SetDeviceMonitorRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandTriggerSetDeviceMonitorPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandTriggerSetDeviceMonitorPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandTriggerSetDeviceMonitorPost(params?: { body?: SetDeviceMonitorRequest }): Observable<void> {
    return this.onDemandTriggerSetDeviceMonitorPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandRelayModePost
   */
  static readonly OnDemandRelayModePostPath = '/on-demand/relay/mode';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandRelayModePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandRelayModePost$Response(params?: { body?: SetRelayModeRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandRelayModePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandRelayModePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandRelayModePost(params?: { body?: SetRelayModeRequest }): Observable<void> {
    return this.onDemandRelayModePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation onDemandClearAlarmsPost
   */
  static readonly OnDemandClearAlarmsPostPath = '/on-demand/clear-alarms';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `onDemandClearAlarmsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandClearAlarmsPost$Response(params?: { body?: ClearAlarmsRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.OnDemandClearAlarmsPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `onDemandClearAlarmsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  onDemandClearAlarmsPost(params?: { body?: ClearAlarmsRequest }): Observable<void> {
    return this.onDemandClearAlarmsPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation meterParametrizationParsePost
   */
  static readonly MeterParametrizationParsePostPath = '/meter-parametrization/parse';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `meterParametrizationParsePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterParametrizationParsePost$Response(params?: { body?: MeterParametrizationParseRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.MeterParametrizationParsePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `meterParametrizationParsePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterParametrizationParsePost(params?: { body?: MeterParametrizationParseRequest }): Observable<void> {
    return this.meterParametrizationParsePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation meterParametrizationExecutePost
   */
  static readonly MeterParametrizationExecutePostPath = '/meter-parametrization/execute';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `meterParametrizationExecutePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterParametrizationExecutePost$Response(params?: { body?: MeterParametrizationExecuteRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.MeterParametrizationExecutePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `meterParametrizationExecutePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  meterParametrizationExecutePost(params?: { body?: MeterParametrizationExecuteRequest }): Observable<void> {
    return this.meterParametrizationExecutePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation readingReadDeviceProfileDataPost
   */
  static readonly ReadingReadDeviceProfileDataPostPath = '/reading/read-device-profile-data';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `readingReadDeviceProfileDataPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  readingReadDeviceProfileDataPost$Response(params?: { body?: ReadDeviceProfileDataWebApiRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.ReadingReadDeviceProfileDataPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `readingReadDeviceProfileDataPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  readingReadDeviceProfileDataPost(params?: { body?: ReadDeviceProfileDataWebApiRequest }): Observable<void> {
    return this.readingReadDeviceProfileDataPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation readingReadDeviceRegisterGroupDataPost
   */
  static readonly ReadingReadDeviceRegisterGroupDataPostPath = '/reading/read-device-register-group-data';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `readingReadDeviceRegisterGroupDataPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  readingReadDeviceRegisterGroupDataPost$Response(params?: {
    body?: ReadDeviceRegisterGroupDataRequest;
  }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.ReadingReadDeviceRegisterGroupDataPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `readingReadDeviceRegisterGroupDataPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  readingReadDeviceRegisterGroupDataPost(params?: { body?: ReadDeviceRegisterGroupDataRequest }): Observable<void> {
    return this.readingReadDeviceRegisterGroupDataPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation securityMeterChangePasswordPost
   */
  static readonly SecurityMeterChangePasswordPostPath = '/security/meter/change-password';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `securityMeterChangePasswordPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  securityMeterChangePasswordPost$Response(params?: { body?: MeterPasswordChangeRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.SecurityMeterChangePasswordPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `securityMeterChangePasswordPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  securityMeterChangePasswordPost(params?: { body?: MeterPasswordChangeRequest }): Observable<void> {
    return this.securityMeterChangePasswordPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation securityConcentratorsRekeyPost
   */
  static readonly SecurityConcentratorsRekeyPostPath = '/security/concentrators/rekey';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `securityConcentratorsRekeyPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  securityConcentratorsRekeyPost$Response(params?: { body?: ConcentratorRekeyRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.SecurityConcentratorsRekeyPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `securityConcentratorsRekeyPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  securityConcentratorsRekeyPost(params?: { body?: ConcentratorRekeyRequest }): Observable<void> {
    return this.securityConcentratorsRekeyPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation securityMeterRekeyPost
   */
  static readonly SecurityMeterRekeyPostPath = '/security/meter/rekey';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `securityMeterRekeyPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  securityMeterRekeyPost$Response(params?: { body?: MeterRekeyRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.SecurityMeterRekeyPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `securityMeterRekeyPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  securityMeterRekeyPost(params?: { body?: MeterRekeyRequest }): Observable<void> {
    return this.securityMeterRekeyPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation securityMeterRekeyRequestIdRetriesPost
   */
  static readonly SecurityMeterRekeyRequestIdRetriesPostPath = '/security/meter/rekey/{requestId}/retries';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `securityMeterRekeyRequestIdRetriesPost()` instead.
   *
   * This method doesn't expect any request body.
   */
  securityMeterRekeyRequestIdRetriesPost$Response(params: { requestId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.SecurityMeterRekeyRequestIdRetriesPostPath, 'post');
    if (params) {
      rb.path('requestId', params.requestId, {});
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `securityMeterRekeyRequestIdRetriesPost$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  securityMeterRekeyRequestIdRetriesPost(params: { requestId: string }): Observable<void> {
    return this.securityMeterRekeyRequestIdRetriesPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation securityMeterChangePasswordRequestIdRetriesPost
   */
  static readonly SecurityMeterChangePasswordRequestIdRetriesPostPath = '/security/meter/change-password/{requestId}/retries';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `securityMeterChangePasswordRequestIdRetriesPost()` instead.
   *
   * This method doesn't expect any request body.
   */
  securityMeterChangePasswordRequestIdRetriesPost$Response(params: { requestId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.SecurityMeterChangePasswordRequestIdRetriesPostPath, 'post');
    if (params) {
      rb.path('requestId', params.requestId, {});
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `securityMeterChangePasswordRequestIdRetriesPost$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  securityMeterChangePasswordRequestIdRetriesPost(params: { requestId: string }): Observable<void> {
    return this.securityMeterChangePasswordRequestIdRetriesPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation securityMeterChangePasswordStatusRequestIdGet
   */
  static readonly SecurityMeterChangePasswordStatusRequestIdGetPath = '/security/meter/change-password/status/{requestId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `securityMeterChangePasswordStatusRequestIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  securityMeterChangePasswordStatusRequestIdGet$Response(params: { requestId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.SecurityMeterChangePasswordStatusRequestIdGetPath, 'get');
    if (params) {
      rb.path('requestId', params.requestId, {});
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `securityMeterChangePasswordStatusRequestIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  securityMeterChangePasswordStatusRequestIdGet(params: { requestId: string }): Observable<void> {
    return this.securityMeterChangePasswordStatusRequestIdGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation securityMeterRekeyStatusRequestIdGet
   */
  static readonly SecurityMeterRekeyStatusRequestIdGetPath = '/security/meter/rekey/status/{requestId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `securityMeterRekeyStatusRequestIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  securityMeterRekeyStatusRequestIdGet$Response(params: { requestId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.SecurityMeterRekeyStatusRequestIdGetPath, 'get');
    if (params) {
      rb.path('requestId', params.requestId, {});
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `securityMeterRekeyStatusRequestIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  securityMeterRekeyStatusRequestIdGet(params: { requestId: string }): Observable<void> {
    return this.securityMeterRekeyStatusRequestIdGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation securityEnableHlsPost
   */
  static readonly SecurityEnableHlsPostPath = '/security/enable/hls';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `securityEnableHlsPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  securityEnableHlsPost$Response(params?: { body?: EnableHlsRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.SecurityEnableHlsPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `securityEnableHlsPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  securityEnableHlsPost(params?: { body?: EnableHlsRequest }): Observable<void> {
    return this.securityEnableHlsPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation requestIdLastStatusDeviceIdGet
   */
  static readonly RequestIdLastStatusDeviceIdGetPath = '/{requestId}/last-status/{deviceId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `requestIdLastStatusDeviceIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  requestIdLastStatusDeviceIdGet$Response(params: { requestId: string; deviceId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.RequestIdLastStatusDeviceIdGetPath, 'get');
    if (params) {
      rb.path('requestId', params.requestId, {});
      rb.path('deviceId', params.deviceId, {});
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `requestIdLastStatusDeviceIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  requestIdLastStatusDeviceIdGet(params: { requestId: string; deviceId: string }): Observable<void> {
    return this.requestIdLastStatusDeviceIdGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation requestIdProgressGet
   */
  static readonly RequestIdProgressGetPath = '/{requestId}/progress';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `requestIdProgressGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  requestIdProgressGet$Response(params: { requestId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.RequestIdProgressGetPath, 'get');
    if (params) {
      rb.path('requestId', params.requestId, {});
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `requestIdProgressGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  requestIdProgressGet(params: { requestId: string }): Observable<void> {
    return this.requestIdProgressGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation jobStateSummaryPost
   */
  static readonly JobStateSummaryPostPath = '/job-state/summary';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `jobStateSummaryPost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobStateSummaryPost$Response(params?: { body?: Array<string> }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.JobStateSummaryPostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `jobStateSummaryPost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  jobStateSummaryPost(params?: { body?: Array<string> }): Observable<void> {
    return this.jobStateSummaryPost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation deviceJobsDeviceIdActiveJobsGet
   */
  static readonly DeviceJobsDeviceIdActiveJobsGetPath = '/device-jobs/{deviceId}/active-jobs';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deviceJobsDeviceIdActiveJobsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceJobsDeviceIdActiveJobsGet$Response(params: { deviceId: string }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.DeviceJobsDeviceIdActiveJobsGetPath, 'get');
    if (params) {
      rb.path('deviceId', params.deviceId, {});
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `deviceJobsDeviceIdActiveJobsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deviceJobsDeviceIdActiveJobsGet(params: { deviceId: string }): Observable<void> {
    return this.deviceJobsDeviceIdActiveJobsGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation tasksDeviceImportGet
   */
  static readonly TasksDeviceImportGetPath = '/tasks/device-import';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `tasksDeviceImportGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  tasksDeviceImportGet$Response(params?: {}): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.TasksDeviceImportGetPath, 'get');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `tasksDeviceImportGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  tasksDeviceImportGet(params?: {}): Observable<void> {
    return this.tasksDeviceImportGet$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }

  /**
   * Path part for operation triggerSetTimeOfUsePost
   */
  static readonly TriggerSetTimeOfUsePostPath = '/trigger-set-time-of-use';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `triggerSetTimeOfUsePost()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerSetTimeOfUsePost$Response(params?: { body?: SetTimeOfUseRequest }): Observable<StrictHttpResponse<void>> {
    const rb = new RequestBuilder(this.rootUrl, ConcentratorManagementService.TriggerSetTimeOfUsePostPath, 'post');
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
   * This method provides access to only to the response body.
   * To access the full response (for headers, for example), `triggerSetTimeOfUsePost$Response()` instead.
   *
   * This method sends `application/*+json` and handles request body of type `application/*+json`.
   */
  triggerSetTimeOfUsePost(params?: { body?: SetTimeOfUseRequest }): Observable<void> {
    return this.triggerSetTimeOfUsePost$Response(params).pipe(map((r: StrictHttpResponse<void>) => r.body as void));
  }
}
