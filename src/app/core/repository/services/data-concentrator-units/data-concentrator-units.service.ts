import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { GridRequestParams, GridFilterParams } from '../../interfaces/helpers/gris-request-params.interface';
import { DataConcentratorUnitsList } from '../../interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { dataConcentratorUnits, dcuLayout, bulkDelete, dcuCreate } from '../../consts/data-concentrator-units.const';
import { DcuLayout } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-layout.interface';
import { GridBulkActionRequestParams } from '../../interfaces/helpers/grid-bulk-action-request-params.interface';
import { DcuForm } from 'src/app/features/data-concentrator-units/interfaces/dcu-form.interface';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsService {
  constructor(private repository: RepositoryService) {}

  getGridDcu(param: GridRequestParams): Observable<GridResponse<DataConcentratorUnitsList>> {
    return this.repository.makeRequest(this.getGridDcuRequest(param));
  }

  getGridDcuRequest(param: GridRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', dataConcentratorUnits, param);
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

  deleteDcu(object: GridBulkActionRequestParams): Observable<any> {
    return this.repository.makeRequest(this.deleteDcuRequest(object));
  }

  deleteDcuRequest(object: GridBulkActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${bulkDelete}`, object);
  }

  createDcu(payload: DcuForm): Observable<DcuForm> {
    return this.repository.makeRequest(this.createDcuRequest(payload));
  }

  createDcuRequest(payload: DcuForm): HttpRequest<DcuForm> {
    return new HttpRequest('POST', dcuCreate, payload as any);
  }
}
