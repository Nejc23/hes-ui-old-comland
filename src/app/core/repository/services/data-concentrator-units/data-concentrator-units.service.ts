import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { GridRequestParams } from '../../interfaces/helpers/gris-request-params.interface';
import { DataConcentratorUnitsList } from '../../interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { dataConcentratorUnits, dcuFilters } from '../../consts/data-concentrator-units.const';
import { DcuFilter } from 'src/app/core/repository/interfaces/data-concentrator-units/dcu-filter.interface';

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

  getGridDcu2(param: any): Observable<any> {
    return this.repository.makeRequest(this.getGridDcuRequest2(param));
  }

  getGridDcuRequest2(param: any): HttpRequest<any> {
    return new HttpRequest('POST', '/api/2', param);
  }

  getDcuFilter(): Observable<DcuFilter[]> {
    return this.repository.makeRequest(this.getDcuFilterRequest());
  }

  getDcuFilterRequest(): HttpRequest<any> {
    return new HttpRequest('GET', dcuFilters);
  }

  saveDcuFilter(id: number, payload: DcuFilter): Observable<DcuFilter> {
    return this.repository.makeRequest(this.saveDcuFilterRequest(id, payload));
  }

  saveDcuFilterRequest(id: number, payload: DcuFilter): HttpRequest<DcuFilter> {
    return new HttpRequest('PUT', `${dcuFilters}/${id}`, payload as any);
  }

  deleteDcuFilter(id: number): Observable<DcuFilter> {
    return this.repository.makeRequest(this.deleteDcuFilterRequest(id));
  }

  deleteDcuFilterRequest(id: number): HttpRequest<DcuFilter> {
    return new HttpRequest('DELETE', `${dcuFilters}/${id}`);
  }

  createDcuFilter(payload: DcuFilter): Observable<DcuFilter> {
    return this.repository.makeRequest(this.createDcuFilterRequest(payload));
  }

  createDcuFilterRequest(payload: DcuFilter): HttpRequest<DcuFilter> {
    return new HttpRequest('POST', dcuFilters, payload as any);
  }
}
