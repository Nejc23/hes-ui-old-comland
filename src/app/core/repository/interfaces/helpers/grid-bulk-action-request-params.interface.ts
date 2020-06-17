import { GridFilterParams, GridSearchParams } from './gris-request-params.interface';

export interface GridBulkActionRequestParams {
  id: string[];
  search?: GridSearchParams[];
  filter?: GridFilterParams;
}
