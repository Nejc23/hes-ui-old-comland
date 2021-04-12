import { SchedulableRegistersType } from './schedulable-registers-type.interface';

export interface SchedulableRegistersResponse {
  allHaveTemplate: boolean;
  templatelessDevices: boolean;
  schedulableRegistersTypes: SchedulableRegistersType[];
}
