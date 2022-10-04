/* tslint:disable */
/* eslint-disable */
import { BulkActionsRequestParam } from './bulk-actions-request-param';
import { DeviceTemplate } from './device-template';
import { JobType } from './job-type';
import { ReadingProperties } from './reading-properties';
import { ScheduleRegisterRequest } from './schedule-register-request';
export interface UpdateJobRequest {
  active?: null | boolean;
  cronExpression?: null | string;
  description?: null | string;
  devices?: BulkActionsRequestParam;
  endAt?: null | string;
  jobType?: JobType;
  owner?: null | string;
  readingProperties?: ReadingProperties;
  registers?: null | Array<ScheduleRegisterRequest>;
  scheduleDevices?: null | Array<DeviceTemplate>;
  scheduleId?: null | string;
  scheduleProperties?: null | {
    [key: string]: string;
  };
  scheduleRegisters?: null | Array<ScheduleRegisterRequest>;
  startAt?: null | string;
}
