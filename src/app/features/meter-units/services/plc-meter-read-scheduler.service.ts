import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import {
  MeterUnitsReadSchedule,
  MeterUnitsReadScheduleForm
} from 'src/app/core/repository/interfaces/meter-units/meter-units-read-schedule.interface';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlcMeterReadScheduleService {
  constructor(private meterService: MeterUnitsService) {}

  createMeterUnitsReadScheduler(values: MeterUnitsReadScheduleForm): Observable<MeterUnitsReadSchedule> {
    console.log(values);
    const currentOffset = Date.now();
    const dateTimeMoment = moment(values.time !== null ? values.time : values.dateTime !== null ? values.dateTime : Date.now());

    console.log(dateTimeMoment.toDate(), currentOffset);
    const serviceData: MeterUnitsReadSchedule = {
      readOptions: values.readOptions,
      nMinutes: values.nMinutes,
      nHours: values.nHours,
      weekDays: values.weekDays,
      monthDays: values.monthDays,
      registers: values.registers,
      iec: values.iec,
      description: values.description,
      dateTime: dateTimeMoment.format(),
      bulkActionsRequestParam: values.bulkActionsRequestParam,
      usePointer: values.usePointer,
      intervalRange: values.intervalRange,
      timeUnit: values.timeUnit
    };
    return this.meterService.createMeterUnitsReadScheduler(serviceData);
  }
}
