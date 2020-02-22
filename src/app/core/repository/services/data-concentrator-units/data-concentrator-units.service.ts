import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { GridRequestParams } from '../../interfaces/helpers/gris-request-params.interface';
import { DataConcentratorUnitsList } from '../../interfaces/data-concentrator-units/data-concentrator-units-list.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { dataConcentratorUnits } from '../../consts/data-concentrator-units.const';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsService {
  constructor(private repository: RepositoryService) {}

  getGridDCU(param: GridRequestParams): Observable<GridResponse<DataConcentratorUnitsList>> {
    return this.repository.makeRequest(this.getGridDCURequest(param));
  }

  getGridDCURequest(param: GridRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', dataConcentratorUnits, param);
  }
}
