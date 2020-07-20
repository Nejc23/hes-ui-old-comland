import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { SchedulerJob, SchedulerJobForm } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';

@Injectable({
  providedIn: 'root'
})
export class PlcMeterReadScheduleService {
  constructor(private jobsService: JobsService) {}

  transformData(values: SchedulerJobForm): SchedulerJob {
    const dateTimeMoment = moment(values.time !== null ? values.time : values.dateTime !== null ? values.dateTime : Date.now());

    const serviceData: SchedulerJob = {
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
      timeUnit: values.timeUnit,
      enable: values.enable,
      actionType: values.actionType
    };

    return serviceData;
  }

  createMeterUnitsReadScheduler(values: SchedulerJobForm): Observable<SchedulerJob> {
    return this.jobsService.createSchedulerJob(this.transformData(values));
  }

  updateMeterUnitsReadScheduler(values: SchedulerJobForm, id: string): Observable<SchedulerJob> {
    return this.jobsService.updateSchedulerJob(this.transformData(values), id);
  }
}
