import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface MeterUnitsTypeForm {
  id: number;
  name: string;
  idNumber: string;
  ip: string;
  type: number;
  vendor: number;
  tags: Codelist<number>[];
}
