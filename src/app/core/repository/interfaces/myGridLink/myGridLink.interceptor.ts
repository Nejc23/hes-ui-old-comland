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
export interface RequestConnectDisconnectData {
  deviceIds: string[];
  filter?: GridFilterParams;
}

export interface ResponseConnectDisconnectData {
  requestId: string;
  deviceIds: string[];
  filter?: GridFilterParams;
}

// TOU
export interface RequestTOUData {
  timeOfUseId: string;
  deviceIds: string[];
  filter?: GridFilterParams;
}

export interface ResponseTOUData {
  timeOfUseId: string;
  requestId: string;
  deviceIds: string[];
  filter?: GridFilterParams;
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

// Set Monitor bulk action
export interface RequestSetMonitor {
  deviceIds: string[];
  filter?: GridFilterParams;
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
  monitorObjects: MonitorObjects[];
}
