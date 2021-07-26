import { HttpRequest } from '@angular/common/http';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { Injectable } from '@angular/core';
import { ActiveJob } from '../../../../features/jobs/interfaces/active-job-progress.interface';
import { basePathDcOperations, getActiveJobs, jobStateSummary } from 'src/app/core/repository/consts/data-concentrator-units.const';
import { Observable } from 'rxjs';
import { StatusJobProgress } from '../../../../features/jobs/interfaces/status-job-progress.interface';
import { getPropertyData } from '../../consts/meter-units.const';
import { IRegisterTypesEnum } from '../../interfaces/myGridLink/action-prams.interface';

@Injectable({
  providedIn: 'root'
})
export class ConcentratorService {
  constructor(private repository: RepositoryService) {}

  getJobProgress(deviceId: string): Observable<StatusJobProgress> {
    return this.repository.makeRequest(this.getJobStatusRequest(deviceId));
  }

  getActiveJobs(deviceId: string): Observable<ActiveJob> {
    return this.repository.makeRequest(this.getActiveJobsRequest(deviceId));
  }

  getActiveJobsRequest(deviceId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${getActiveJobs}/${deviceId}/active-jobs`);
  }

  getJobStatusRequest(requestId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${basePathDcOperations}/${requestId}/progress`);
  }

  getJobSummaryPost(deviceIds: string[]): Observable<any> {
    return this.repository.makeRequest(this.getJobSummaryRequest(deviceIds));
  }

  getJobSummaryRequest(deviceIds: string[]): HttpRequest<any> {
    return new HttpRequest('POST', jobStateSummary, deviceIds);
  }

  getThresholdValuesPost(deviceIds: string[]): Observable<any> {
    return this.repository.makeRequest(this.getThresholdValuesPostRequest(deviceIds));
  }

  getThresholdValuesPostRequest(deviceIds: string[]): HttpRequest<any> {
    const registerTypes = [
      IRegisterTypesEnum.limiterNormal,
      IRegisterTypesEnum.limiterEmergency,
      IRegisterTypesEnum.monitorPhase1,
      IRegisterTypesEnum.monitorPhase2,
      IRegisterTypesEnum.monitorPhase3
    ];
    const body = {
      deviceIds: deviceIds,
      registerTypes: registerTypes
    };
    return new HttpRequest('POST', getPropertyData, body);
  }
}
