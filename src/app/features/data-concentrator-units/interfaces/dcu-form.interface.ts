import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface DcuForm {
  id: string;
  name: string;
  serialNumber: string;
  externalId?: string;
  ip: string;
  type: Codelist<number>;
  userName?: string;
  password?: string;
  confirmPassword?: string;
  manufacturer: Codelist<number>;
  tags: Codelist<number>[];
  discoveryJob?: Codelist<string>;
  status?: Codelist<number>;
  port?: string;
  address?: string;
  mac?: string;
  latitude?: number;
  longitude?: number;
  plcStatus?: string;
}

export interface EditDcuForm {
  id: string;
  name: string;
  serialNumber: string;
  externalId?: string;
  ip: string;
  port?: string;
  address?: string;
  mac?: string;
  manufacturer?: Codelist<number>;
  userName?: string;
}
