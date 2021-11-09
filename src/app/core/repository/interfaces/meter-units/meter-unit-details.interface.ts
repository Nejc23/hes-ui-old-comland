import { MuAdvancedInformation } from './mu-advanced-information.interface';
import { MuHdlcInformation } from './mu-hdlc-information.interface';
import { MuWrapperInformation } from './mu-wrapper-information.interface';
import { ReferenceType } from './reference-type.enum';

export interface MeterUnitDetails {
  deviceId: string;
  serialNumber: string;
  name: string;
  templateName: string;
  driver: string;
  protocolType: string;
  manufacturer: string;
  ip: string;
  port: number;
  deviceState: DeviceState;
  stateId: number;
  hdlcInformation?: MuHdlcInformation;
  wrapperInformation?: MuWrapperInformation;
  advancedInformation: MuAdvancedInformation;
  referencingType: ReferenceType;
  externalId?: string;
}

export enum DeviceState {
  OPERATIONAL = 'operational',
  INSTALLING = 'installing',
  DISABLED = 'disabled'
}
