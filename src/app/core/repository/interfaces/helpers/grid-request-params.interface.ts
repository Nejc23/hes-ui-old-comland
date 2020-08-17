import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

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
}

export interface GridFilterParams {
  statuses: Codelist<number>[];
  types?: number[];
  tags: Codelist<number>[];
  vendor: Codelist<number>;
  readStatus: ReadStatus;
  firmware?: Codelist<number>[];
  breakerState?: Codelist<number>[];
  showChildInfoMBus?: boolean;
  showDeleted: boolean;
  showWithoutTemplate?: boolean;
  readyForActivation?: boolean;
}

export interface GridSortParams {
  colId: string;
  sort: string;
}

export interface GridSearchParams {
  colId: string;
  type: string;
  value: string;
}

export interface ReadStatus {
  operation: Codelist<string>;
  value1: number;
  value2?: number;
}
