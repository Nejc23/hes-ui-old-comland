import { MuWrapperInformation } from './../meter-units/mu-wrapper-information.interface';
import { MuAdvancedInformation } from '../meter-units/mu-advanced-information.interface';
import { MuHdlcInformation } from '../meter-units/mu-hdlc-information.interface';

export interface GetDefaultInformationResponse {
  advancedInformation: MuAdvancedInformationDefault;
  hdlcInformation: MuHdlcInformationDefault;
  wrapperInformation: MuWrapperInformationDefault;
}

export interface MuAdvancedInformationDefault {
  advancedInformationId: string;
  templateId: string;
  advancedInformation: MuAdvancedInformation;
}

export interface MuHdlcInformationDefault {
  hdlcInformationId: string;
  templateId: string;
  hdlcInformation: MuHdlcInformation;
}

export interface MuWrapperInformationDefault {
  wrapperInformationId: string;
  templateId: string;
  wrapperInformation: MuWrapperInformation;
}
