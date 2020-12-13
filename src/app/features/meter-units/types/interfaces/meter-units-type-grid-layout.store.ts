import { Codelist } from './../../../../shared/repository/interfaces/codelists/codelist.interface';
import { GridSortParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';
import { MeterUnitsLayout } from 'src/app/core/repository/interfaces/meter-units/meter-units-layout.interface';

export interface MeterUnitsTypeGridLayoutStore {
  currentPageIndex: number;
  meterUnitsLayout?: MeterUnitsLayout;
  sortModel?: GridSortParams[];
  searchText: string;
  visibleColumns: string[];
  pageSize: Codelist<number>;
  searchWildcards: boolean;
  hideFilter: boolean;
}
