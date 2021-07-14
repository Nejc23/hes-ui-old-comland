import { MuForm } from './mu-form.interface';
import { MuHdlcInformation } from './../../../../core/repository/interfaces/meter-units/mu-hdlc-information.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import {
  AuthenticationTypeEnum,
  MuAdvancedInformation
} from 'src/app/core/repository/interfaces/meter-units/mu-advanced-information.interface';
import { MuWrapperInformation } from 'src/app/core/repository/interfaces/meter-units/mu-wrapper-information.interface';
import { ReferenceType } from '../../../../core/repository/interfaces/meter-units/reference-type.enum';

export interface MuUpdateForm {
  // dlms
  deviceId: string;
  name: string;
  manufacturer: Codelist<number>;
  ip: string;
  port: number;
  isGateWay: boolean;
  communicationType: number;

  template: Codelist<number>;
  connectionType: Codelist<number>;
  serialNumber: string;

  authenticationType: AuthenticationTypeEnum;
  advancedInformation: MuAdvancedInformation;
  wrapperInformation?: MuWrapperInformation;
  hdlcInformation?: MuHdlcInformation;
  protocol: number;
  referencingType: ReferenceType;
}

export interface MuUpdatePlcForm {
  deviceId: string;
  name: string;
}
