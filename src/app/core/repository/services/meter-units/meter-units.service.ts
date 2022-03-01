import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { capitalize } from 'lodash';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { filterOperationEnum } from 'src/app/features/global/enums/filter-operation-global.enum';
import { gridSysNameColumnsEnum } from 'src/app/features/global/enums/meter-units-global.enum';
import { MuForm } from 'src/app/features/meter-units/types/interfaces/mu-form.interface';
import { MuUpdateForm } from 'src/app/features/meter-units/types/interfaces/mu-update-form.interface';
import { v4 as uuidv4 } from 'uuid';
import {
  device,
  meterUnits,
  meterUnitsBreakerState,
  meterUnitsForJob,
  meterUnitsLayout,
  removeMeterUnitsFromJob,
  touConfigImport,
  validateHostname
} from '../../consts/meter-units.const';
import { GridRequestParams } from '../../interfaces/helpers/grid-request-params.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { MeterUnitDetails } from '../../interfaces/meter-units/meter-unit-details.interface';
import { RequestMeterUnitsForJob, ResponseMeterUnitsForJob } from '../../interfaces/meter-units/meter-units-for-job.interface';
import { MeterUnitsLayout } from '../../interfaces/meter-units/meter-units-layout.interface';
import { MeterUnitsList } from '../../interfaces/meter-units/meter-units-list.interface';
import { MeterUnitsTouConfigImport } from '../../interfaces/meter-units/meter-units-tou-config-import.interface';
import { MuUpdatePlcRequest, MuUpdateRequest } from '../../interfaces/meter-units/mu-update-request.interface';
import { ValidateMeterHostnameRequest } from '../../interfaces/meter-units/validate-ip-address-request';
import { OnDemandRequestData } from '../../interfaces/myGridLink/myGridLink.interceptor';
import { filterSortOrderEnum } from './../../../../features/global/enums/filter-operation-global.enum';
import { getDevice, getMeters, muCreate, muUpdate } from './../../consts/meter-units.const';
import { MuCreateRequest } from './../../interfaces/meter-units/mu-create.interface';
import { IActionRequestParams } from './../../interfaces/myGridLink/action-prams.interface';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsService {
  return;
  requestParam;

  constructor(private repository: RepositoryService) {}

  getGridMeterUnitsForm(
    param: GridRequestParams,
    pageIndex: number,
    pageSize: number,
    visibleColumnNames: string[]
  ): Observable<GridResponse<MeterUnitsList>> {
    const actionRequestParams = this.getActionRequestParams(param, pageIndex, pageSize, visibleColumnNames);
    return this.repository.makeRequest(this.getGridMeterUnitsRequest(actionRequestParams));
  }

  getGridMeterUnits(param: IActionRequestParams): Observable<GridResponse<MeterUnitsList>> {
    // param.requestId = param.requestId === null ? uuidv4() : param.requestId;
    return this.repository.makeRequest(this.getGridMeterUnitsRequest(param));
  }

  getGridMeterUnitsRequest(param: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', getMeters, param);
  }

  getMeterUnit(id: string): Observable<MeterUnitDetails> {
    return this.repository.makeRequest(this.getMeterUnitRequest(id));
  }

  getMeterUnitRequest(id: string): HttpRequest<any> {
    return new HttpRequest('GET', `${device}/${id}`);
  }

  getMeterUnitFromConcentrator(id: string): Observable<MeterUnitDetails> {
    return this.repository.makeRequest(this.getMeterUnitFromConcentratorRequest(id));
  }

  getMeterUnitFromConcentratorRequest(id: string): HttpRequest<any> {
    return new HttpRequest('GET', `${getDevice}/${id}`);
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

  createMuForm(payload: MuForm): Observable<string> {
    const muRequest: MuCreateRequest = {
      name: payload.name,
      serialNumber: payload.serialNumber,
      manufacturer: payload.manufacturer?.id,
      templateId: payload.template?.id,
      interfaceType: payload.communicationType,
      driver: 2, // DLMS
      medium: 1, // ELECTRICITY
      jobIds: payload.jobIds,
      hostname: payload.hostname,
      port: payload.port,
      referencingType: payload.referencingType,
      advancedInformation: {
        authenticationType: payload.authenticationType,
        ldnAsSystitle: payload.advancedInformation?.ldnAsSystitle,
        startWithRelease: payload.advancedInformation?.startWithRelease
      },
      externalId: payload.externalId
    };

    if (payload.wrapperInformation) {
      muRequest.wrapperInformation = {
        clientAddress: payload.wrapperInformation.clientAddress,
        serverAddress: payload.wrapperInformation.serverAddress,
        publicClientAddress: payload.wrapperInformation.publicClientAddress,
        publicServerAddress: payload.wrapperInformation.publicServerAddress,
        physicalAddress: payload.wrapperInformation.physicalAddress,
        isGateWay: payload.wrapperInformation.isGateWay
      };
    }
    if (payload.hdlcInformation) {
      muRequest.hdlcInformation = {
        clientLow: payload.hdlcInformation.clientLow,
        clientHigh: payload.hdlcInformation.clientHigh,
        serverLow: payload.hdlcInformation.serverLow,
        serverHigh: payload.hdlcInformation.serverHigh,
        publicClientLow: payload.hdlcInformation.publicClientLow,
        publicClientHigh: payload.hdlcInformation.publicClientHigh,
        publicServerLow: payload.hdlcInformation.publicServerLow,
        publicServerHigh: payload.hdlcInformation.publicServerHigh
      };
    }
    return this.createMu(muRequest);
  }

  createMu(payload: MuCreateRequest): Observable<string> {
    return this.repository.makeRequest(this.createMuRequest(payload));
  }

  createMuRequest(payload: MuCreateRequest): HttpRequest<any> {
    return new HttpRequest('POST', `${muCreate}`, payload as any);
  }

  updateMuForm(payload: MuUpdateForm): Observable<string> {
    const muRequest: MuUpdateRequest = {
      name: payload.name,
      manufacturer: payload.manufacturer?.id,
      hostname: payload.hostname,
      port: payload.port,
      serialNumber: payload.serialNumber,
      templateId: payload.template?.id ? payload.template?.id : null,
      interfaceType: payload.communicationType,
      driver: payload.driver,
      referencingType: payload.referencingType,
      externalId: payload.externalId
    };

    if (payload.advancedInformation) {
      muRequest.advancedInformation = {
        authenticationType: payload.authenticationType,
        ldnAsSystitle: payload.advancedInformation?.ldnAsSystitle,
        startWithRelease: payload.advancedInformation?.startWithRelease
      };
    }

    if (payload.wrapperInformation) {
      muRequest.wrapperInformation = {
        clientAddress: payload.wrapperInformation.clientAddress,
        serverAddress: payload.wrapperInformation.serverAddress,
        publicClientAddress: payload.wrapperInformation.publicClientAddress,
        publicServerAddress: payload.wrapperInformation.publicServerAddress,
        physicalAddress: payload.wrapperInformation.physicalAddress,
        isGateWay: payload.wrapperInformation.isGateWay
      };
    }
    if (payload.hdlcInformation) {
      muRequest.hdlcInformation = {
        clientLow: payload.hdlcInformation.clientLow,
        clientHigh: payload.hdlcInformation.clientHigh,
        serverLow: payload.hdlcInformation.serverLow,
        serverHigh: payload.hdlcInformation.serverHigh,
        publicClientLow: payload.hdlcInformation.publicClientLow,
        publicClientHigh: payload.hdlcInformation.publicClientHigh,
        publicServerLow: payload.hdlcInformation.publicServerLow,
        publicServerHigh: payload.hdlcInformation.publicServerHigh
      };
    }
    return this.updateMu(payload.deviceId, muRequest);
  }

  updateMuPlcForm(payload: MuUpdatePlcRequest): Observable<string> {
    const muRequest: MuUpdatePlcRequest = {
      name: payload.name,
      serialNumber: payload.serialNumber,
      externalId: payload.externalId,
      templateId: payload.templateId
    };
    return this.updateMuPlc(payload.deviceId, muRequest);
  }

  updateMu(deviceId: string, payload: MuUpdateRequest): Observable<string> {
    return this.repository.makeRequest(this.updateMuRequest(deviceId, payload));
  }

  updateMuRequest(deviceId: string, payload: MuUpdateRequest): HttpRequest<any> {
    return new HttpRequest('PUT', `${muUpdate}/${deviceId}`, payload as any);
  }

  updateMuPlc(deviceId: string, payload: MuUpdatePlcRequest): Observable<string> {
    return this.repository.makeRequest(this.updateMuPlcRequest(deviceId, payload));
  }

  updateMuPlcRequest(deviceId: string, payload: MuUpdatePlcRequest): HttpRequest<any> {
    return new HttpRequest('PUT', `${muUpdate}/${deviceId}`, payload as any);
  }

  validateHostname(hostname: string, port: number, deviceId: string, interfaceType: number): Observable<string> {
    const request: ValidateMeterHostnameRequest = {
      hostname: hostname,
      port: port,
      deviceId: deviceId,
      interfaceType: interfaceType
    };
    return this.repository.makeRequest(this.validateHostnameRequest(request));
  }

  validateHostnameRequest(request: ValidateMeterHostnameRequest): HttpRequest<any> {
    return new HttpRequest('POST', validateHostname, request);
  }

  getActionRequestParams(param: GridRequestParams, pageIndex: number, pageSize: number, visibleColumnNames: string[]) {
    const requestParam: IActionRequestParams = {
      pageSize,
      pageNumber: pageIndex,
      textSearch: {
        value: '',
        propNames: [],
        useWildcards: false
      },
      sort: []
    };

    requestParam.pageSize = pageSize;
    requestParam.pageNumber = pageIndex;

    if (param.searchModel && param.searchModel.length > 0 && param.searchModel[0].value.length > 0) {
      requestParam.textSearch.value = param.searchModel[0].value;
      requestParam.textSearch.propNames = visibleColumnNames;
      requestParam.textSearch.useWildcards = param.searchModel[0].useWildcards;
    }

    // create filter object
    if (param.filterModel) {
      requestParam.filter = [];
      if (param.filterModel.states && param.filterModel.states.length > 0) {
        param.filterModel.states.map((row) =>
          requestParam.filter.push({
            propName: capitalize(gridSysNameColumnsEnum.state),
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
            propName: capitalize(gridSysNameColumnsEnum.protocolType),
            propValue: row.id.toString(),
            filterOperation: filterOperationEnum.equal
          })
        );
      }
      if (param.filterModel.medium && param.filterModel.medium.length > 0) {
        param.filterModel.medium.map((row) =>
          requestParam.filter.push({
            propName: capitalize(gridSysNameColumnsEnum.medium),
            propValue: row.id.toString(),
            filterOperation: filterOperationEnum.equal
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
          if (row.id === 4) {
            requestParam.filter.push({
              propName: capitalize(gridSysNameColumnsEnum.isHls),
              propValue: 'true',
              filterOperation: filterOperationEnum.equal
            });
          }
          if (row.id === 5) {
            requestParam.filter.push({
              propName: capitalize(gridSysNameColumnsEnum.isHls),
              propValue: 'false',
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
