import { GridBulkActionRequestParams } from '../helpers/grid-bulk-action-request-params.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { RegistersSelectRequest } from '../registers-select/registers-select-request.interface';

export interface SchedulerJob {
  readOptions?: number;
  nHours?: number;
  nMinutes?: number;
  weekDays?: number[];
  monthDays?: number[];

  iec?: boolean;

  dateTime?: string;

  enable?: boolean;
  bulkActionsRequestParam?: GridBulkActionRequestParams;

  registers?: RegistersSelectRequest[];
  description: string;

  usePointer?: boolean;
  intervalRange?: number;
  timeUnit?: number;
  actionType?: number;

  devices?: GridBulkActionRequestParams;
  startAt?: string;
  endAt?: string;
  cronExpression?: string;
  jobType?: string;
  active?: boolean;
  readingProperties?: ReadingProperties;
  schedules?: Schedule[];
}

export interface SchedulerJobForm extends SchedulerJob {
  time?: Date;
  timeForHours?: Date;
  startAtDate?: Date;
  endAtDate?: Date;
  cronExpression?: string;
}

export interface ReadingProperties {
  usePointer: boolean;
  iecPushEnabled: boolean;
  intervalRange: number;
  timeUnit: number;
}

export interface Schedule {
  id?: string;
  cronExpression: string;
  active: boolean;
  description?: string;
  startAt?: string;
  endAt?: string;
}
