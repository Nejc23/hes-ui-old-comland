export interface TableQueryResponse<T> {
  offset: number;
  recordCount: number;
  pageSize: number;
  results: Array<T>;
}
