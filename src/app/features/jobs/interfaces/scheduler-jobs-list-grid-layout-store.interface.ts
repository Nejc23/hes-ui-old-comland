import { Codelist } from './../../../shared/repository/interfaces/codelists/codelist.interface';
import { GridSortParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';

export interface SchedulerJobsListGridLayoutStore {
  currentPageIndex: number;
  sortModel?: GridSortParams[];
  searchText: string;
  pageSize: Codelist<number>;
  searchWildcards: boolean;
}
