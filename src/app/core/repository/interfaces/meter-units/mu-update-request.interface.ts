import { MuAdvancedInformation } from './mu-advanced-information.interface';
import { MuHdlcInformation } from './mu-hdlc-information.interface';
import { MuWrapperInformation } from './mu-wrapper-information.interface';
import { ReferenceType } from './reference-type.enum';

export interface MuUpdateRequest {
  name: string;
  manufacturer: number;
  ip: string;
  port: number;
  hdlcInformation?: MuHdlcInformation;
  wrapperInformation?: MuWrapperInformation;
  advancedInformation?: MuAdvancedInformation;

  serialNumber: string;
  templateId: number;
  interfaceType: number;
  driver: number;
  referencingType: ReferenceType;
  externalId?: string;
}

export interface MuUpdatePlcRequest {
  deviceId?: string;
  name: string;
  externalId?: string;
  templateId?: number;
}
