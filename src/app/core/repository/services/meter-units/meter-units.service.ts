import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { GridRequestParams } from '../../interfaces/helpers/gris-request-params.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { meterUnits, meterUnitsTypeLayout } from '../../consts/data-concentrator-units.const';
import { MeterUnitsList } from '../../interfaces/meter-units/meter-units-list.interface';
import { MeterUnitsTypeLayout } from '../../interfaces/meter-units/meter-units-type-layout.interface';

@Injectable({
  providedIn: 'root'
})
export class MeterUnitsService {
  constructor(private repository: RepositoryService) {}

  getGridMeterUnits(param: GridRequestParams): Observable<GridResponse<MeterUnitsList>> {
    return this.repository.makeRequest(this.getGridMeterUnitsRequest(param));
  }

  getGridMeterUnitsRequest(param: GridRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', meterUnits, param);
  }

  getMeterUnitsTypeLayout(typeId: number): Observable<MeterUnitsTypeLayout[]> {
    return this.repository.makeRequest(this.getMeterUnitsTypeLayoutRequest(typeId));
  }

  getMeterUnitsTypeLayoutRequest(typeId: number): HttpRequest<any> {
    return new HttpRequest('GET', `${meterUnits}/${typeId}/${meterUnitsTypeLayout}`);
  }

  saveMeterUnitsTypeLayout(typeId: number, id: number, payload: MeterUnitsTypeLayout): Observable<MeterUnitsTypeLayout> {
    return this.repository.makeRequest(this.saveMeterUnitsTypeFilterRequest(typeId, id, payload));
  }

  saveMeterUnitsTypeFilterRequest(typeId: number, id: number, payload: MeterUnitsTypeLayout): HttpRequest<MeterUnitsTypeLayout> {
    return new HttpRequest('PUT', `${meterUnits}/${typeId}/${meterUnitsTypeLayout}/${id}`, payload as any);
  }

  deleteMeterUnitsTypeLayout(typeId: number, id: number): Observable<MeterUnitsTypeLayout> {
    return this.repository.makeRequest(this.deleteMeterUnitsTypeLayoutRequest(typeId, id));
  }

  deleteMeterUnitsTypeLayoutRequest(typeId: number, id: number): HttpRequest<MeterUnitsTypeLayout> {
    return new HttpRequest('DELETE', `${meterUnits}/${typeId}/${meterUnitsTypeLayout}/${id}`);
  }

  createMeterUnitsTypeLayout(typeId: number, payload: MeterUnitsTypeLayout): Observable<MeterUnitsTypeLayout> {
    return this.repository.makeRequest(this.createMeterUnitsTypeLayoutRequest(typeId, payload));
  }

  createMeterUnitsTypeLayoutRequest(typeId: number, payload: MeterUnitsTypeLayout): HttpRequest<MeterUnitsTypeLayout> {
    return new HttpRequest('POST', `${meterUnits}/${typeId}/${meterUnitsTypeLayout}`, payload as any);
  }
}
