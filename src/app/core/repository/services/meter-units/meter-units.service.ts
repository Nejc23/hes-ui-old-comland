import { filterSortOrderEnum } from './../../../../features/global/enums/filter-operation-global.enum';
import { IActionRequestParams } from './../../interfaces/myGridLink/action-prams.interface';
import { MeterUnitDetailsForm } from './../../../../features/meter-units/details/interfaces/meter-unit-form.interface';
import { RequestMeterUnitsForJob, ResponseMeterUnitsForJob } from '../../interfaces/meter-units/meter-units-for-job.interface';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { GridRequestParams } from '../../interfaces/helpers/grid-request-params.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { MeterUnitsList } from '../../interfaces/meter-units/meter-units-list.interface';
import { MeterUnitsLayout } from '../../interfaces/meter-units/meter-units-layout.interface';
import {
  meterUnits,
  meterUnitsLayout,
  meterUnitsBreakerState,
  touConfigImport,
  meterUnitsForJob,
  removeMeterUnitsFromJob,
  device,
  updateMeterUnit
} from '../../consts/meter-units.const';
import { v4 as uuidv4 } from 'uuid';
import { OnDemandRequestData } from '../../interfaces/myGridLink/myGridLink.interceptor';
import * as _ from 'lodash';
import { MeterUnitsTouConfigImport } from '../../interfaces/meter-units/meter-units-tou-config-import.interface';
import { RequestRemoveMeterUnitsFromJob } from '../../interfaces/meter-units/remove-meter-units-from-job.interface';
import { MeterUnit } from '../../interfaces/meter-units/meter-unit.interface';
import { MeterUnitDetails } from '../../interfaces/meter-units/meter-unit-details.interface';
import { MuUpdateRequest } from '../../interfaces/meter-units/mu-update-request.interface';
import { capitalize } from 'lodash';
import { filterOperationEnum } from 'src/app/features/global/enums/filter-operation-global.enum';
import { gridSysNameColumnsEnum } from 'src/app/features/global/enums/meter-units-global.enum';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsService {
  constructor(private repository: RepositoryService) {}

  getGridMeterUnitsForm(
    param: GridRequestParams,
    pageIndex: number,
    visibleColumnNames: string[]
  ): Observable<GridResponse<MeterUnitsList>> {
    const actionRequestParams = this.getActionRequestParams(param, pageIndex, visibleColumnNames);
    return this.repository.makeRequest(this.getGridMeterUnitsRequest(actionRequestParams));
  }

  getGridMeterUnits(param: IActionRequestParams): Observable<GridResponse<MeterUnitsList>> {
    // param.requestId = param.requestId === null ? uuidv4() : param.requestId;
    return this.repository.makeRequest(this.getGridMeterUnitsRequest(param));
  }

  getGridMeterUnitsRequest(param: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', meterUnits, param);
  }

  getMeterUnit(id: string): Observable<MeterUnitDetails> {
    return this.repository.makeRequest(this.getMeterUnitRequest(id));
  }

  getMeterUnitRequest(id: string): HttpRequest<any> {
    return new HttpRequest('GET', `${device}/${id}`);
  }

  updateReaderState(param: OnDemandRequestData[]): Observable<MeterUnitsList> {
    return this.repository.makeRequest(this.updateReaderStateRequest(param));
  }

  updateReaderStateRequest(param: OnDemandRequestData[]): HttpRequest<any> {
    return new HttpRequest('PUT', meterUnitsBreakerState, param);
  }

  getMeterUnitsLayout(typeId: number): Observable<MeterUnitsLayout[]> {
    return this.repository.makeRequest(this.getMeterUnitsLayoutRequest(typeId));
  }

  getMeterUnitsLayoutRequest(typeId: number): HttpRequest<any> {
    return new HttpRequest('GET', `${meterUnits}/${typeId}/${meterUnitsLayout}`);
  }

  saveMeterUnitsLayout(typeId: number, id: number, payload: MeterUnitsLayout): Observable<MeterUnitsLayout> {
    return this.repository.makeRequest(this.saveMeterUnitsFilterRequest(typeId, id, payload));
  }

  saveMeterUnitsFilterRequest(typeId: number, id: number, payload: MeterUnitsLayout): HttpRequest<MeterUnitsLayout> {
    return new HttpRequest('PUT', `${meterUnits}/${typeId}/${meterUnitsLayout}/${id}`, payload as any);
  }

  deleteMeterUnitsLayout(typeId: number, id: number): Observable<MeterUnitsLayout> {
    return this.repository.makeRequest(this.deleteMeterUnitsLayoutRequest(typeId, id));
  }

  deleteMeterUnitsLayoutRequest(typeId: number, id: number): HttpRequest<MeterUnitsLayout> {
    return new HttpRequest('DELETE', `${meterUnits}/${typeId}/${meterUnitsLayout}/${id}`);
  }

  createMeterUnitsLayout(typeId: number, payload: MeterUnitsLayout): Observable<MeterUnitsLayout> {
    return this.repository.makeRequest(this.createMeterUnitsLayoutRequest(typeId, payload));
  }

  createMeterUnitsLayoutRequest(typeId: number, payload: MeterUnitsLayout): HttpRequest<MeterUnitsLayout> {
    return new HttpRequest('POST', `${meterUnits}/${typeId}/${meterUnitsLayout}`, payload as any);
  }

  importConfigTou(payload: MeterUnitsTouConfigImport): Observable<any> {
    return this.repository.makeRequest(this.importConfigTouRequest(payload));
  }

  importConfigTouRequest(payload: MeterUnitsTouConfigImport): HttpRequest<any> {
    return new HttpRequest('POST', `${touConfigImport}`, payload);
  }

  getGridMeterUnitsForJob(param: RequestMeterUnitsForJob): Observable<ResponseMeterUnitsForJob> {
    param.requestId = param.requestId === null ? uuidv4() : param.requestId;
    return this.repository.makeRequest(this.getGridMeterUnitsForJobRequest(param));
  }

  getGridMeterUnitsForJobRequest(param: RequestMeterUnitsForJob): HttpRequest<any> {
    return new HttpRequest('POST', meterUnitsForJob, param);
  }

  removeMeterUnitsFromJob(payload: RequestMeterUnitsForJob): Observable<any> {
    payload.requestId = payload.requestId === null ? uuidv4() : payload.requestId;
    return this.repository.makeRequest(this.removeMeterUnitsFromJobRequest(payload));
  }

  removeMeterUnitsFromJobRequest(payload: RequestMeterUnitsForJob): HttpRequest<any> {
    return new HttpRequest('POST', removeMeterUnitsFromJob, payload as any);
  }

  updateMuFromForm(payload: MeterUnitDetailsForm): Observable<any> {
    const muRequest: MuUpdateRequest = {
      name: payload.name,
      address: payload.address,
      serialNumber: payload.id
    };

    return this.updateMu(payload.deviceId, muRequest);
  }

  updateMu(id: string, payload: MuUpdateRequest): Observable<any> {
    return this.repository.makeRequest(this.updateMuRequest(id, payload));
  }

  updateMuRequest(id: string, payload: MuUpdateRequest): HttpRequest<any> {
    return new HttpRequest('PUT', `${updateMeterUnit}/${id}`, payload as any);
  }

  getActionRequestParams(param: GridRequestParams, pageIndex: number, visibleColumnNames: string[]): IActionRequestParams {
    const pageSize = param.endRow - param.startRow;
    const requestParam: IActionRequestParams = {
      pageSize,
      pageNumber: pageIndex + 1,
      textSearch: {
        value: '',
        propNames: [],
        useWildcards: false
      },
      sort: []
    };

    requestParam.pageSize = param.endRow - param.startRow;
    requestParam.pageNumber = pageIndex + 1;

    if (param.searchModel && param.searchModel.length > 0 && param.searchModel[0].value.length > 0) {
      requestParam.textSearch.value = param.searchModel[0].value;
      requestParam.textSearch.propNames = visibleColumnNames;
      requestParam.textSearch.useWildcards = param.searchModel[0].useWildcards;
    }

    // create filter object
    if (param.filterModel) {
      requestParam.filter = [];
      if (param.filterModel.statuses && param.filterModel.statuses.length > 0) {
        param.filterModel.statuses.map((row) =>
          requestParam.filter.push({
            propName: capitalize(gridSysNameColumnsEnum.status),
            propValue: row.id.toString(),
            filterOperation: filterOperationEnum.equal
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
      if (param.filterModel.firmware && param.filterModel.firmware.length > 0) {
        param.filterModel.firmware.map((row) =>
          requestParam.filter.push({
            propName: capitalize(gridSysNameColumnsEnum.firmware),
            propValue: row.value,
            filterOperation: filterOperationEnum.contains
          })
        );
      }
      if (param.filterModel.disconnectorState && param.filterModel.disconnectorState.length > 0) {
        param.filterModel.disconnectorState.map((row) =>
          requestParam.filter.push({
            propName: capitalize(gridSysNameColumnsEnum.disconnectorState),
            propValue: row.id.toString(),
            filterOperation: filterOperationEnum.equal
          })
        );
      }
      if (param.filterModel.ciiState && param.filterModel.ciiState.length > 0) {
        param.filterModel.ciiState.map((row) =>
          requestParam.filter.push({
            propName: capitalize(gridSysNameColumnsEnum.ciiState),
            propValue: row.id.toString(),
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

      if (param.filterModel.protocol && param.filterModel.protocol.length > 0) {
        param.filterModel.protocol.map((row) =>
          requestParam.filter.push({
            propName: capitalize(gridSysNameColumnsEnum.protocol),
            propValue: row.id.toString(),
            filterOperation: filterOperationEnum.contains
          })
        );
      }
      if (param.filterModel.medium && param.filterModel.medium.length > 0) {
        param.filterModel.medium.map((row) =>
          requestParam.filter.push({
            propName: capitalize(gridSysNameColumnsEnum.medium),
            propValue: row.id.toString(),
            filterOperation: filterOperationEnum.contains
          })
        );
      }

      // show operations filter
      if (param.filterModel.showOptionFilter && param.filterModel.showOptionFilter.length > 0) {
        param.filterModel.showOptionFilter.map((row) => {
          if (row.id === 1) {
            requestParam.filter.push({
              propName: capitalize(gridSysNameColumnsEnum.hasTemplate),
              propValue: 'true',
              filterOperation: filterOperationEnum.equal
            });
          }
          if (row.id === 2) {
            requestParam.filter.push({
              propName: capitalize(gridSysNameColumnsEnum.hasTemplate),
              propValue: 'false',
              filterOperation: filterOperationEnum.equal
            });
          }
          if (row.id === 3) {
            requestParam.filter.push({
              propName: capitalize(gridSysNameColumnsEnum.readyForActivation),
              propValue: 'true',
              filterOperation: filterOperationEnum.equal
            });
          }
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
