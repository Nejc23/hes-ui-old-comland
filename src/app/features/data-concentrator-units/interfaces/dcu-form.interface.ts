import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface DcuForm {
  id: string;
  hostname?: string;
  name: string;
  serialNumber: string;
  externalId?: string;
  type: Codelist<number>;
  userName?: string;
  password?: string;
  confirmPassword?: string;
  manufacturer: Codelist<number>;
  tags: Codelist<number>[];
  discoveryJob?: Codelist<string>;
  status?: Codelist<number>;
  address?: string;
  mac?: string;
  latitude?: number;
  longitude?: number;
  firmwareApp: string;
  firmwareBase: string;
  plcStatus?: string;
  timeZoneName?: string;
  firstInstallDate?: string;
}

export interface EditDcuForm {
  id: string;
  name: string;
  serialNumber: string;
  externalId?: string;
  hostname?: string;
  address?: string;
  mac?: string;
  manufacturer?: Codelist<number>;
  userName?: string;
}
