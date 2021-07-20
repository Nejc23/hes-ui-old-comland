import { MuAdvancedInformation } from './mu-advanced-information.interface';
import { MuHdlcInformation } from './mu-hdlc-information.interface';
import { MuWrapperInformation } from './mu-wrapper-information.interface';
import { ReferenceType } from './reference-type.enum';

export interface MuUpdateRequest {
  name: string;
  manufacturer: number;
  ip: string;
  port: number;
  isGateWay: boolean;
  hdlcInformation?: MuHdlcInformation;
  wrapperInformation?: MuWrapperInformation;
  advancedInformation?: MuAdvancedInformation;

  serialNumber: string;
  templateId: number;
  interfaceType: number;
  protocol: number;
  referencingType: ReferenceType;
}

export interface MuUpdatePlcRequest {
  deviceId?: string;
  name: string;
}
