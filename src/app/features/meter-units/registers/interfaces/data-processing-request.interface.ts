import { AutoTemplateRegister } from './../../../../core/repository/interfaces/auto-templates/auto-template-register.interface';
import { RegistersSelectList } from 'src/app/core/repository/interfaces/registers-select/registers-select-list.interface';
import { RadioOption } from './../../../../shared/forms/interfaces/radio-option.interface';
import { Codelist } from './../../../../shared/repository/interfaces/codelists/codelist.interface';
import { RegisterValue } from 'src/app/core/repository/interfaces/data-processing/profile-definitions-for-device.interface';
export interface DataProcessingRequest {
  deviceIds: string[];
  startTime: string;
  endTime: string;
  profiles?: Profile[];
  registerIds?: string[];
}

export interface Profile {
  profileId: string;
  registerIds: string[];
}

export interface RegistersFilter {
  deviceId: string;
  register: AutoTemplateRegister;
  startTime: Date;
  endTime: Date;
}

export interface RegisterStatistics {
  averageValue: number;
  maxValue: RegisterValue;
  minValue: RegisterValue;
}
