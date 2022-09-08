/* tslint:disable */
/* eslint-disable */
import { BulkActionsRequestParam } from './bulk-actions-request-param';
import { DeviceTemplate } from './device-template';
import { FilterParam } from './filter-param';
import { JobType } from './job-type';
import { ReadingProperties } from './reading-properties';
import { ScheduleRegisterRequest } from './schedule-register-request';
import { SortParam } from './sort-param';
import { TextSearch } from './text-search';
export interface AddNewJobRequest {
  active: boolean;
  cronExpression: string;
  description: string;
  deviceIds?: null | Array<string>;
  devices?: BulkActionsRequestParam;
  endAt?: null | string;
  excludedIds?: null | Array<string>;
  filter?: null | Array<FilterParam>;
  includedIds?: null | Array<string>;
  jobType: JobType;
  owner?: null | string;
  pageNumber?: number;
  pageSize?: number;
  readingProperties?: ReadingProperties;
  registers?: null | Array<ScheduleRegisterRequest>;
  requestId: string;
  scheduleDevices?: null | Array<DeviceTemplate>;
  scheduleProperties?: null | {
    [key: string]: string;
  };
  scheduleRegisters?: null | Array<ScheduleRegisterRequest>;
  sort?: null | Array<SortParam>;
  startAt?: null | string;
  textSearch?: TextSearch;
  tryFillDevices?: boolean;
}
