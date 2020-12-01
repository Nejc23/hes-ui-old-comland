import { basePathDcOperations, dcLastStatus } from './../../consts/data-concentrator-units.const';
import { IActionResponseDcuFwUpgradeData } from './../../interfaces/myGridLink/action-prams.interface';
import { IActionResponseParams } from 'src/app/core/repository/interfaces/myGridLink/action-prams.interface';
import { onDemandCiiState, onDemandCiiActivate, onDemandCiiDeactivate } from './../../consts/my-grid-link.const';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { dcOperationFwUpgrade, dcOperationSynchronizeTime } from '../../consts/data-concentrator-units.const';
import { RequestFilterParams, ResponseData } from '../../interfaces/data-concentrator-units/dc-operation-simple.interface';
import { IActionRequestDcuFwUpgradeData, IActionRequestParams } from '../../interfaces/myGridLink/action-prams.interface';
import { LastStatus } from '../../interfaces/myGridLink/myGridLink.interceptor';

@Injectable({
  providedIn: 'root'
})
export class DataConcentratorUnitsOperationsService {
  constructor(private repository: RepositoryService) {}

  // connect device
  postDcSynchronizeTime(params: IActionRequestParams): Observable<ResponseData> {
    return this.repository.makeRequest(this.postDcSynchronizeTimeRequest(params));
  }

  postDcSynchronizeTimeRequest(params: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${dcOperationSynchronizeTime}`, params);
  }

  postDcFwUpgrade(params: IActionRequestDcuFwUpgradeData): Observable<IActionResponseDcuFwUpgradeData> {
    return this.repository.makeRequest(this.postDcFwUpgradeRequest(params));
  }

  postDcFwUpgradeRequest(params: IActionRequestDcuFwUpgradeData): HttpRequest<any> {
    return new HttpRequest('POST', `${dcOperationFwUpgrade}`, params);
  }

  getDcLastStatus(requestId: string): Observable<LastStatus[]> {
    return this.repository.makeRequest(this.getDcLastStatusRequest(requestId));
  }

  getDcLastStatusRequest(requestId: string): HttpRequest<LastStatus[]> {
    return new HttpRequest('GET', `${basePathDcOperations}/${requestId}${dcLastStatus}`);
  }
}
