import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { scheduledJobs } from '../../consts/data-concentrator-units.const';
import { ScheduledJobsList } from '../../interfaces/scheduled-jobs/scheduled-jobs-list.interface';

@Injectable({
  providedIn: 'root'
})
export class ScheduledJobsService {
  constructor(private repository: RepositoryService) {}

  getScheduledJobsList(): Observable<ScheduledJobsList[]> {
    return this.repository.makeRequest(this.getScheduledJobsListRequest());
  }

  getScheduledJobsListRequest(): HttpRequest<any> {
    return new HttpRequest('GET', scheduledJobs);
  }
}
