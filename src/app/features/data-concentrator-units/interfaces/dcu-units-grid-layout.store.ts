import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { GridSortParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface DcuUnitsGridLayoutStore {
  currentPageIndex: number;
  dcuLayout?: DcuLayout;
  sortModel?: GridSortParams[];
  searchText: string;
  searchWildcards: boolean;
  visibleColumns: string[];
  pageSize: Codelist<number>;
}
