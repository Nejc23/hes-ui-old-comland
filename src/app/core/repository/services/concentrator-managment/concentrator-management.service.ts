import { HttpRequest } from '@angular/common/http';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { Injectable } from '@angular/core';
import { ActiveJob } from '../../../../features/jobs/interfaces/active-job-progress.interface';
import { getActiveJobs } from '../../consts/concentrator-management-const';
import { Observable } from 'rxjs';
import { TimeOfUseConfigList } from '../../interfaces/time-of-use/time-of-use-config-list.interface';

@Injectable({
  providedIn: 'root'
})
export class ConcentratorManagementService {
  constructor(private repository: RepositoryService) {}

  getActiveJobs(deviceId: string): Observable<ActiveJob> {
    return this.repository.makeRequest(this.getActiveJobsRequest(deviceId));
  }

  getActiveJobsRequest(deviceId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${getActiveJobs}/${deviceId}/active-jobs`);
  }
}
