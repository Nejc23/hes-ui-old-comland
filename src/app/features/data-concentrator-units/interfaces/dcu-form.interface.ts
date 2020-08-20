import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface DcuForm {
  id: string;
  name: string;
  idNumber: string;
  ip: string;
  type: Codelist<number>;
  userName?: string;
  password?: string;
  confirmPassword?: string;
  vendor: Codelist<number>;
  tags: Codelist<number>[];
  discoveryJob?: Codelist<string>;
}
