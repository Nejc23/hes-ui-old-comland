import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { GridRequestParams } from '../../interfaces/helpers/gris-request-params.interface';
import { DataConcentratorUnitsList } from '../../interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { List } from 'lodash';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsService {
  constructor(private repository: RepositoryService) {}

  getGridDCU(id: number, param: GridRequestParams): Observable<List<GridResponse<DataConcentratorUnitsList>>> {
    return this.repository.makeRequest(this.getGridDCURequest(id, param));
  }

  getGridDCURequest(id: number, param: GridRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `/api/dcu/${id}`, param);
  }
}
