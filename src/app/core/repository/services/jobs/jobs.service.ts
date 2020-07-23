import { addNewScheduleDevice } from './../../consts/jobs.const';
import { ScheduleDevice } from 'src/app/core/repository/interfaces/jobs/schedule-device.interface';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { activeJobs, stopJob, cancelJob } from '../../consts/data-concentrator-units.const';
import { SchedulerJobsList } from '../../interfaces/jobs/scheduler-jobs-list.interface';
import { GridRequestParams } from '../../interfaces/helpers/grid-request-params.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { ActiveJobsList } from '../../interfaces/jobs/active-jobs-list.interface';
import { schedulerJobs, schedulerJobsList, executeJob, enableJob } from '../../consts/jobs.const';
import { SchedulerJob } from '../../interfaces/jobs/scheduler-job.interface';
import { v4 as uuidv4 } from 'uuid';
import { DcuForm } from 'src/app/features/data-concentrator-units/interfaces/dcu-form.interface';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  constructor(private repository: RepositoryService) {}

  getSchedulerJobsList(param: GridRequestParams): Observable<GridResponse<SchedulerJobsList>> {
    param.requestId = param.requestId === null ? uuidv4() : param.requestId;
    return this.repository.makeRequest(this.getSchedulerJobsListRequest(param));
  }

  getSchedulerJobsListRequest(param: GridRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', schedulerJobsList, param);
  }

  getActiveJobsList(deviceId: string): Observable<ActiveJobsList[]> {
    return this.repository.makeRequest(this.getActiveJobsListRequest(deviceId));
  }

  getActiveJobsListRequest(deviceId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${activeJobs}/${deviceId}`);
  }

  getJob(jobId: string): Observable<SchedulerJob> {
    return this.repository.makeRequest(this.getJobRequest(jobId));
  }

  getJobRequest(jobId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${schedulerJobs}/${jobId}`);
  }

  stopJob(jobId: string, payload: any): Observable<any> {
    return this.repository.makeRequest(this.stopJobRequest(jobId, payload));
  }

  stopJobRequest(jobId: string, payload: any): HttpRequest<any> {
    return new HttpRequest('PUT', `${activeJobs}/${stopJob}/${jobId}`, payload as any);
  }

  cancelJob(jobId: string, payload: any): Observable<any> {
    return this.repository.makeRequest(this.cancelJobRequest(jobId, payload));
  }

  cancelJobRequest(jobId: string, payload: any): HttpRequest<any> {
    return new HttpRequest('PUT', `${activeJobs}/${cancelJob}/${jobId}`, payload as any);
  }

  createSchedulerJob(schedule: SchedulerJob): Observable<SchedulerJob> {
    return this.repository.makeRequest(this.createSchedulerJobRequest(schedule));
  }

  createSchedulerJobRequest(param: SchedulerJob): HttpRequest<any> {
    return new HttpRequest('POST', `${schedulerJobs}`, param);
  }

  updateSchedulerJob(schedule: SchedulerJob, id: string): Observable<SchedulerJob> {
    return this.repository.makeRequest(this.updateSchedulerJobRequest(schedule, id));
  }

  updateSchedulerJobRequest(param: SchedulerJob, id: string): HttpRequest<any> {
    return new HttpRequest('PUT', `${schedulerJobs}/${id}`, param);
  }

  deleteSchedulerJob(id: string): Observable<any> {
    return this.repository.makeRequest(this.deleteSchedulerJobRequest(id));
  }

  deleteSchedulerJobRequest(id: string): HttpRequest<any> {
    return new HttpRequest('DELETE', `${schedulerJobs}/${id}`);
  }

  executeSchedulerJob(id: string): Observable<any> {
    return this.repository.makeRequest(this.executeSchedulerJobRequest(id));
  }

  executeSchedulerJobRequest(id: string): HttpRequest<any> {
    return new HttpRequest('PUT', `${executeJob}/${id}`, null);
  }

  enableSchedulerJob(id: string): Observable<any> {
    return this.repository.makeRequest(this.enableSchedulerJobRequest(id));
  }

  enableSchedulerJobRequest(id: string): HttpRequest<any> {
    return new HttpRequest('PUT', `${enableJob}/${id}/1`, null);
  }

  disableSchedulerJob(id: string): Observable<any> {
    return this.repository.makeRequest(this.disableSchedulerJobRequest(id));
  }

  disableSchedulerJobRequest(id: string): HttpRequest<any> {
    return new HttpRequest('PUT', `${enableJob}/${id}/0`, null);
  }

  createScheduleDevice(deviceId: string, scheduleId: string) {
    const sdRequest: ScheduleDevice = {
      scheduleDeviceId: null,
      scheduleId: scheduleId,
      deviceId: deviceId,
      readingId: null,
      registerGroupName: null,
      registerGroupType: null,
      templateId: null
    };

    return this.addNewScheduleDevice(sdRequest);
  }

  addNewScheduleDevice(payload: ScheduleDevice): Observable<ScheduleDevice> {
    return this.repository.makeRequest(this.addNewScheduleDeviceRequest(payload));
  }

  addNewScheduleDeviceRequest(payload: ScheduleDevice): HttpRequest<ScheduleDevice> {
    return new HttpRequest('POST', addNewScheduleDevice, payload as any);
  }
}
