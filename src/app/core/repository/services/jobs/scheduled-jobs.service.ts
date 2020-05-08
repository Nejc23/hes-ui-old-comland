import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { scheduledJobs } from '../../consts/data-concentrator-units.const';
import { ScheduledJobsList } from '../../interfaces/jobs/scheduled-jobs-list.interface';
import { GridRequestParams } from '../../interfaces/helpers/gris-request-params.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ScheduledJobsService {
  constructor(private repository: RepositoryService) {}

  getScheduledJobsList(param: GridRequestParams): Observable<GridResponse<ScheduledJobsList>> {
    return this.repository.makeRequest(this.getScheduledJobsListRequest(param));
  }

  getScheduledJobsListRequest(param: GridRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', scheduledJobs, param);
  }
}
