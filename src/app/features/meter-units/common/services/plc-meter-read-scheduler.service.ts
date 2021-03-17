import { ReadingProperties } from './../../../../core/repository/interfaces/jobs/scheduler-job.interface';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { MeterUnitsService } from 'src/app/core/repository/services/meter-units/meter-units.service';
import { SchedulerJob, SchedulerJobForm } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';
import { endsWith } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class PlcMeterReadScheduleService {
  constructor(private jobsService: JobsService) {}

  transformData(values: SchedulerJobForm): SchedulerJob {
    const serviceData: SchedulerJob = {
      description: values.description,
      devices: values.devices,
      registers: values.registers,

      readingProperties: values.readingProperties,

      active: values.active,
      jobType: values.jobType,

      startAt: values.startAtDate ? moment(values.startAtDate).format() : null,
      endAt: values.endAtDate ? moment(values.endAtDate).format() : null,
      cronExpression: values.cronExpression,
      filter: values.filter,
      addresses: values.addresses
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
