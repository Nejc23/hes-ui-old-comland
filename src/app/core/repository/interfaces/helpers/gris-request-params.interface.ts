import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface GridRequestParams {
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
}

export interface GridFilterParams {
  statuses: Codelist<number>[];
  types: number[];
  tags: Codelist<number>[];
  vendor: Codelist<number>;
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
