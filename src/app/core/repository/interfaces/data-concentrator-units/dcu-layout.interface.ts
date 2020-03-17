import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface DcuLayout {
  id: number;
  name: string;
  vendorFilter: Codelist<number>;
  statusesFilter: Codelist<number>[];
  typesFilter: number[];
  tagsFilter: Codelist<number>[];
  gridLayout: string;
}
