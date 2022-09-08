/* tslint:disable */
/* eslint-disable */
import { IJobCommand } from './i-job-command';
export interface IJobCommandResponseGridModel {
  data?: null | Array<IJobCommand>;
  groupCount?: number;
  summary?: null | string;
  totalCount?: number;
}
