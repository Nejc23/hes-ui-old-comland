import { GridBulkActionRequestParams } from '../helpers/grid-bulk-action-request-params.interface';
import { RegistersSelectRequest } from '../registers-select/registers-select-request.interface';
import { IActionRequestParams } from '../../../../../../src/app/core/repository/interfaces/myGridLink/action-prams.interface';

export interface SchedulerJob extends IActionRequestParams {
  description: string;

  startAt?: string;
  endAt?: string;
  cronExpression: string;
  jobType: any;
  active: boolean;

  devices?: GridBulkActionRequestParams;
  registers?: RegistersSelectRequest[];
  readingProperties?: ReadingProperties;
  schedules?: Schedule[];

  addresses?: string[];
  tryFillDevices?: boolean;
  //filter?: NotificationFilter;
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
  unConditionalSync?: boolean;
  syncWindowMaxInMs?: number;
  syncWindowMinInMs?: number;
}

export interface Schedule {
  id?: string;
  cronExpression: string;
  active: boolean;
  description?: string;
  startAt?: string;
  endAt?: string;
}
