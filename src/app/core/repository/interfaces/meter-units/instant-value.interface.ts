import { DisconnectorStateEnum } from '../../../../features/meter-units/types/consts/meter-units.consts';

export interface InstantValue {
  registerName: string;
  registerType: number;
  timestamp: string;
  value: string;
  interpretedValue: DisconnectorStateEnum;
  registerId: string;
}
