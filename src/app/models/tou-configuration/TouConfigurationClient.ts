import { DayUnitClient } from './DayUnitClient';
import { SeasonUnitClient } from './SeasonUnitClient';
import { SpecialDayUnitClient } from './SpecialDayUnitClient';
import { TimeUnitsClient } from './TimeUnitsClient';
import { TouBasicConfigurationClient } from './TouBasicConfigurationClient';
import { WeekUnitClient } from './WeekUnitClient';

export interface TouConfigurationClient {
  valid?: boolean;
  basic: TouBasicConfigurationClient;
  days?: TimeUnitsClient<number, DayUnitClient>;
  weeks?: TimeUnitsClient<number, WeekUnitClient>;
  seasons?: TimeUnitsClient<number, SeasonUnitClient>;
  specialDays?: SpecialDayUnitClient[];
}
