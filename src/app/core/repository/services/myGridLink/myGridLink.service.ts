import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { deleteMeters, deleteMetersData, onDemandClearAlarms, triggerSetDisplaySettings } from '../../consts/meter-units.const';
import {
  activateTriggerDeviceUpgrade as triggerDeviceUpgradeActivate,
  activeImports,
  deleteModuleConfigurationChannelSpecific,
  enumMyGridLink,
  getCommonRegisterGroups,
  getDataExportJobs,
  getModuleConfigurationChannelSpecific,
  getModuleConfigurationCommon,
  identityToken,
  importDevices,
  importModuleConfigurationSpecific,
  importTemplates,
  lastStatus,
  meterParamExecute,
  meterParamParse,
  onDemandClearFF,
  onDemandConnect,
  onDemandData,
  onDemandDisconnect,
  onDemandDisconnectorState,
  onDemandSetBreakerMode,
  onDemandSetLimiter,
  onDemandSetMonitor,
  readShortNames,
  securityConcentratorRekey,
  triggerConcUpgrade,
  triggerDataExport,
  triggerDeviceUpgrade,
  triggerSetTimeOfUse,
  updateMeterState,
  updateModuleConfigurationCommon
} from '../../consts/my-grid-link.const';
import {
  IActionRequestFwUpgradeData,
  IActionRequestParams,
  IActionRequestSetDisconnectorMode,
  IActionRequestTOUData,
  IActionResponseFwUpgradeData,
  IActionResponseParams,
  IActionResponseSetDisconnectorMode,
  IActionResponseTOUData,
  MeterParametrizationRequest,
  MeterParametrizationResponse,
  ModuleConfigurationCommon
} from '../../interfaces/myGridLink/action-prams.interface';
import {
  IdentityToken,
  LastStatus,
  OnDemandRequestData,
  RequestCommonRegisterGroup,
  RequestFilterParams,
  RequestSetLimiter,
  RequestSetMonitor,
  ResponseClearFF,
  ResponseSetLimiter,
  ResponseSetMonitor
} from '../../interfaces/myGridLink/myGridLink.interceptor';
import { SecurityClient } from '../../interfaces/templating/security-client.interface';
import { onDemandReadMeter, onDemandRegistersType } from './../../consts/meter-units.const';
import {
  jobsAssignExisting,
  linkDeviceTemplate,
  onDemandCiiActivate,
  onDemandCiiDeactivate,
  onDemandCiiState,
  onDemandRelaysConnect,
  onDemandRelaysDisconnect,
  onDemandRelaysMode,
  onDemandRelaysState,
  onDemandTimeSyc,
  securityChangePassword,
  securityEnableHls,
  securityRekey,
  securitySetup
} from './../../consts/my-grid-link.const';
import {
  IActionRequestAddTemplate,
  IActionRequestDeleteDevice,
  IActionRequestEnableHls,
  IActionRequestJobsAssignExisting,
  IActionRequestRelays,
  IActionRequestRelaysMode,
  IActionRequestSecurityChangePassword,
  IActionRequestSecurityRekey,
  IActionRequestSetDisplaySettings,
  IActionResponseAddTemplate,
  IActionResponseDeleteDevice,
  IActionResponseEnableHls,
  IActionResponseJobsAssignExisting,
  IActionResponseRelays,
  IActionResponseRelaysMode,
  IActionResponseSecurityChangePassword,
  IActionResponseSecurityRekey,
  IActionResponseSetDisplaySettings
} from './../../interfaces/myGridLink/action-prams.interface';
import { basePathConcentratorInventory, securityInitalRekey } from '../../consts/data-concentrator-units.const';
import { DataExportJobs } from './data-export-jobs.interface';
import { ExportDataPayload } from '../../../../features/meter-units/common/components/export-data/export-data.component';

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

  // trigger upload conc FW upgrade
  createConcFwUpgrade(payload: IActionRequestFwUpgradeData): Observable<IActionResponseFwUpgradeData> {
    return this.repository.makeRequest(this.createConcFwUpgradeRequest(payload));
  }

  createConcFwUpgradeRequest(payload: IActionRequestFwUpgradeData): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${triggerConcUpgrade}`, payload);
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

  deleteDeviceData(param: IActionRequestDeleteDevice): Observable<IActionResponseDeleteDevice> {
    return this.repository.makeRequest(this.deleteDeviceDataRequest(param));
  }

  deleteDeviceRequest(param: IActionRequestDeleteDevice): HttpRequest<any> {
    return new HttpRequest('POST', `${deleteMeters}`, param);
  }

  deleteDeviceDataRequest(param: IActionRequestDeleteDevice): HttpRequest<any> {
    return new HttpRequest('POST', `${deleteMetersData}`, param);
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

  readThresholdValues(param: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.readThresholdValuesRequest(param));
  }

  readThresholdValuesRequest(param: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandRegistersType}`, param);
  }

  readMeterValues(param: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.readMeterValuesRequest(param));
  }

  readMeterValuesRequest(param: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandReadMeter}`, param);
  }

  // synchronize time
  synchronizeTime(params: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.synchronizeRequest(params));
  }

  synchronizeRequest(params: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${onDemandTimeSyc}`, params);
  }

  postSecurityConcentratorRekey(param: IActionRequestSecurityRekey): Observable<IActionResponseSecurityRekey> {
    return this.repository.makeRequest(this.postSecurityConcentratorRekeyRequest(param));
  }

  postSecurityConcentratorRekeyRequest(param: IActionRequestSecurityRekey): HttpRequest<any> {
    return new HttpRequest('POST', `${securityConcentratorRekey}`, param);
  }

  postUpdateMeterState(params: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.postUpdateMeterStateRequest(params));
  }

  postUpdateMeterStateRequest(params: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${basePathConcentratorInventory}${updateMeterState}`, params);
  }

  postImportDevices(params: string): Observable<any> {
    return this.repository.makeRequest(this.postImportDevicesRequest(params));
  }

  postImportDevicesRequest(params: string): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.inventory}${importDevices}`, params);
  }

  getActiveImports(): Observable<any> {
    return this.repository.makeRequest(this.getActiveImportsRequest());
  }

  getActiveImportsRequest(): HttpRequest<any> {
    return new HttpRequest('GET', `${enumMyGridLink.managment}${activeImports}`);
  }

  getDataExportJobs(isExport = true): Observable<DataExportJobs[]> {
    return this.repository.makeRequest(this.getDataExportJobsRequest(isExport));
  }

  getDataExportJobsRequest(isExport: boolean): HttpRequest<any> {
    return new HttpRequest('GET', `${enumMyGridLink.managment}${getDataExportJobs}?isExport=${isExport}`);
  }

  triggerDataExportJob(params: ExportDataPayload): Observable<any> {
    return this.repository.makeRequest(this.triggerDataExportJobRequest(params));
  }

  triggerDataExportJobRequest(params: ExportDataPayload): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${triggerDataExport}`, params);
  }

  updateShortNames(param: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.updateShortNamesRequest(param));
  }

  updateShortNamesRequest(param: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.managment}${readShortNames}`, param);
  }

  postInitailRekey(params: IActionRequestParams): Observable<IActionResponseParams> {
    return this.repository.makeRequest(this.postInitailRekeyRequest(params));
  }

  postInitailRekeyRequest(params: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${securityInitalRekey}`, params);
  }

  postMeterParametrizationParse(body: MeterParametrizationRequest): Observable<MeterParametrizationResponse> {
    return this.repository.makeRequest(this.postMeterParametrizationParseRequest(body));
  }

  postMeterParametrizationParseRequest(param: any): HttpRequest<any> {
    return new HttpRequest('POST', `${meterParamParse}`, param);
  }

  postMeterParametrizationExecute(body: MeterParametrizationRequest): Observable<MeterParametrizationResponse> {
    return this.repository.makeRequest(this.postMeterParametrizationParseExecute(body));
  }

  postMeterParametrizationParseExecute(param: any): HttpRequest<any> {
    return new HttpRequest('POST', `${meterParamExecute}`, param);
  }

  // import-module-configuration-channel-specific
  postImportModuleConfigurationChannelSpecific(params: any): Observable<any> {
    return this.repository.makeRequest(this.postImportModuleConfigurationChannelSpecificRequest(params));
  }

  postImportModuleConfigurationChannelSpecificRequest(params: any): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.templating}${importModuleConfigurationSpecific}`, params);
  }

  // /get-module-configuration-common
  getModuleConfigurationCommon(): Observable<ModuleConfigurationCommon> {
    return this.repository.makeRequest(this.getModuleConfigurationCommonRequest());
  }

  getModuleConfigurationCommonRequest(): HttpRequest<ModuleConfigurationCommon> {
    return new HttpRequest('GET', `${enumMyGridLink.templating}${getModuleConfigurationCommon}`);
  }

  updateModuleConfigurationCommon(params: ModuleConfigurationCommon): Observable<any> {
    return this.repository.makeRequest(this.updateModuleConfigurationCommonRequest(params));
  }

  updateModuleConfigurationCommonRequest(params: ModuleConfigurationCommon): HttpRequest<any> {
    return new HttpRequest('PUT', `${enumMyGridLink.templating}${updateModuleConfigurationCommon}`, params);
  }
  getModuleConfigurationChannelSpecific(): Observable<Array<ModuleConfigurationCommon>> {
    return this.repository.makeRequest(this.getModuleConfigurationChannelSpecificRequest());
  }

  getModuleConfigurationChannelSpecificRequest(): HttpRequest<Array<ModuleConfigurationCommon>> {
    return new HttpRequest('GET', `${enumMyGridLink.templating}${getModuleConfigurationChannelSpecific}`);
  }

  getModuleConfigurationChannelSpecificById(id: string): Observable<Array<ModuleConfigurationCommon>> {
    return this.repository.makeRequest(this.getModuleConfigurationChannelSpecificByIdRequest(id));
  }

  getModuleConfigurationChannelSpecificByIdRequest(id: string): HttpRequest<Array<ModuleConfigurationCommon>> {
    return new HttpRequest('GET', `${enumMyGridLink.templating}${getModuleConfigurationChannelSpecific}/` + id);
  }

  deleteModuleConfigurationChannelSpecific(body: any): Observable<any> {
    return this.repository.makeRequest(this.deleteModuleConfigurationChannelSpecificRequest(body));
  }

  deleteModuleConfigurationChannelSpecificRequest(body: any): HttpRequest<any> {
    return new HttpRequest('POST', `${enumMyGridLink.templating}${deleteModuleConfigurationChannelSpecific}`, body);
  }
}
