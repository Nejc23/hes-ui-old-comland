import { UnitCodeListItemClient } from './UnitCodeListItemClient';

export interface SeasonUnitClient {
  date: Date; // date: string;
  // weekId: number; // TODO: ??? UnitCodeList
  week: UnitCodeListItemClient<number>;
}
