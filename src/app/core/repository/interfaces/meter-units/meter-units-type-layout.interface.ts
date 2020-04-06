import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface MeterUnitsTypeLayout {
  id: number;
  name: string;
  vendorFilter: Codelist<number>;
  statusesFilter: Codelist<number>[];
  typesFilter: number[];
  tagsFilter: Codelist<number>[];
  firmwareFilter: Codelist<number>[];
  breakerStateFilter: Codelist<number>[];
  gridLayout: string;
}
