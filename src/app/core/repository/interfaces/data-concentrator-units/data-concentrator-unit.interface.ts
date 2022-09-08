import { DeviceState } from '../meter-units/meter-unit-details.interface';

export interface DataConcentratorUnit {
  concentratorId: string;
  hostname: string;
  stateValue: DeviceState;
  statusId: number;
  name: string;
  typeValue: string;
  typeId: number;
  manufacturerValue: string;
  manufacturerId?: number;
  serialNumber: string;
  externalId?: string;
  tags: string;
  address: string;
  mac: string;
  username: string;
  password: string;
  latitude?: number;
  longitude?: number;
  firmwareApp: string;
  firmwareBase: string;
  plcStatus?: ConcentratorStatus;
  firstInstallDate?: string;
  timeZoneName?: string;
  lastCommunication?: string;
}

export enum ConcentratorStatus {
  UNKNOWN = 'unknown',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MOUNTED = 'mounted',
  DELETED = 'deleted'
}
