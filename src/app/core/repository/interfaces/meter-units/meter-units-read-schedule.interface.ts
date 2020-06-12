import { GridBulkActionRequestParams } from '../helpers/grid-bulk-action-request-params.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

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
  usePointer: boolean;
  intervalRange: number;
  timeUnit: number;
  bulkActionsRequestParam: GridBulkActionRequestParams;
}

export interface MeterUnitsReadScheduleForm extends MeterUnitsReadSchedule {
  time: Date;
}
