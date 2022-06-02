export interface GridResponse<T> {
  data: T[];
  totalCount: number;
  summary?: string;
  groupCount?: number;
}
