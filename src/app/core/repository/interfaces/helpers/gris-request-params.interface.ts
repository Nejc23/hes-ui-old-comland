export interface GridRequestParams {
  requireTotalCount: boolean;
  skip: number;
  take: number;
  search: GridSearchParams[];
  sort: GridSortParams[];
  filter: GridFilterParams[];
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
