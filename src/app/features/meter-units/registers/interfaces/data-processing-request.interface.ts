import { AutoTemplateRegister } from './../../../../core/repository/interfaces/auto-templates/auto-template-register.interface';
import { RadioOption } from './../../../../shared/forms/interfaces/radio-option.interface';
import { RegisterValue } from 'src/app/core/repository/interfaces/data-processing/profile-definitions-for-device.interface';

export interface RegistersFilter {
  deviceId: string;
  register?: AutoTemplateRegister; // mandatory for meters
  startTime: string;
  endTime: string;
  eventType?: string; // Alarm for alarms
}

export interface RegisterStatistics {
  averageValue: number;
  maxValue: RegisterValue;
  minValue: RegisterValue;
}

export interface RegisterGroup {
  groupId: string;
  groupName: string;
  registerOptions: RadioOption[];
}
