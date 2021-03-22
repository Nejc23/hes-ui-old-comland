import { MuAdvancedInformation } from './mu-advanced-information.interface';
import { MuHdlcInformation } from './mu-hdlc-information.interface';
import { MuWrapperInformation } from './mu-wrapper-information.interface';

export interface MeterUnitDetails {
  deviceId: string;
  serialNumber: string;
  name: string;
  templateName: string;
  protocol: string;
  manufacturer: string;
  ip: string;
  port: number;
  isGateWay: boolean;
  deviceStatus: string;
  hdlcInformation?: MuHdlcInformation;
  wrapperInformation?: MuWrapperInformation;
  advancedInformation: MuAdvancedInformation;
  type: number;
}
