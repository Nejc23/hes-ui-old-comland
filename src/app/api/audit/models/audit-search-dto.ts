/* tslint:disable */
/* eslint-disable */
import { AuditEvent } from './audit-event';
import { FilterParam } from './filter-param';
import { SortParam } from './sort-param';
import { TextSearch } from './text-search';
export interface AuditSearchDto {
  endTime?: string;
  events?: null | Array<AuditEvent>;
  excludedIds?: null | Array<string>;
  filter?: null | Array<FilterParam>;
  includedIds?: null | Array<string>;
  pageNumber?: number;
  pageSize?: number;
  sort?: null | Array<SortParam>;
  startTime?: string;
  textSearch?: TextSearch;
}
