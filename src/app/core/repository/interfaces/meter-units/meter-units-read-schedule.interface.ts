import { GridBulkActionRequestParams } from '../helpers/grid-bulk-action-request-params.interface';

export interface MeterUnitsReadSchedule {
  readOptions: number;
  nHours: number;
  nMinutes: number;
  time: TimeInDay;
  weekDays: number[];
  monthDays: number[];
  registers: number[];
  bulkActionsRequestParam: GridBulkActionRequestParams;
}

export interface TimeInDay {
  hour: number;
  minute: number;
  second: number;
}
