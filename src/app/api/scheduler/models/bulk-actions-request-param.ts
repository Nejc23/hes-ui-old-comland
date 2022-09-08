/* tslint:disable */
/* eslint-disable */
import { IFilterModel } from './i-filter-model';
import { ISearchModel } from './i-search-model';
export interface BulkActionsRequestParam {
  excludeIds?: null | Array<string>;
  filter?: IFilterModel;
  id?: null | Array<string>;
  search?: null | Array<ISearchModel>;
  tryFillDevices?: boolean;
}
