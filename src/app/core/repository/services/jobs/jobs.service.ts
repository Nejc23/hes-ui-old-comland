import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { scheduledJobs, activeJobs, stopJob, cancelJob } from '../../consts/data-concentrator-units.const';
import { ScheduledJobsList } from '../../interfaces/jobs/scheduled-jobs-list.interface';
import { GridRequestParams } from '../../interfaces/helpers/gris-request-params.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { ActiveJobsList } from '../../interfaces/jobs/active-jobs-list.interface';

@Injectable({
  providedIn: 'root'
})
export class JobsService {
  constructor(private repository: RepositoryService) {}

  getScheduledJobsList(param: GridRequestParams): Observable<GridResponse<ScheduledJobsList>> {
    return this.repository.makeRequest(this.getScheduledJobsListRequest(param));
  }

  getScheduledJobsListRequest(param: GridRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', scheduledJobs, param);
  }

  getActiveJobsList(deviceId: string): Observable<ActiveJobsList[]> {
    return this.repository.makeRequest(this.getActiveJobsListRequest(deviceId));
  }

  getActiveJobsListRequest(deviceId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${activeJobs}/${deviceId}`);
  }

  stopJob(jobId: string): Observable<any> {
    return this.repository.makeRequest(this.stopJobRequest(jobId));
  }

  stopJobRequest(jobId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${activeJobs}/${stopJob}/${jobId}`);
  }

  cancelJob(jobId: string): Observable<any> {
    return this.repository.makeRequest(this.cancelJobRequest(jobId));
  }

  cancelJobRequest(jobId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${activeJobs}/${cancelJob}/${jobId}`);
  }
}
