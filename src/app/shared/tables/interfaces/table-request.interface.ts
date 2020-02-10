import { TableSort } from './table-sort.interface';
import { TableFilter } from './table-filter.interface';
import { TablePage } from './table-page.interface';

export interface TableRequest {
  pageSettings: TablePage;
  sort: TableSort;
  filters: Array<TableFilter<string | boolean | number>>;
}
