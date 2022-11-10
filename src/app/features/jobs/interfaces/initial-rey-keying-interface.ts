import { Codelist } from '../../../shared/repository/interfaces/codelists/codelist.interface';

export interface InitialReKeying {
  isProtocolActive: boolean;
  protocols: Codelist<number>[];
  isManufacturerActive: boolean;
  manufacturers: Codelist<number>[];
  rekeyAfterDays: number;
}
