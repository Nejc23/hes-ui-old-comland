/* tslint:disable */
/* eslint-disable */
import { DeviceProtocol } from './device-protocol';
import { JobType } from './job-type';
import { MeterVendorType } from './meter-vendor-type';
export interface ScheduledRekeyDto {
  active: boolean;
  cronExpression: string;
  description?: null | string;
  endAt?: null | string;
  jobType: JobType;
  manufacturers?: null | Array<MeterVendorType>;
  protocols?: null | Array<DeviceProtocol>;
  rekeyAfterDays?: number;
  scheduleJobId?: string;
  startAt?: null | string;
}
