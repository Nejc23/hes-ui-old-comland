import { TimeUnitClientType } from 'src/app/enums/tou-configuration/TimeUnitTypeClientEnum';
import { UnitClient } from './UnitClient';

export interface TimeUnitsClient<UnitsExternalIdType, UnitsItemsType> {
  type: TimeUnitClientType;
  units: UnitClient<UnitsExternalIdType, UnitsItemsType>[];
}
