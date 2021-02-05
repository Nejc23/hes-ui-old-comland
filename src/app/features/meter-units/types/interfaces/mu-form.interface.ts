import { MuHdlcInformation } from './../../../../core/repository/interfaces/meter-units/mu-hdlc-information.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { MuAdvancedInformation } from 'src/app/core/repository/interfaces/meter-units/mu-advanced-information.interface';
import { MuWrapperInformation } from 'src/app/core/repository/interfaces/meter-units/mu-wrapper-information.interface';

export interface MuForm {
  name: string;
  serialNumber: string;
  manufacturer: Codelist<number>;
  template: Codelist<string>;
  connectionType: Codelist<number>;
  ip: string;
  port: number;
  communicationType: number;
  isHls: boolean;
  isGateway: boolean;
  jobIds: string[];
  isShortName: boolean;
  password: string;
  authenticationType: Codelist<number>;

  advancedInformation: MuAdvancedInformation;
  wrapperInformation?: MuWrapperInformation;
  hdlcInformation?: MuHdlcInformation;
}
