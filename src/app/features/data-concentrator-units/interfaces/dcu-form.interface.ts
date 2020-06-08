import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface DcuForm {
  id: string;
  name: string;
  idNumber: string;
  ip: string;
  type: Codelist<number>;
  vendor: Codelist<number>;
  tags: Codelist<number>[];
}
