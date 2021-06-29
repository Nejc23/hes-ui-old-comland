import { MuHdlcInformation } from './../../../../core/repository/interfaces/meter-units/mu-hdlc-information.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import {
  AuthenticationTypeEnum,
  MuAdvancedInformation
} from 'src/app/core/repository/interfaces/meter-units/mu-advanced-information.interface';
import { MuWrapperInformation } from 'src/app/core/repository/interfaces/meter-units/mu-wrapper-information.interface';
import { ReferenceType } from '../../../../core/repository/interfaces/meter-units/reference-type.enum';

export interface MuForm {
  name: string;
  serialNumber: string;
  manufacturer: Codelist<number>;
  template: Codelist<string>;
  connectionType: Codelist<number>;
  ip: string;
  port: number;
  communicationType: number;
  isGateway: boolean;
  jobIds: string[];
  authenticationType: AuthenticationTypeEnum;

  advancedInformation: MuAdvancedInformation;
  wrapperInformation?: MuWrapperInformation;
  hdlcInformation?: MuHdlcInformation;
  referencingType: ReferenceType;
}
