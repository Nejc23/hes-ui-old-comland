export interface IActionRequestParams {
  pageSize: number;
  pageNumber: number;
  includedIds?: string[];
  sort: IActionSortParams[];
  textSearch: IActionSearchParam;
  filter?: IActionFilterParams[];
  deviceIds?: string[];
  excludeIds?: string[];
  concentratorIds?: string[];
  registerTypes?: IRegisterTypesEnum[];
  initiateReading?: boolean;
  from?: string;
  to?: string;
  groups?: any[]; // TODO enum
  unconditionalSync?: string;
  types?: string[];
  states?: string[];
  enabled?: boolean;
}

export interface IActionSearchParam {
  value: string;
  propNames: string[];
  useWildcards: boolean;
}

export interface IActionSortParams {
  index: number;
  propName: string;
  sortOrder: string;
}

export interface IActionFilterParams {
  propName: string;
  propValue: string;
  filterOperation: string;
}

export interface RelayMode {
  relayGroupId: string;
  relayMode: number;
}

export interface IActionResponseParams extends IActionRequestParams {
  requestId: string;
}

// for disconnector mode request
export interface IActionRequestSetDisconnectorMode extends IActionRequestParams {
  breakerMode: number;
}

// for disconnector mode response
export interface IActionResponseSetDisconnectorMode extends IActionResponseParams {
  breakerMode: number;
}

// for TOU request
export interface IActionRequestTOUData extends IActionRequestParams {
  timeOfUseId: string;
}

// for TOU response
export interface IActionResponseTOUData extends IActionResponseParams {
  timeOfUseId: string;
}

// for FW upgrade request
export interface IActionRequestFwUpgradeData extends IActionRequestParams {
  fileId: string;
  imageIdent?: string;
  imageSize?: number;
  signature?: string;
  overrideFillLastBlock?: boolean;
  activate?: boolean;
}

export interface IActionRequestDeleteDevice extends IActionRequestParams {
  includedIds?: string[];
  excludedIds?: string[];
}

// for FW upgrade response
export interface IActionResponseFwUpgradeData extends IActionResponseParams {
  fileId: string;
  imageIdent: string;
  imageSize: number;
  signature: string;
  overrideFillLastBlock: boolean;
}

// for relays actions
export interface IActionRequestRelays extends IActionRequestParams {
  relayIds: string[];
}

export interface IActionRequestRelaysMode extends IActionRequestParams {
  relayMode: RelayMode[];
}

export interface IActionResponseRelays extends IActionResponseParams {
  relayIds: string[];
}

export interface IActionResponseRelaysMode extends IActionResponseParams {
  relayMode: RelayMode[];
}

export interface IActionRequestAddTemplate extends IActionRequestParams {
  templateId: string;
}

export interface IActionResponseAddTemplate extends IActionResponseParams {
  templateId: string;
}

export interface IActionRequestGetCommonRegisterGroups extends IActionRequestParams {
  search: IActionSearchParam;
  type: number;
}

export interface IActionRequestSetDisplaySettings extends IActionRequestParams {
  displayGroupName: string;
  displayRegisters: string[];
}

export interface IActionResponseSetDisplaySettings extends IActionResponseParams {
  displayGroupName: string;
  displayRegisters: string[];
}

export interface IActionRequestEnableHls extends IActionRequestParams {
  includedIds?: string[];
  excludedIds?: string[];
}

export interface IActionResponseEnableHls extends IActionResponseParams {
  includedIds?: string[];
  excludedIds?: string[];
}

export interface IActionResponseDeleteDevice extends IActionResponseParams {
  includedIds?: string[];
  excludedIds?: string[];
}

export interface IActionRequestSecurityRekey extends IActionRequestParams {
  includedIds?: string[];
  excludedIds?: string[];
  keyType?: string;
  keyTypes?: string[];
}

export interface IActionResponseSecurityRekey extends IActionResponseParams {
  includedIds?: string[];
  excludedIds?: string[];
  keyType: string;
}

export interface IActionRequestJobsAssignExisting extends IActionRequestParams {
  includedIds?: string[];
  excludedIds?: string[];
  scheduleJobIds: string[];
}

export interface IActionResponseJobsAssignExisting extends IActionResponseParams {
  includedIds?: string[];
  excludedIds?: string[];
  scheduleJobIds: string[];
}

export interface IActionRequestParamsAlarms extends IActionRequestParams {
  startTime: Date;
  endTime: Date;
}

export interface IActionRequestSecurityChangePassword extends IActionRequestParams {
  includedIds?: string[];
  excludedIds?: string[];
  passwordType: string;
}

export interface IActionResponseSecurityChangePassword extends IActionResponseParams {
  includedIds?: string[];
  excludedIds?: string[];
  passwordType: string;
}

export enum IRegisterTypesEnum {
  limiterNormal = 'LimiterTresholdNormal',
  limiterEmergency = 'LimiterTresholdEmergency',
  monitorPhase1 = 'MonitorPhase1',
  monitorPhase2 = 'MonitorPhase2',
  monitorPhase3 = 'MonitorPhase3'
}
