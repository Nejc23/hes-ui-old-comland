export interface DataConcentratorUnit {
  concentratorId: string;
  statusValue: 'INACTIVE' | 'UNKNOWN' | 'MOUNTED' | 'ACTIVE';
  statusId: number;
  name: string;
  typeValue: string;
  typeId: number;
  manufacturerValue: string;
  manufacturerId?: number;
  serialNumber: string;
  externalId?: string;
  ip: string;
  tags: string;
  address: string;
  port: string;
  mac: string;
  username: string;
  password: string;
  latitude?: number;
  longitude?: number;
}
