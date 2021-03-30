import { MuAdvancedInformation } from './mu-advanced-information.interface';
import { MuHdlcInformation } from './mu-hdlc-information.interface';
import { MuWrapperInformation } from './mu-wrapper-information.interface';

export interface MuUpdateRequest {
  name: string;
  manufacturer: number;
  ip: string;
  port: number;
  isGateWay: boolean;
  communicationType?: number;
  hdlcInformation?: MuHdlcInformation;
  wrapperInformation?: MuWrapperInformation;
  advancedInformation?: MuAdvancedInformation;

  serialNumber: string;
  templateId: number;
}
