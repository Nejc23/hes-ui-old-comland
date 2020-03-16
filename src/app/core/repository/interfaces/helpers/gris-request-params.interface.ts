/*export interface GridRequestParams {  
  skip: number;
  take: number;
  search: GridSearchParams[];
  sort: GridSortParams[];
  filter: GridFilterParams[];
}*/
export interface GridRequestParams {
  startRow: number;
  endRow: number;
  sortModel?: any[];
  searchModel?: GridSearchParams[];
  filterModel?: any[];
  rowGroupCols?: any[];
  valueCols?: any[];
  pivotCols?: any[];
  pivotMode?: boolean;
  groupKeys?: any[];
}

export interface GridFilterParams {
  selector: string;
  operation: string;
  value: string;
}

export interface GridSortParams {
  selector: string;
  desc: boolean;
}

export interface GridSearchParams {
  selector: string;
  value: string;
}
