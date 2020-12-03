import { SetDisplaySettingsRequest } from './../../interfaces/data-concentrator-units/dcu-operations/dcu-operations-params.interface';
import { basePathDcOperations, dcLastStatus, triggerSetDisplaySettings } from './../../consts/data-concentrator-units.const';
import { Injectable } from '@angular/core';
import { HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { dcOperationFwUpgrade, dcOperationSynchronizeTime } from '../../consts/data-concentrator-units.const';
import { RequestFilterParams, ResponseData } from '../../interfaces/data-concentrator-units/dc-operation-simple.interface';
import { IActionRequestParams } from '../../interfaces/myGridLink/action-prams.interface';
import { DcLastStatusResponse } from '../../interfaces/data-concentrator-units/dcu-operations/dcu-operations-params.interface';

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

  postDcFwUpgrade(formData: FormData): Observable<string> {
    return this.repository.makeRequest(this.postDcFwUpgradeRequest(formData));
  }

  postDcFwUpgradeRequest(formData: FormData): HttpRequest<any> {
    return new HttpRequest('POST', `${dcOperationFwUpgrade}`, formData);
  }

  getDcLastStatus(requestId: string): Observable<DcLastStatusResponse> {
    return this.repository.makeRequest(this.getDcLastStatusRequest(requestId));
  }

  getDcLastStatusRequest(requestId: string): HttpRequest<DcLastStatusResponse> {
    return new HttpRequest('GET', `${basePathDcOperations}/${requestId}${dcLastStatus}`);
  }

  setDisplaySettings(request: SetDisplaySettingsRequest): Observable<void> {
    return this.repository.makeRequest(this.setDisplaySettingsRequest(request));
  }

  setDisplaySettingsRequest(request: SetDisplaySettingsRequest): HttpRequest<any> {
    return new HttpRequest('POST', `${triggerSetDisplaySettings}`, request);
  }
}
