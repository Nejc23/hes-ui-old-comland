export interface IActionRequestParams {
  pageSize: number;
  pageNumber: number;
  sort: IActionSortParams[];
  textSearch: IActionSearchParam;
  filter?: IActionFilterParams[];
  deviceIds?: string[];
  excludeIds?: string[];
}

export interface IActionSearchParam {
  value: string;
  propNames: string[];
  enableWildcards: boolean;
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
  imageIdent: string;
  imageSize: number;
  signature: string;
  overrideFillLastBlock: boolean;
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
