import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface DcuFilter {
  id: number;
  name: string;
  vendor: number;
  statuses: Codelist<number>[];
  types: number[];
  tags: Codelist<number>[];
}
