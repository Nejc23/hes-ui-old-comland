import { onDemandCiiState, onDemandCiiActivate, onDemandCiiDeactivate } from './../../consts/my-grid-link.const';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { dcOperationSynchronizeTime } from '../../consts/data-concentrator-units.const';
import { RequestFilterParams, ResponseData } from '../../interfaces/data-concentrator-units/dc-operation-simple.interface';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsOperationsService {
  constructor(private repository: RepositoryService) {}

  // connect device
  postDcSynchronizeTime(params: RequestFilterParams): Observable<ResponseData> {
    return this.repository.makeRequest(this.postDcSynchronizeTimeRequest(params));
  }

  postDcSynchronizeTimeRequest(params: RequestFilterParams): HttpRequest<any> {
    return new HttpRequest('POST', `${dcOperationSynchronizeTime}`, params);
  }
}
