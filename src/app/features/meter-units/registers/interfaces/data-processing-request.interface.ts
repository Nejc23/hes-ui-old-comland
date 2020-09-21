import { RadioOption } from './../../../../shared/forms/interfaces/radio-option.interface';
import { Codelist } from './../../../../shared/repository/interfaces/codelists/codelist.interface';
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

export interface MeterUnitRegistersForm {
  deviceId: string;
  register: Codelist<string>;
  range: number;
  startTime: Date;
  endTime: Date;
  showLineChart: boolean;
  showTable: boolean;
}
