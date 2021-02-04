import { MuAdvancedInformation } from './mu-advanced-information.interface';
import { MuHdlcInformation } from './mu-hdlc-information.interface';
import { MuWrapperInformation } from './mu-wrapper-information.interface';

export interface MuCreateRequest {
  name: string;
  serial: string;
  templateId: string;
  communicationType: number;
  manufacturer: number;
  protocol: number;
  medium: number;
  jobIds: string[];
  ip: string;
  port: number;
  isHls: boolean;
  isGateWay: boolean;
  isShortName: boolean;
  hdlcInformation?: MuHdlcInformation;
  wrapperInformation?: MuWrapperInformation;
  advancedInformation: MuAdvancedInformation;
}
