import { GridBulkActionRequestParams } from '../helpers/grid-bulk-action-request-params.interface';

export interface MeterUnitsReadSchedule {
  readOptions: number;
  nHours: number;
  nMinutes: number;
  weekDays: number[];
  monthDays: number[];
  registers: number[];
  description: string;
  iec: boolean;
  dateTime: string;
  bulkActionsRequestParam: GridBulkActionRequestParams;
}

export interface MeterUnitsReadScheduleForm extends MeterUnitsReadSchedule {
  time: Date;
}

export interface MeterUnitsReadScheduleForService extends MeterUnitsReadSchedule {
  time: string;
}
