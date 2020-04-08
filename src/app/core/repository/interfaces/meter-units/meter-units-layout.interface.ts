import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface MeterUnitsLayout {
  id: number;
  name: string;
  vendorFilter: Codelist<number>;
  statusesFilter: Codelist<number>[];
  readStatusFilter: MeterUnitsReadStatusLayout;
  typesFilter: number[];
  tagsFilter: Codelist<number>[];
  firmwareFilter: Codelist<number>[];
  breakerStateFilter: Codelist<number>[];
  gridLayout: string;
  showOnlyMeterUnitsWithMBusInfoFilter: boolean;
  showDeletedMeterUnitsFilter: boolean;
}
export interface MeterUnitsReadStatusLayout {
  operation: Codelist<string>;
  value1: number;
  value2?: number;
}
