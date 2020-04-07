import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { meterUnitRegisters } from '../../consts/data-concentrator-units.const';
import { RegistersSelectList } from '../../interfaces/registers-select/registers-select-list.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistersSelectService {
  constructor(private repository: RepositoryService) {}

  getMeterUnitRegisters(): Observable<GridResponse<RegistersSelectList>> {
    return this.repository.makeRequest(this.getMeterUnitRegistersRequest());
  }

  getMeterUnitRegistersRequest(): HttpRequest<any> {
    return new HttpRequest('GET', meterUnitRegisters);
  }
}
