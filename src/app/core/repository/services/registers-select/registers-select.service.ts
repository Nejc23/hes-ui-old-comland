import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { RegistersSelectList } from '../../interfaces/registers-select/registers-select-list.interface';
import { GridBulkActionRequestParams } from '../../interfaces/helpers/grid-bulk-action-request-params.interface';
import { registers } from '../../consts/meter-units.const';
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

  getDeviceSchedulableRegisters(param: GridBulkActionRequestParams): Observable<SchedulableRegisters> {
    return this.repository.makeRequest(this.getDeviceSchedulableRegistersRequest(param));
  }

  getDeviceSchedulableRegistersRequest(param: GridBulkActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', `${registers}/schedulable`, param);
  }
}
