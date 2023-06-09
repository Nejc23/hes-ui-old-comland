import { filterSortOrderEnum } from './../../../../features/global/enums/filter-operation-global.enum';
import { filterOperationEnum } from 'src/app/features/global/enums/filter-operation-global.enum';
import { capitalize } from 'lodash';
import { IActionRequestParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { activeJobs, cancelJob, stopJob } from '../../consts/data-concentrator-units.const';
import { SchedulerJobsList } from '../../interfaces/jobs/scheduler-jobs-list.interface';
import { GridRequestParams } from '../../interfaces/helpers/grid-request-params.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { ActiveJobsList } from '../../interfaces/jobs/active-jobs-list.interface';
import {
  autoJobLinks,
  deviceJobs,
  executeJob,
  notificationJobs,
  reKeyScheduleJobs,
  removeDeviceFromScheduler,
  schedulerActiveJobs,
  schedulerJobs,
  schedulerJobsList,
  schedulerJobsListByTemplateId
} from '../../consts/jobs.const';
import { SchedulerJob } from '../../interfaces/jobs/scheduler-job.interface';
import { gridSysNameColumnsEnum } from 'src/app/features/global/enums/jobs-global.enum';
import { DeviceJobs } from '../../interfaces/jobs/device-jobs.interface';
import { basePath, templates } from '../../consts/auto-templates.const';

@Injectable({
  providedIn: 'root'
})
export class SchedulerJobsService {
  constructor(private repository: RepositoryService) {}

  getSchedulerJobsListForm(param: GridRequestParams, pageIndex: number, pageSize?): Observable<GridResponse<SchedulerJobsList>> {
    const actionRequestParams = this.getActionRequestParams(param, pageIndex, pageSize);
    return this.getSchedulerJobsList(actionRequestParams);
  }

  getSchedulerJobsList(param: IActionRequestParams): Observable<GridResponse<SchedulerJobsList>> {
    // param.requestId = param.requestId === null ? uuidv4() : param.requestId;
    return this.repository.makeRequest(this.getSchedulerJobsListRequest(param));
  }

  getSchedulerJobsListRequest(param: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', schedulerJobsList, param);
  }

  getSchedulerJobsListByTemplateId(templateId: string): Observable<SchedulerJobsList[]> {
    return this.repository.makeRequest(this.getSchedulerJobsListByTemplateIdRequest(templateId));
  }

  getSchedulerJobsListByTemplateIdRequest(templateId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${basePath}/${templates}/${templateId}/${autoJobLinks}`);
  }

  getSchedulerActiveJobsList(deviceId: string): Observable<SchedulerJobsList[]> {
    return this.repository.makeRequest(this.getSchedulerActiveJobsListRequest(deviceId));
  }

  getSchedulerActiveJobsListRequest(deviceId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${schedulerActiveJobs}/${deviceId}`);
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

  getJobListByJobId(jobId: string): Observable<SchedulerJob> {
    return this.repository.makeRequest(this.getJobListByJobIdRequest(jobId));
  }

  getJobListByJobIdRequest(jobId: string): HttpRequest<any> {
    return new HttpRequest('POST', `${schedulerJobsListByTemplateId}`, [jobId]);
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

  executeSchedulerJob(id: string): Observable<any> {
    return this.repository.makeRequest(this.executeSchedulerJobRequest(id));
  }

  executeSchedulerJobRequest(id: string): HttpRequest<any> {
    return new HttpRequest('PUT', `${executeJob}/${id}`, null);
  }

  createDeviceJobs(deviceId: string, scheduleJobIds: string[]) {
    const sdRequest: DeviceJobs = {
      deviceId,
      scheduleJobIds
    };

    return this.addNewDeviceJobs(sdRequest);
  }

  addNewDeviceJobs(payload: DeviceJobs): Observable<DeviceJobs> {
    return this.repository.makeRequest(this.addNewDeviceJobsRequest(payload));
  }

  addNewDeviceJobsRequest(payload: DeviceJobs): HttpRequest<DeviceJobs> {
    return new HttpRequest('POST', deviceJobs, payload as any);
  }

  getActionRequestParams(param: GridRequestParams, pageIndex: number, pageSize?: number): IActionRequestParams {
    const requestParam: IActionRequestParams = {
      pageSize,
      pageNumber: pageIndex + 1,
      textSearch: {
        value: '',
        propNames: ['all'],
        useWildcards: false
      },
      sort: [],
      filter: []
    };

    if (param.searchModel && param.searchModel.length > 0 && param.searchModel[0].value.length > 0) {
      requestParam.textSearch.value = param.searchModel[0].value;
      requestParam.textSearch.propNames = ['active', 'description', 'type', 'nextRun', 'owner', 'deviceCount', 'id'];
      requestParam.textSearch.useWildcards = param.searchModel[0].useWildcards;
    }

    // // create filter object
    if (param.filterModel) {
      if (param.filterModel.types && param.filterModel.types.length > 0) {
        param.filterModel.types.map((row) =>
          requestParam.filter.push({
            propName: capitalize(gridSysNameColumnsEnum.type),
            propValue: row.toString(),
            filterOperation: filterOperationEnum.equal
          })
        );
      }
    }

    if (param.sortModel && param.sortModel.length > 0) {
      param.sortModel.map((row) =>
        requestParam.sort.push({
          propName: capitalize(row.colId),
          index: 0,
          sortOrder: row.sort === 'asc' ? filterSortOrderEnum.asc : filterSortOrderEnum.desc
        })
      );
    }
    //   requestParam.filter = [];
    //   if (param.filterModel.statuses && param.filterModel.statuses.length > 0) {
    //     param.filterModel.statuses.map(row =>
    //       requestParam.filter.push({
    //         propName: capitalize(gridSysNameColumnsEnum.status),
    //         propValue: row.id.toString(),
    //         filterOperation: filterOperationEnum.equal
    //       })
    //     );
    //   }
    //   if (param.filterModel.types && param.filterModel.types.length > 0) {
    //     param.filterModel.types.map(row =>
    //       requestParam.filter.push({
    //         propName: capitalize(gridSysNameColumnsEnum.type),
    //         propValue: row.toString(),
    //         filterOperation: filterOperationEnum.equal
    //       })
    //     );
    //   }
    //   if (param.filterModel.tags && param.filterModel.tags.length > 0) {
    //     param.filterModel.tags.map(row =>
    //       requestParam.filter.push({
    //         propName: capitalize(gridSysNameColumnsEnum.tags),
    //         propValue: row.id.toString(),
    //         filterOperation: filterOperationEnum.contains
    //       })
    //     );
    //   }
    //   if (param.filterModel.vendors && param.filterModel.vendors.length > 0) {
    //     param.filterModel.vendors.map(row =>
    //       requestParam.filter.push({
    //         propName: capitalize(gridSysNameColumnsEnum.vendor),
    //         propValue: row.id.toString(),
    //         filterOperation: filterOperationEnum.equal
    //       })
    //     );
    //   }

    // }

    return requestParam;
  }

  createNotificationJob(schedule: SchedulerJob): Observable<SchedulerJob> {
    return this.repository.makeRequest(this.createNotificationJobRequest(schedule));
  }

  createNotificationJobRequest(param: SchedulerJob): HttpRequest<any> {
    return new HttpRequest('POST', `${notificationJobs}`, param);
  }

  updateNotificationJob(schedule: SchedulerJob, id: string): Observable<SchedulerJob> {
    return this.repository.makeRequest(this.updateNotificationJobRequest(schedule, id));
  }

  updateNotificationJobRequest(param: SchedulerJob, id: string): HttpRequest<any> {
    return new HttpRequest('POST', `${notificationJobs}/${id}`, param);
  }

  getNotificationJob(id: string): Observable<SchedulerJob> {
    return this.repository.makeRequest(this.getNotificationJobRequest(id));
  }

  getNotificationJobRequest(id: string): HttpRequest<any> {
    return new HttpRequest('GET', `${notificationJobs}/${id}`);
  }

  removeDeviceFromSchedulerJob(scheduleJobId: string, deviceId: string): Observable<any> {
    return this.repository.makeRequest(this.removeDeviceFromSchedulerJobRequest(scheduleJobId, deviceId));
  }

  removeDeviceFromSchedulerJobRequest(scheduleJobId: string, deviceId: string): HttpRequest<any> {
    return new HttpRequest('DELETE', `${removeDeviceFromScheduler}/${scheduleJobId}/${deviceId}`, null);
  }

  getReKeyJob(id: string): Observable<SchedulerJob> {
    return this.repository.makeRequest(this.getReKeyJobRequest(id));
  }

  getReKeyJobRequest(id: string): HttpRequest<any> {
    return new HttpRequest('GET', `${reKeyScheduleJobs}/${id}`);
  }

  createReKeyJob(schedule: SchedulerJob): Observable<SchedulerJob> {
    return this.repository.makeRequest(this.createReKeyJobRequest(schedule));
  }

  createReKeyJobRequest(param: SchedulerJob): HttpRequest<any> {
    return new HttpRequest('POST', `${reKeyScheduleJobs}`, param);
  }

  updateReKeyJob(schedule: SchedulerJob, id: string): Observable<SchedulerJob> {
    return this.repository.makeRequest(this.updateReKeyJobRequest(schedule, id));
  }

  updateReKeyJobRequest(param: SchedulerJob, id: string): HttpRequest<any> {
    return new HttpRequest('POST', `${reKeyScheduleJobs}/${id}`, param);
  }
}
