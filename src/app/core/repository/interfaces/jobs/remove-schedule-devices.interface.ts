import { stringify } from 'querystring';

export interface RequestRemoveScheduleDevices {
  requestId: string;
  scheduleId: string;
  devices: string[];
}
