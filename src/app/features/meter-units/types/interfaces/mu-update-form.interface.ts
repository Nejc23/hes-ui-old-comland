import {
  AuthenticationTypeEnum,
  MuAdvancedInformation
} from 'src/app/core/repository/interfaces/meter-units/mu-advanced-information.interface';
import { MuWrapperInformation } from 'src/app/core/repository/interfaces/meter-units/mu-wrapper-information.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { ReferenceType } from '../../../../core/repository/interfaces/meter-units/reference-type.enum';
import { MuHdlcInformation } from './../../../../core/repository/interfaces/meter-units/mu-hdlc-information.interface';

export interface MuUpdateForm extends MuUpdatePlcForm {
  // dlms
  manufacturer: Codelist<number>;
  hostname: string;
  port: number;
  communicationType: number;

  template: Codelist<number>;
  connectionType: Codelist<number>;

  authenticationType: AuthenticationTypeEnum;
  advancedInformation: MuAdvancedInformation;
  wrapperInformation?: MuWrapperInformation;
  hdlcInformation?: MuHdlcInformation;
  driver: number;
  referencingType: ReferenceType;
  medium?: number;
}

export interface MuUpdatePlcForm {
  deviceId: string;
  name: string;
  serialNumber: string;
  externalId?: string;
  templateId?: string;
  medium?: number;
}
