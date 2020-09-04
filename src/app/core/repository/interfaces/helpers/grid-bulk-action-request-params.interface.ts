import { GridFilterParams, GridSearchParams } from './grid-request-params.interface';

export interface GridBulkActionRequestParams {
  id: string[];
  search?: GridSearchParams[];
  filter?: GridFilterParams;
  excludeIds?: string[];
}
