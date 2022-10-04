/* tslint:disable */
/* eslint-disable */
import { FilterParam } from './filter-param';
import { SortParam } from './sort-param';
import { TextSearch } from './text-search';
export interface GetJobListSearchRequest {
  excludedIds?: null | Array<string>;
  filter?: null | Array<FilterParam>;
  includedIds?: null | Array<string>;
  pageNumber?: number;
  pageSize?: number;
  sort?: null | Array<SortParam>;
  textSearch?: TextSearch;
}
