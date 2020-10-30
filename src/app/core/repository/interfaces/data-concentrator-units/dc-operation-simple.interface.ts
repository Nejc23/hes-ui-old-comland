import { GridFilterParams, GridSearchParams } from '../helpers/grid-request-params.interface';

export interface RequestFilterParams {
  concentratorIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
}

export interface ResponseData {
  requestId: string;
  concentratorIds: string[];
  filter?: GridFilterParams;
  search?: GridSearchParams[];
  excludeIds?: string[];
}
