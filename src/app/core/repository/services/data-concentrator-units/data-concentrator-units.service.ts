import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { DcuForm, EditDcuForm } from 'src/app/features/data-concentrator-units/interfaces/dcu-form.interface';
import { v4 as uuidv4 } from 'uuid';
import {
  addConcentrator,
  dataConcentrator,
  dcuForJob,
  dcuLayout,
  dcuSync,
  deleteConcentrators,
  getConcentrators,
  removeDcuFromJob,
  updateConcentrator,
  validateHostname
} from '../../consts/data-concentrator-units.const';
import { DataConcentratorUnit } from '../../interfaces/data-concentrator-units/data-concentrator-unit.interface';
import { DataConcentratorUnitsList } from '../../interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { DcuInsertRequest } from '../../interfaces/data-concentrator-units/dcu-insert-request.interface';
import { DcuUpdateRequest, ValidateHostnameRequest } from '../../interfaces/data-concentrator-units/dcu-update-request.interface';
import { GridRequestParams } from '../../interfaces/helpers/grid-request-params.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { RequestDcuForJob, ResponseDcuForJob } from '../../interfaces/jobs/dcu/dcu-for-job.interface';
import { IActionRequestDeleteDevice, IActionRequestParams } from '../../interfaces/myGridLink/action-prams.interface';
import { capitalize } from 'lodash';
import { gridSysNameColumnsEnum } from '../../../../features/global/enums/dcu-global.enum';
import { filterOperationEnum, filterSortOrderEnum } from '../../../../features/global/enums/filter-operation-global.enum';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsService {
  constructor(private repository: RepositoryService) {}

  getGridDcuForm(
    param: GridRequestParams,
    pageIndex: number,
    visibleColumnNames: string[],
    pageSize?: number
  ): Observable<GridResponse<DataConcentratorUnitsList>> {
    const actionRequestParams = this.getActionRequestParams(param, pageIndex, visibleColumnNames, pageSize);
    return this.repository.makeRequest(this.getGridDcuRequest(actionRequestParams));
  }

  getGridDcu(param: IActionRequestParams): Observable<GridResponse<DataConcentratorUnitsList>> {
    return this.repository.makeRequest(this.getGridDcuRequest(param));
  }

  getGridDcuRequest(param: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', getConcentrators, param);
  }

  getDcuLayout(): Observable<DcuLayout[]> {
    return this.repository.makeRequest(this.getDcuLayoutRequest());
  }

  getDcuLayoutRequest(): HttpRequest<any> {
    return new HttpRequest('GET', dcuLayout);
  }

  saveDcuLayout(id: number, payload: DcuLayout): Observable<DcuLayout> {
    return this.repository.makeRequest(this.saveDcuFilterRequest(id, payload));
  }

  saveDcuFilterRequest(id: number, payload: DcuLayout): HttpRequest<DcuLayout> {
    return new HttpRequest('PUT', `${dcuLayout}/${id}`, payload as any);
  }

  deleteDcuLayout(id: number): Observable<any> {
    return this.repository.makeRequest(this.deleteDcuLayoutRequest(id));
  }

  deleteDcuLayoutRequest(id: number): HttpRequest<any> {
    return new HttpRequest('DELETE', `${dcuLayout}/${id}`);
  }

  createDcuLayout(payload: DcuLayout): Observable<DcuLayout> {
    return this.repository.makeRequest(this.createDcuLayoutRequest(payload));
  }

  createDcuLayoutRequest(payload: DcuLayout): HttpRequest<DcuLayout> {
    return new HttpRequest('POST', dcuLayout, payload as any);
  }

  deleteDcu(requestParam: IActionRequestDeleteDevice): Observable<any> {
    return this.repository.makeRequest(this.deleteDcuRequest(requestParam));
  }

  deleteDcuRequest(param: IActionRequestDeleteDevice): HttpRequest<any> {
    return new HttpRequest('POST', `${deleteConcentrators}`, param);
  }

  createDcu(payload: DcuForm): Observable<string> {
    const dcuRequest: DcuInsertRequest = {
      concentratorId: payload.serialNumber,
      hostname: payload.hostname,
      type: payload.type ? payload.type.id : -1,
      vendor: payload.manufacturer ? payload.manufacturer.id : -1,
      name: payload.name,
      userName: payload.userName,
      password: payload.password,
      externalId: payload.externalId
    };

    return this.repository.makeRequest(this.createDcuRequest(dcuRequest));
  }

  createDcuRequest(payload: DcuInsertRequest): HttpRequest<string> {
    return new HttpRequest('POST', addConcentrator, payload as any);
  }

  updateDcu(id: string, payload: EditDcuForm): Observable<DcuUpdateRequest[]> {
    const dcuRequest: DcuUpdateRequest = {
      hostname: payload.hostname,
      serialNumber: payload.serialNumber,
      // type: payload.type ? payload.type.id : -1,
      // vendor: payload.manufacturer ? payload.manufacturer.id : -1,
      name: payload.name,
      externalId: payload.externalId,
      userName: payload.userName,
      // password: payload.password,
      address: payload.address
      // mac: payload.mac,
      // status: payload.status ? payload.status.id : -1
      // latitude: payload.latitude,
      // longitude: payload.longitude,
      // tags: ????
    };

    return this.repository.makeRequest(this.updateDcuRequest(id, dcuRequest));
  }

  updateDcuRequest(id: string, payload: DcuUpdateRequest): HttpRequest<string> {
    return new HttpRequest('PUT', `${updateConcentrator}/${id}`, payload as any);
  }

  dcuSync(): Observable<any> {
    return this.repository.makeRequest(this.dcuSyncRequest());
  }

  dcuSyncRequest(): HttpRequest<any> {
    return new HttpRequest('GET', dcuSync);
  }

  getDataConcentratorUnit(id: string): Observable<DataConcentratorUnit> {
    return this.repository.makeRequest(this.getDataConcentratorUnitRequest(id));
  }

  getDataConcentratorUnitRequest(id: string): HttpRequest<any> {
    return new HttpRequest('GET', `${dataConcentrator}/${id}`);
  }

  validateHostname(request: ValidateHostnameRequest): Observable<boolean> {
    return this.repository.makeRequest(this.validateHostnameRequest(request));
  }

  validateHostnameRequest(request: ValidateHostnameRequest): HttpRequest<any> {
    return new HttpRequest('POST', validateHostname, request);
  }

  getConcentratorsForJob(param: RequestDcuForJob): Observable<ResponseDcuForJob> {
    param.requestId = param.requestId === null ? uuidv4() : param.requestId;
    return this.repository.makeRequest(this.getConcentratorsForJobRequest(param));
  }

  getConcentratorsForJobRequest(param: RequestDcuForJob): HttpRequest<any> {
    return new HttpRequest('POST', dcuForJob, param);
  }

  removeConcentratorsFromJob(payload: RequestDcuForJob): Observable<any> {
    payload.requestId = payload.requestId === null ? uuidv4() : payload.requestId;
    return this.repository.makeRequest(this.removeConcentratorsFromJobRequest(payload));
  }

  removeConcentratorsFromJobRequest(payload: RequestDcuForJob): HttpRequest<any> {
    return new HttpRequest('POST', removeDcuFromJob, payload as any);
  }

  getActionRequestParams(param: GridRequestParams, pageNumber: number, allVisibleColumns: string[], pageSize?): IActionRequestParams {
    const requestParam: IActionRequestParams = {
      pageSize: pageSize ?? param.endRow - param.startRow,
      pageNumber: pageNumber,
      textSearch: {
        value: '',
        propNames: [],
        useWildcards: false
      },
      sort: []
    };
    requestParam.filter = [];
    if (param.searchModel && param.searchModel.length > 0 && param.searchModel[0].value.length > 0) {
      requestParam.textSearch.value = param.searchModel[0].value;
      requestParam.textSearch.propNames = allVisibleColumns;
      requestParam.textSearch.useWildcards = param.searchModel[0].useWildcards;
    }
    if (param.filterModel) {
      if (param.filterModel.states && param.filterModel.states.length > 0) {
        param.filterModel.states.map((row) =>
          requestParam.filter.push({
            propName: capitalize(gridSysNameColumnsEnum.state),
            propValue: row.id.toString(),
            filterOperation: filterOperationEnum.equal
          })
        );
      }
      if (param.filterModel.types && param.filterModel.types.length > 0) {
        param.filterModel.types.map((row) =>
          requestParam.filter.push({
            propName: capitalize(gridSysNameColumnsEnum.type),
            propValue: row.toString(),
            filterOperation: filterOperationEnum.equal
          })
        );
      }
      if (param.filterModel.tags && param.filterModel.tags.length > 0) {
        param.filterModel.tags.map((row) =>
          requestParam.filter.push({
            propName: capitalize(gridSysNameColumnsEnum.tags),
            propValue: row.id.toString(),
            filterOperation: filterOperationEnum.contains
          })
        );
      }
      if (param.filterModel.vendors && param.filterModel.vendors.length > 0) {
        param.filterModel.vendors.map((row) =>
          requestParam.filter.push({
            propName: capitalize(gridSysNameColumnsEnum.vendor),
            propValue: row.id.toString(),
            filterOperation: filterOperationEnum.equal
          })
        );
      }

      // sla filter
      if (param.filterModel?.sla) {
        requestParam.filter.push({
          propName: gridSysNameColumnsEnum.sla,
          propValue: param.filterModel.sla.value,
          filterOperation: param.filterModel.sla.id === 3 ? filterOperationEnum.graterThenOrEqual : filterOperationEnum.lessThenOrEqual
        });
      }
      // last communication filter
      if (param.filterModel?.lastCommunicationFilter) {
        requestParam.filter.push({
          propName: gridSysNameColumnsEnum.lastCommunication,
          propValue: param.filterModel.lastCommunicationFilter.date,
          filterOperation:
            param.filterModel.lastCommunicationFilter.id === 3 ? filterOperationEnum.graterThenOrEqual : filterOperationEnum.lessThenOrEqual
        });
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
    }

    return requestParam;
  }
}
