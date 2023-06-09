import { MuAdvancedInformation } from './mu-advanced-information.interface';
import { MuHdlcInformation } from './mu-hdlc-information.interface';
import { MuWrapperInformation } from './mu-wrapper-information.interface';
import { ReferenceType } from './reference-type.enum';

export interface MeterUnitDetails {
  deviceId: string;
  serialNumber: string;
  name: string;
  templateName: string;
  templateId?: string;
  templateActiveFrom: Date;
  driver: string;
  protocolType: string;
  manufacturer: string;
  hostname: string;
  port: number;
  deviceState: DeviceState;
  stateId: number;
  hdlcInformation?: MuHdlcInformation;
  wrapperInformation?: MuWrapperInformation;
  advancedInformation: MuAdvancedInformation;
  referencingType: ReferenceType;
  externalId?: string;
  firstInstallDate: Date;
  stateChanged?: Date;
  stateChangedBy?: string;
  lastCommunication?: string;
  medium: string;
  applicationFirmwareVersion?: string;
  metrologyFirmwareVersion?: string;
  moduleFirmwareVersion?: string;
}

export enum DeviceState {
  OPERATIONAL = 'operational',
  INSTALLING = 'installing',
  DISABLED = 'disabled',
  REKEYING = 'rekeying',
  DRAFT = 'draft', // for TOU
  EDIT = 'edit' // for TOU
}
