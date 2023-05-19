import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { LastCommunicationFilter } from '../data-concentrator-units/dcu-layout.interface';

export interface GridRequestParams {
  requestId: string;
  startRow: number;
  endRow: number;
  sortModel?: GridSortParams[];
  searchModel?: GridSearchParams[];
  filterModel?: GridFilterParams;
  rowGroupCols?: any[];
  valueCols?: any[];
  pivotCols?: any[];
  pivotMode?: boolean;
  groupKeys?: any[];
  typeId?: number;
  deviceIds?: string[];
  excludeIds?: string[];
}

export interface GridFilterParams {
  states?: Codelist<number>[];
  types?: number[];
  tags?: Codelist<number>[];
  vendors?: Codelist<number>[];
  readStatus?: ReadStatus;
  applicationFirmware?: Codelist<number>[];
  moduleFirmware?: Codelist<number>[];
  metrologyFirmware?: Codelist<number>[];
  disconnectorState?: Codelist<number>[];
  ciiState?: Codelist<number>[];
  showChildInfoMBus?: boolean;
  showWithoutTemplate?: boolean;
  readyForActivation?: boolean;
  showOptionFilter?: Codelist<number>[];
  protocol?: Codelist<number>[];
  medium?: Codelist<number>[];
  sla?: Codelist<number>;
  lastCommunicationFilter?: LastCommunicationFilter;
}

export interface GridSortParams {
  colId: string;
  sort: 'asc' | 'desc';
}

export interface GridSearchParams {
  colId: string;
  type: string;
  value: string;
  useWildcards: boolean;
  valuesFromFile?: string[];
}

export interface ReadStatus {
  operation: Codelist<string>;
  value1: number;
  value2?: number;
}
