import { GridSortParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';

export interface SchedulerJobsListGridLayoutStore {
  currentPageIndex: number;
  sortModel?: GridSortParams[];
  searchText: string;
}
