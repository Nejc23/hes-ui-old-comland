import { SchedulableRegistersResponse } from 'src/app/core/repository/interfaces/registers-select/schedulable-registers-response.interface';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { RegistersSelectList } from '../../interfaces/registers-select/registers-select-list.interface';
import { GridBulkActionRequestParams } from '../../interfaces/helpers/grid-bulk-action-request-params.interface';
import { deviceRegisters, onDemandReadMeter, registers, templateGroups } from '../../consts/meter-units.const';
import { IActionRequestAddTemplate, IActionResponseAddTemplate } from '../../interfaces/myGridLink/action-prams.interface';
import { SchedulableRegisters } from '../../interfaces/registers-select/schedulable-registers-type.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistersSelectService {
  constructor(private repository: RepositoryService) {}

  getDeviceRegisters(param: GridBulkActionRequestParams): Observable<RegistersSelectList[]> {
    return this.repository.makeRequest(this.getDeviceRegistersSchedulableRequest(param));
  }

  getDeviceRegistersSchedulableRequest(param: GridBulkActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${registers}?type=schedulable`, param);
  }

  getDeviceRegistersRequest(param: GridBulkActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', registers, param);
  }

  getSchedulableRegisters(param: GridBulkActionRequestParams): Observable<SchedulableRegistersResponse> {
    return this.repository.makeRequest(this.getSchedulableRegistersRequest(param));
  }

  getSchedulableRegistersRequest(param: GridBulkActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${deviceRegisters}`, param);
  }

  getDeviceTemplateGroups(param: GridBulkActionRequestParams): Observable<SchedulableRegisters> {
    return this.repository.makeRequest(this.getDeviceTemplateGroupsRequest(param));
  }

  getDeviceTemplateGroupsRequest(param: GridBulkActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${templateGroups}`, param);
  }

  postOnDemandReadMeter(params: IActionRequestAddTemplate): Observable<IActionResponseAddTemplate> {
    return this.repository.makeRequest(this.postOnDemandReadMeterRequest(params));
  }

  postOnDemandReadMeterRequest(params: IActionRequestAddTemplate): HttpRequest<any> {
    return new HttpRequest('POST', `${onDemandReadMeter}`, params);
  }
}
