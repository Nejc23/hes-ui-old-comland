import { MuAdvancedInformation } from './mu-advanced-information.interface';
import { MuHdlcInformation } from './mu-hdlc-information.interface';
import { MuWrapperInformation } from './mu-wrapper-information.interface';
import { ReferenceType } from './reference-type.enum';

export interface MuCreateRequest {
  name: string;
  serialNumber?: string;
  templateId?: string;
  interfaceType: number;
  manufacturer: number;
  protocol?: number;
  medium?: number;
  jobIds?: string[];
  ip: string;
  port: number;
  isGateWay: boolean;
  hdlcInformation?: MuHdlcInformation;
  wrapperInformation?: MuWrapperInformation;
  advancedInformation: MuAdvancedInformation;
  referencingType: ReferenceType;
}
