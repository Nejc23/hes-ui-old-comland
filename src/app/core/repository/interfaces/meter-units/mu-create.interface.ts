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
  driver?: number;
  medium?: number;
  jobIds?: string[];
  hostname: string;
  port: number;
  hdlcInformation?: MuHdlcInformation;
  wrapperInformation?: MuWrapperInformation;
  advancedInformation: MuAdvancedInformation;
  referencingType: ReferenceType;
  externalId?: string;
}
