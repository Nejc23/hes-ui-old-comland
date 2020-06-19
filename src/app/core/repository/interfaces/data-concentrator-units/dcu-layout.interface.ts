import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { ReadStatus } from '../helpers/grid-request-params.interface';

export interface DcuLayout {
  id: number;
  name: string;
  vendorFilter: Codelist<number>;
  statusesFilter: Codelist<number>[];
  readStatusFilter: ReadStatus;
  typesFilter: number[];
  tagsFilter: Codelist<number>[];
  showDeletedFilter: boolean;
  gridLayout: string;
}
