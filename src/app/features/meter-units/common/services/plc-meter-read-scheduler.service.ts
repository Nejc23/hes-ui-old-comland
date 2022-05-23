import { Injectable } from '@angular/core';
import { SchedulerJob, SchedulerJobForm } from 'src/app/core/repository/interfaces/jobs/scheduler-job.interface';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { JobsService } from 'src/app/core/repository/services/jobs/jobs.service';

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
      deviceIds: values.deviceIds,
      active: values.active,
      jobType: values.jobType,

      startAt: values.startAtDate ? moment(values.startAtDate).format() : null,
      endAt: values.endAtDate ? moment(values.endAtDate).format() : null,
      cronExpression: values.cronExpression,
      filter: values.filter,
      addresses: values.addresses,

      pageSize: values.pageSize,
      pageNumber: values.pageNumber,
      sort: values.sort,
      textSearch: values.textSearch,
      tryFillDevices: values.tryFillDevices,
      notificationFilter: values.notificationFilter
    };
    return serviceData;
  }

  createMeterUnitsReadScheduler(values: SchedulerJobForm): Observable<SchedulerJob> {
    return this.jobsService.createSchedulerJob(this.transformData(values));
  }

  updateMeterUnitsReadScheduler(values: SchedulerJobForm, id: string): Observable<SchedulerJob> {
    return this.jobsService.updateSchedulerJob(this.transformData(values), id);
  }

  createNotificationJob(values: SchedulerJobForm): Observable<SchedulerJob> {
    return this.jobsService.createNotificationJob(this.transformData(values));
  }

  updateNotificationJob(values: SchedulerJobForm, id: string): Observable<SchedulerJob> {
    return this.jobsService.updateNotificationJob(this.transformData(values), id);
  }
}
