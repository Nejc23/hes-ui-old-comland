import { TableFilterOperator } from '../consts/table-filter-operator.const';

export interface TableFilter<T> {
  property: string;
  operator: TableFilterOperator;
  value: T;
}
