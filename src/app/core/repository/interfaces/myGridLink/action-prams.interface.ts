export interface IActionRequestParams {
  pageSize: number;
  pageNumber: number;
  sort: IActionSortParams[];
  textSearch: string;
  filter?: IActionFilterParams[];
  deviceIds?: string[];
  excludeIds?: string[];
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

export interface RelayObject {
  name: string;
  mode: number;
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
  RelaysObjects: string[];
}

export interface IActionRequestRelaysMode extends IActionRequestParams {
  RelaysObjects: RelayObject[];
}

export interface IActionResponseRelays extends IActionResponseParams {
  RelaysObjects: string[];
}

export interface IActionResponseRelaysMode extends IActionResponseParams {
  RelaysObjects: RelayObject[];
}
