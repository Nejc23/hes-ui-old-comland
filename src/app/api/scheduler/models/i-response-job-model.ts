/* tslint:disable */
/* eslint-disable */
import { IReadingProperties } from './i-reading-properties';
import { ISchedule } from './i-schedule';
import { JobType } from './job-type';
export interface IResponseJobModel {
  active?: null | boolean;
  description?: null | string;
  id?: string;
  jobType?: JobType;
  readOptions?: number;
  readingProperties?: IReadingProperties;
  registers?: null | Array<string>;
  schedules?: null | Array<ISchedule>;
}
