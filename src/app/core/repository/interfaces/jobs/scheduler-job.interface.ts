import { GridBulkActionRequestParams } from '../helpers/grid-bulk-action-request-params.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

export interface SchedulerJob {
  readOptions: number;
  nHours: number;
  nMinutes: number;
  weekDays: number[];
  monthDays: number[];
  registers: string[];
  description: string;
  iec: boolean;
  enable: boolean;
  dateTime: string;
  usePointer: boolean;
  intervalRange: number;
  timeUnit: number;
  bulkActionsRequestParam: GridBulkActionRequestParams;
}

export interface SchedulerJobForm extends SchedulerJob {
  time: Date;
}