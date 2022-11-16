import { GridSortParams } from '../../repository/interfaces/helpers/grid-request-params.interface';

export interface GridSettingsSessionStore {
  searchText: string;
  pageIndex: number;
  selectedRows: any[];
  isSelectedAll: boolean;
  excludedRows: any[];
  searchWildcards: boolean;
  sortModel: GridSortParams[];
}
