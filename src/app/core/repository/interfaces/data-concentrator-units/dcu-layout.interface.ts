import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { ReadStatus } from '../helpers/grid-request-params.interface';

export interface DcuLayout {
  id: number;
  name: string;
  vendorsFilter: Codelist<number>[];
  statusesFilter: Codelist<number>[];
  readStatusFilter: ReadStatus;
  typesFilter: Codelist<number>[];
  tagsFilter: Codelist<number>[];
  gridLayout: string;
}
