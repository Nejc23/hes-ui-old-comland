export interface DataConcentratorUnit {
  concentratorId: string;
  hostname: string;
  statusValue: 'INACTIVE' | 'UNKNOWN' | 'MOUNTED' | 'ACTIVE';
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
  plcStatus?: ConcentratorStatus;
  firstInstallDate?: string;
  timeZoneName?: string;
}

export enum ConcentratorStatus {
  UNKNOWN = 'unknown',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MOUNTED = 'mounted',
  DELETED = 'deleted'
}
