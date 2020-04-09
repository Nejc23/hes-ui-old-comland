export interface MeterUnitsReadSchedule {
  readOptions: number;
  nHours: number;
  nMinutes: number;
  time: TimeInDay;
  weekDays: number[];
  monthDays: number[];
  registers: number[];
}

export interface TimeInDay {
  hour: number;
  minute: number;
  second: number;
}
