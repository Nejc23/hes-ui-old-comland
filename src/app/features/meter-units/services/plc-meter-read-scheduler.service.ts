import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import {
  MeterUnitsReadSchedule,
  MeterUnitsReadScheduleForm,
  MeterUnitsReadScheduleService
} from 'src/app/core/repository/interfaces/meter-units/meter-units-read-schedule.interface';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlcMeterReadScheduleService {
  constructor(private meterService: MeterUnitsService) {}

  createMeterUnitsReadScheduler(values: MeterUnitsReadScheduleForm): Observable<MeterUnitsReadScheduleService> {
    const serviceData: MeterUnitsReadScheduleService = {
      readOptions: values.readOptions,
      nMinutes: values.nMinutes,
      nHours: values.nHours,
      time: moment(values.time).format(moment.HTML5_FMT.TIME),
      weekDays: values.weekDays,
      monthDays: values.monthDays,
      registers: values.registers,
      bulkActionsRequestParam: values.bulkActionsRequestParam
    };
    return this.meterService.createMeterUnitsReadScheduler(serviceData);
  }
}
