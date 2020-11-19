import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { GridSortParams } from 'src/app/core/repository/interfaces/helpers/grid-request-params.interface';

export interface DcuUnitsGridLayoutStore {
  currentPageIndex: number;

  // vendorsFilter?: Codelist<number>[];
  // statusesFilter?: Codelist<number>[];
  // readStatusFilter?: ReadStatus;
  // typesFilter?: Codelist<number>[];
  // tagsFilter?: Codelist<number>[];
  // gridLayout?: string;
  // requestModel: GridRequestParams;
  dcuLayout?: DcuLayout;
  sortModel?: GridSortParams[];
  searchText: string;
  visibleColumns: string[];
}
