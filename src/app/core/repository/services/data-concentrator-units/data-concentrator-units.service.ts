import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { GridRequestParams } from '../../interfaces/helpers/gris-request-params.interface';
import { DataConcentratorUnitsList } from '../../interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { dataConcentratorUnits, dcuFilters } from '../../consts/data-concentrator-units.const';
import { DcuFilter } from 'src/app/features/data-concentrator-units/interfaces/dcu-filter.interface';

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

  getDcuFilter(): Observable<DcuFilter[]> {
    return this.repository.makeRequest(this.getDcuFilterRequest());
  }

  getDcuFilterRequest(): HttpRequest<any> {
    return new HttpRequest('GET', dcuFilters);
  }
}
