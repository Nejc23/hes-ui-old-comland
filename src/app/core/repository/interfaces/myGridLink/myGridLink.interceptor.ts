import { GridSearchParams } from './../helpers/grid-request-params.interface';
import { GridFilterParams } from '../helpers/grid-request-params.interface';

export interface IdentityToken {
  AccessToken: string;
  ExpiresIn: number;
  TokenType: string;
}

export interface LastStatus {
  requestId: string;
  timestamp: string;
  status: string;
  isFinished: boolean;
  id: string;
  description: string;
}

// connect/disconnect
export interface RequestFilterParams {
  deviceIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
}

export interface ResponseConnectDisconnectData {
  requestId: string;
  deviceIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
}

// TOU
export interface RequestTOUData {
  timeOfUseId: string;
  deviceIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
}

export interface ResponseTOUData {
  timeOfUseId: string;
  requestId: string;
  deviceIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
}

export interface OnDemandRequestData {
  deviceId: string;
  data: [
    {
      objectType: string;
      value: string;
    }
  ];
}

// Set Monitor list of names from register definition
export interface RequestCommonRegisterGroup {
  deviceIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
  type: string;
}
export interface ResponseCommonRegisterGroup {
  registerGroupId: string;
  name: string;
  type: string;
  registerDefinitions: RegisterDefinitions[];
}
export interface RegisterDefinitions {
  registerDefinitionId: string;
  name: string;
  obisCode: string;
  classId: number;
  attributeId: number;
  type: string;
  dataType: string;
  iecCode: string;
}

// Set Monitor bulk action
export interface RequestSetMonitor {
  deviceIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
  monitorObjects: MonitorObjects[];
}
export interface MonitorObjects {
  name: string;
  threshold: number;
}

export interface ResponseSetMonitor {
  requestId: string;
  deviceIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
  monitorObjects: MonitorObjects[];
}

// get registers
export interface RequestLimiterGetRegisters {
  deviceIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
  groupType: number;
}
/*export interface ResponseLimiterGetRegisters {
  registerId: string;
  name: string;
}*/

// set limiter

export interface RequestSetLimiter {
  deviceIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
  limiterDefinitions: LimiterDefinitions;
}
export interface LimiterDefinitions {
  thresholdNormal: number;
  thresholdEmergency: number;
  minOverThresholdDuration: number;
  minUnderThresholdDuration: number;
  registerGroupId: string;
}

export interface ResponseSetLimiter {
  requestId: string;
  deviceIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
  limiterDefinitions: LimiterDefinitions;
}

// set breaker mode
export interface RequestSetBreakerMode {
  deviceIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
  breakerMode: number;
}

export interface ResponseSetBreakerMode {
  requestId: string;
  deviceIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
  breakerMode: number;
}

// clear FF
export interface ResponseClearFF {
  requestId: string;
  deviceIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
}
