import { GridBulkActionRequestParams } from '../helpers/grid-bulk-action-request-params.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { RegistersSelectRequest } from '../registers-select/registers-select-request.interface';

export interface SchedulerJob {
  description: string;

  startAt?: string;
  endAt?: string;
  cronExpression: string;
  jobType: any;
  active: boolean;

  devices?: GridBulkActionRequestParams;
  registers?: string[];
  readingProperties?: ReadingProperties;
  schedules?: Schedule[];

  addresses?: string[];
  filter?: NotificationFilter;
}

export interface NotificationFilter {
  alarmIds?: number[];
  severities?: any[];
  protocols?: any[];
  manufacturers?: any[];
  sources?: any[];
}

export interface SchedulerJobForm extends SchedulerJob {
  time?: Date;
  timeForHours?: Date;
  startAtDate?: Date;
  endAtDate?: Date;
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
