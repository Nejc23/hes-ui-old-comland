import { UnitCodeListItemClient } from './UnitCodeListItemClient';

export interface WeekUnitClient {
  dayCode: string;
  day: UnitCodeListItemClient<number>;
}
