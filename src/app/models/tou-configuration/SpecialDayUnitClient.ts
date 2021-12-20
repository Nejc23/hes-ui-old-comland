import { UnitCodeListItemClient } from './UnitCodeListItemClient';

export interface SpecialDayUnitClient {
  id: string;
  startDate: Date;
  year?: number;
  annually: boolean;
  rowIndex?: number;
  dayTextField: string;
  day: UnitCodeListItemClient<number>;
}
