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
<<<<<<< HEAD
  deviceStatus: string;
=======
  deviceState: DeviceState;
  stateId: number;
>>>>>>> develop
  hdlcInformation?: MuHdlcInformation;
  wrapperInformation?: MuWrapperInformation;
  advancedInformation: MuAdvancedInformation;
  referencingType: ReferenceType;
  externalId?: string;
<<<<<<< HEAD
=======
}

export enum DeviceState {
  OPERATIONAL = 'operational',
  INSTALLING = 'installing',
  DISABLED = 'disabled',
  DRAFT = 'draft' // for TOU
>>>>>>> develop
}
