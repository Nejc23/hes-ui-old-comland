import { meterUnits } from './../../consts/meter-units.const';
import {
  IActionRequestAddTemplate,
  IActionRequestEnableHls,
  IActionRequestDeleteDevice,
  IActionRequestRelays,
  IActionRequestRelaysMode,
  IActionRequestSetDisplaySettings,
  IActionResponseAddTemplate,
  IActionResponseEnableHls,
  IActionResponseDeleteDevice,
  IActionResponseRelays,
  IActionResponseRelaysMode,
  IActionResponseSetDisplaySettings,
  IActionRequestSecurityRekey,
  IActionResponseSecurityRekey,
  IActionRequestJobsAssignExisting,
  IActionResponseJobsAssignExisting,
  IActionRequestSecurityChangePassword,
  IActionResponseSecurityChangePassword
} from './../../interfaces/myGridLink/action-prams.interface';
import {
  onDemandCiiState,
  onDemandCiiActivate,
  onDemandCiiDeactivate,
  onDemandRelaysState,
  onDemandRelaysMode,
  onDemandRelaysDisconnect,
  onDemandRelaysConnect,
  linkDeviceTemplate,
  upgrade,
  securitySetup,
  securityEnableHls,
  securityRekey,
  jobsAssignExisting,
  securityChangePassword
} from './../../consts/my-grid-link.const';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import {
  IdentityToken,
  LastStatus,
  OnDemandRequestData,
  RequestSetMonitor,
  RequestSetLimiter,
  ResponseSetMonitor,
  ResponseSetLimiter,
  RequestFilterParams,
  ResponseClearFF,
  RequestCommonRegisterGroup
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
  onDemandSetLimiter,
  onDemandSetBreakerMode,
  onDemandClearFF,
  getCommonRegisterGroups
} from '../../consts/my-grid-link.const';
import {
  IActionRequestFwUpgradeData,
  IActionRequestParams,
  IActionRequestSetDisconnectorMode,
  IActionRequestTOUData,
  IActionResponseFwUpgradeData,
  IActionResponseParams,
  IActionResponseSetDisconnectorMode,
  IActionResponseTOUData
} from '../../interfaces/myGridLink/action-prams.interface';
import { onDemandClearAlarms, triggerSetDisplaySettings } from '../../consts/meter-units.const';
import { SecurityClient } from '../../interfaces/templating/security-client.interface';

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
  postMyGridConnectDevice(params: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.postMyGridConnectDeviceRequest(params));
  }

  postMyGridConnectDeviceRequest(params: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandConnect}`, params);
  }

  // disconnect device
  postMyGridDisconnectDevice(params: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.postMyGridDisconnectDeviceRequest(params));
  }

  postMyGridDisconnectDeviceRequest(params: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandDisconnect}`, params);
  }

  // get cii status device
  getCiiState(params: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.getCiiStateRequest(params));
  }

  getCiiStateRequest(params: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandCiiState}`, params);
  }

  // cii activate device
  postMyGridCiiActivateDevice(params: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.postMyGridCiiActivateDeviceRequest(params));
  }

  postMyGridCiiActivateDeviceRequest(params: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandCiiActivate}`, params);
  }

  // cii deactivate device
  postMyGridCiiDeactivateDevice(params: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.postMyGridCiiDeactivateDeviceRequest(params));
  }

  postMyGridCiiDeactivateDeviceRequest(params: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandCiiDeactivate}`, params);
  }

  // trigger TOU
  postMyGridTOUDevice(params: IActionRequestTOUData): Observable<IActionResponseTOUData> {
    return this.repository.makeRequest(this.postMyGridTOUDeviceRequest(params));
  }

  postMyGridTOUDeviceRequest(params: IActionRequestTOUData): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${triggerSetTimeOfUse}`, params);
  }

  // get disconnector state
  getDisconnectorState(params: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.getDisconnectorStateRequest(params));
  }

  getDisconnectorStateRequest(params: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandDisconnectorState}`, params);
  }

  // trigger set disconnector mode
  setDisconnectorMode(payload: IActionRequestSetDisconnectorMode): Observable<IActionResponseSetDisconnectorMode> {
    return this.repository.makeRequest(this.setDisconnectorModeRequest(payload));
  }

  setDisconnectorModeRequest(payload: IActionRequestSetDisconnectorMode): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandSetBreakerMode}`, payload);
  }

  // get data returned on-demand requests
  getOnDemandDataProcessing(requestId: string): Observable<OnDemandRequestData[]> {
    return this.repository.makeRequest(this.getOnDemandDataProcessingRequest(requestId));
  }

  getOnDemandDataProcessingRequest(requestId: string): HttpRequest<OnDemandRequestData[]> {
    return new HttpRequest('GET', `${enumMyGridLink.dataProcessing}/${requestId}${onDemandData}`);
  }

  // trigger templte import
  postMyGridTemplatesImport(params: string): Observable<any> {
    return this.repository.makeRequest(this.postMyGridTemplatesImportRequest(params));
  }

  postMyGridTemplatesImportRequest(params: string): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.templating}${importTemplates}`, params);
  }

  // trigger upload FW upgrade
  createFwUpgrade(payload: IActionRequestFwUpgradeData): Observable<IActionResponseFwUpgradeData> {
    return this.repository.makeRequest(this.createFwUpgradeRequest(payload));
  }

  createFwUpgradeRequest(payload: IActionRequestFwUpgradeData): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${triggerDeviceUpgrade}`, payload);
  }

  // trigger activate FW upgrade
  activateDeviceUpgrade(param: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.activateDeviceUpgradeRequest(param));
  }

  activateDeviceUpgradeRequest(param: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${triggerDeviceUpgradeActivate}`, param);
  }

  // get common register group
  // getCommonRegisterGroup(payload: RequestCommonRegisterGroup): Observable<ResponseCommonRegisterGroup[]> {
  getCommonRegisterGroup(payload: RequestCommonRegisterGroup): Observable<any[]> {
    return this.repository.makeRequest(this.getCommonRegisterGroupRequest(payload));
  }

  getCommonRegisterGroupRequest(payload: RequestCommonRegisterGroup): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.templating}${getCommonRegisterGroups}`, payload);
  }

  // trigger set montor
  setMonitor(payload: RequestSetMonitor): Observable<ResponseSetMonitor> {
    return this.repository.makeRequest(this.setMonitorRequest(payload));
  }

  setMonitorRequest(payload: RequestSetMonitor): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandSetMonitor}`, payload);
  }

  // trigger set limiter
  setLimiter(payload: RequestSetLimiter): Observable<ResponseSetLimiter> {
    return this.repository.makeRequest(this.setLimiterRequest(payload));
  }

  setLimiterRequest(payload: RequestSetLimiter): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandSetLimiter}`, payload);
  }

  // trigger set breaker mode
  clearFF(param: RequestFilterParams): Observable<ResponseClearFF> {
    return this.repository.makeRequest(this.clearFFRequest(param));
  }

  clearFFRequest(param: RequestFilterParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandClearFF}`, param);
  }

  // relays connect
  postRelaysConnectDevice(params: IActionRequestRelays): Observable<IActionResponseRelays> {
    return this.repository.makeRequest(this.postRelaysConnectDeviceRequest(params));
  }

  postRelaysConnectDeviceRequest(params: IActionRequestRelays): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandRelaysConnect}`, params);
  }

  // relays disconnect
  postRelaysDisconnectDevice(params: IActionRequestRelays): Observable<IActionResponseRelays> {
    return this.repository.makeRequest(this.postRelaysDisconnectDeviceRequest(params));
  }

  postRelaysDisconnectDeviceRequest(params: IActionRequestRelays): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandRelaysDisconnect}`, params);
  }

  // relays state
  getRelaysState(params: IActionRequestRelays): Observable<IActionResponseRelays> {
    return this.repository.makeRequest(this.getRelaysStateRequest(params));
  }

  getRelaysStateRequest(params: IActionRequestRelays): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandRelaysState}`, params);
  }

  // relays mode
  setRelaysMode(payload: IActionRequestRelaysMode): Observable<IActionResponseRelaysMode> {
    return this.repository.makeRequest(this.setRelaysModeRequest(payload));
  }

  setRelaysModeRequest(payload: IActionRequestRelaysMode): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandRelaysMode}`, payload);
  }

  // trigger templte import
  postMyGridAddDeviceTemplate(params: IActionRequestAddTemplate): Observable<IActionResponseAddTemplate> {
    return this.repository.makeRequest(this.postMyGridAddDeviceTemplateRequest(params));
  }

  postMyGridAddDeviceTemplateRequest(params: IActionRequestAddTemplate): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.templating}${linkDeviceTemplate}`, params);
  }

  setDisplaySettings(request: IActionRequestSetDisplaySettings): Observable<IActionResponseSetDisplaySettings> {
    return this.repository.makeRequest(this.setDisplaySettingsRequest(request));
  }

  setDisplaySettingsRequest(request: IActionRequestSetDisplaySettings): HttpRequest<any> {
    return new HttpRequest('POST', `${triggerSetDisplaySettings}`, request);
  }

  clearAlarms(param: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.clearAlarmsRequest(param));
  }

  clearAlarmsRequest(param: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandClearAlarms}`, param);
  }

  // security
  getSecurityClients(): Observable<SecurityClient[]> {
    return this.repository.makeRequest(this.getSecurityClientsRequest());
  }

  getSecurityClientsRequest(): HttpRequest<any> {
    return new HttpRequest('GET', `${securitySetup}`);
  }

  postSecurityEnableHls(param: IActionRequestEnableHls): Observable<IActionResponseEnableHls> {
    return this.repository.makeRequest(this.postSecurityEnableHlsRequest(param));
  }

  postSecurityEnableHlsRequest(param: IActionRequestEnableHls): HttpRequest<any> {
    return new HttpRequest('POST', `${securityEnableHls}`, param);
  }

  deleteDevice(param: IActionRequestDeleteDevice): Observable<IActionResponseDeleteDevice> {
    return this.repository.makeRequest(this.deleteDeviceRequest(param));
  }

  deleteDeviceRequest(param: IActionRequestDeleteDevice): HttpRequest<any> {
    return new HttpRequest('PATCH', `${meterUnits}`, param);
  }

  postSecurityRekey(param: IActionRequestSecurityRekey): Observable<IActionResponseSecurityRekey> {
    return this.repository.makeRequest(this.postSecurityRekeyRequest(param));
  }

  postSecurityRekeyRequest(param: IActionRequestSecurityRekey): HttpRequest<any> {
    return new HttpRequest('POST', `${securityRekey}`, param);
  }

  postJobsAssignExisting(param: IActionRequestJobsAssignExisting): Observable<IActionResponseJobsAssignExisting> {
    return this.repository.makeRequest(this.postJobsAssignExistingRequest(param));
  }

  postJobsAssignExistingRequest(param: IActionRequestJobsAssignExisting): HttpRequest<any> {
    return new HttpRequest('POST', `${jobsAssignExisting}`, param);
  }

  postSecurityChangePassword(param: IActionRequestSecurityChangePassword): Observable<IActionResponseSecurityChangePassword> {
    return this.repository.makeRequest(this.postSecurityChangePasswordRequest(param));
  }

  postSecurityChangePasswordRequest(param: IActionRequestSecurityChangePassword): HttpRequest<any> {
    return new HttpRequest('POST', `${securityChangePassword}`, param);
  }
}
