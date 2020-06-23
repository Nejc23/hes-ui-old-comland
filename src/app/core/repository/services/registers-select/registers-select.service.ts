import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { RegistersSelectList } from '../../interfaces/registers-select/registers-select-list.interface';
import { registers } from '../../consts/jobs.const';
import { GridBulkActionRequestParams } from '../../interfaces/helpers/grid-bulk-action-request-params.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistersSelectService {
  constructor(private repository: RepositoryService) {}

  getDeviceRegisters(param: GridBulkActionRequestParams): Observable<RegistersSelectList[]> {
    return this.repository.makeRequest(this.getDeviceRegistersRequest(param));
  }

  getDeviceRegistersRequest(param: GridBulkActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', registers, param);
  }
}
