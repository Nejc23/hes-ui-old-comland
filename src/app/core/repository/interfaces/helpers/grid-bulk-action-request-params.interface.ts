import { GridFilterParams } from './gris-request-params.interface';

export interface GridBulkActionRequestParams {
  id: string[];
  filter: GridFilterParams;
}
