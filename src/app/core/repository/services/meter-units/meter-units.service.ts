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

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsService {
  constructor(private repository: RepositoryService) {}

  getGridMeterUnits(param: GridRequestParams): Observable<GridResponse<MeterUnitsList>> {
    param.requestId = param.requestId === null ? uuidv4() : param.requestId;
    return this.repository.makeRequest(this.getGridMeterUnitsRequest(param));
  }

  getGridMeterUnitsRequest(param: GridRequestParams): HttpRequest<any> {
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
      deviceId: payload.deviceId,
      name: payload.name,
      address: payload.address,
      serialNumber: payload.id
    };

    return this.updateMu(muRequest);
  }

  updateMu(payload: MuUpdateRequest): Observable<any> {
    return this.repository.makeRequest(this.updateMuRequest(payload));
  }

  updateMuRequest(payload: MuUpdateRequest): HttpRequest<any> {
    return new HttpRequest('PUT', `${updateMeterUnit}`, payload as any);
  }
}
