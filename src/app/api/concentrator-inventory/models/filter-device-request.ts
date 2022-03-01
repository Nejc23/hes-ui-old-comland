/* tslint:disable */
/* eslint-disable */
import { FilterParam } from './filter-param';
import { SortParam } from './sort-param';
import { TextSearch } from './text-search';
export interface FilterDeviceRequest {
  deviceIds?: null | Array<string>;
  excludedIds?: null | Array<string>;
  filter?: null | Array<FilterParam>;
  includedIds?: null | Array<string>;
  pageNumber?: number;
  pageSize?: number;
  requestId: string;
  sort?: null | Array<SortParam>;
  textSearch?: TextSearch;
}
