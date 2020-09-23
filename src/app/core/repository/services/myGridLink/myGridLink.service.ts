import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import {
  IdentityToken,
  LastStatus,
  ResponseConnectDisconnectData,
  RequestTOUData,
  ResponseTOUData,
  OnDemandRequestData,
  RequestSetMonitor,
  RequestLimiterGetRegisters,
  RequestSetLimiter,
  ResponseSetMonitor,
  ResponseSetLimiter,
  RequestFilterParams,
  RequestSetBreakerMode,
  ResponseSetBreakerMode
} from '../../interfaces/myGridLink/myGridLink.interceptor';
import {
  enumMyGridLink,
  identityToken,
  lastStatus,
  onDemandConnect,
  onDemandDisconnect,
  triggerSetTimeOfUse,
  onDemandDisconnectorState,
  onDemandData,
  importTemplates,
  triggerDeviceUpgrade,
  activateTriggerDeviceUpgrade as triggerDeviceUpgradeActivate,
  onDemandSetMonitor,
  getRegisters,
  onDemandSetLimiter,
  onDemandSetBreakerMode
} from '../../consts/my-grid-link.const';
import { MeterUnitsFwUpgrade, DcResponse } from '../../interfaces/meter-units/meter-units-fw-upgrade.interface';
import {
  MeterUnitsActivateUpgradeRequest,
  MeterUnitsActivateUpgradeResponse
} from '../../interfaces/meter-units/meter-units-acctivate-upgrade.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

@Injectable({
  providedIn: 'root'
})
export class MyGridLinkService {
  constructor(private repository: RepositoryService) {}

  // get identity token
  getMyGridIdentityToken(): Observable<IdentityToken> {
    return this.repository.makeRequest(this.getMyGridIdentityTokenRequest());
  }

  getMyGridIdentityTokenRequest(): HttpRequest<IdentityToken> {
    return new HttpRequest('GET', `${enumMyGridLink.identityTokenServer}${identityToken}`);
  }

  // get last status
  getMyGridLastStatus(requestId: string): Observable<LastStatus[]> {
    return this.repository.makeRequest(this.getMyGridLastStatusRequest(requestId));
  }
  // api/concentrator-management
  getMyGridLastStatusRequest(requestId: string): HttpRequest<LastStatus[]> {
    return new HttpRequest('GET', `${enumMyGridLink.managment}/${requestId}${lastStatus}`);
  }

  // connect device
  postMyGridConnectDevice(params: RequestFilterParams): Observable<ResponseConnectDisconnectData> {
    return this.repository.makeRequest(this.postMyGridConnectDeviceRequest(params));
  }

  postMyGridConnectDeviceRequest(params: RequestFilterParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandConnect}`, params);
  }

  // disconnect device
  postMyGridDisconnectDevice(params: RequestFilterParams): Observable<ResponseConnectDisconnectData> {
    return this.repository.makeRequest(this.postMyGridDisconnectDeviceRequest(params));
  }

  postMyGridDisconnectDeviceRequest(params: RequestFilterParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandDisconnect}`, params);
  }

  // trigger TOU
  postMyGridTOUDevice(params: RequestTOUData): Observable<ResponseTOUData> {
    return this.repository.makeRequest(this.postMyGridTOUDeviceRequest(params));
  }

  postMyGridTOUDeviceRequest(params: RequestTOUData): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${triggerSetTimeOfUse}`, params);
  }

  // get disconnector state
  getDisconnectorState(params: RequestFilterParams): Observable<ResponseConnectDisconnectData> {
    return this.repository.makeRequest(this.getDisconnectorStateRequest(params));
  }

  getDisconnectorStateRequest(params: RequestFilterParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandDisconnectorState}`, params);
  }

  // get data returned on-demand requests
  getOnDemandDataProcessing(requestId: string): Observable<OnDemandRequestData[]> {
    return this.repository.makeRequest(this.getOnDemandDataProcessingRequest(requestId));
  }

  getOnDemandDataProcessingRequest(requestId: string): HttpRequest<OnDemandRequestData[]> {
    return new HttpRequest('GET', `${enumMyGridLink.dataProcessing}/${requestId}${onDemandData}`);
  }

  // trigger TOU
  postMyGridTemplatesImport(params: string): Observable<any> {
    return this.repository.makeRequest(this.postMyGridTemplatesImportRequest(params));
  }

  postMyGridTemplatesImportRequest(params: string): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.templating}${importTemplates}`, params);
  }

  // trigger FW upgrade
  createFwUpgrade(payload: MeterUnitsFwUpgrade): Observable<DcResponse> {
    return this.repository.makeRequest(this.createFwUpgradeRequest(payload));
  }

  createFwUpgradeRequest(payload: MeterUnitsFwUpgrade): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${triggerDeviceUpgrade}`, payload);
  }

  activateDeviceUpgrade(param: MeterUnitsActivateUpgradeRequest): Observable<MeterUnitsActivateUpgradeResponse> {
    return this.repository.makeRequest(this.activateDeviceUpgradeRequest(param));
  }

  activateDeviceUpgradeRequest(param: MeterUnitsActivateUpgradeRequest): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${triggerDeviceUpgradeActivate}`, param);
  }

  // trigger set montor
  setMonitor(payload: RequestSetMonitor): Observable<ResponseSetMonitor> {
    return this.repository.makeRequest(this.setMonitorRequest(payload));
  }

  setMonitorRequest(payload: RequestSetMonitor): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandSetMonitor}`, payload);
  }

  // trigger set limter
  getLimiterRegisters(request: RequestLimiterGetRegisters): Observable<Codelist<string>[]> {
    return this.repository.makeRequest(this.getLimiterRegistersRequest(request));
  }

  getLimiterRegistersRequest(request: RequestLimiterGetRegisters): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.templating}${getRegisters}`, request);
  }

  setLimiter(payload: RequestSetLimiter): Observable<ResponseSetLimiter> {
    return this.repository.makeRequest(this.setLimiterRequest(payload));
  }

  setLimiterRequest(payload: RequestSetLimiter): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandSetLimiter}`, payload);
  }

  setBreakerMode(payload: RequestSetBreakerMode): Observable<ResponseSetBreakerMode> {
    return this.repository.makeRequest(this.setBreakerModeRequest(payload));
  }

  setBreakerModeRequest(payload: RequestSetBreakerMode): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandSetBreakerMode}`, payload);
  }
}
