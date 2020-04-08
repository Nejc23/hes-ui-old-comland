import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import {
  meterUnitTypes,
  meterUnitFirmwares,
  meterUnitBreakerStates,
  meterUnitStatuses,
  meterUnitTags,
  meterUnitVendors
} from '../../consts/meter-units.const';

@Injectable({
  providedIn: 'root'
})
export class CodelistMeterUnitsRepositoryService {
  constructor(private repository: RepositoryService) {}

  // get all available meter unit types
  meterUnitTypeCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitTypeCodelistRequest());
  }
  meterUnitTypeCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', meterUnitTypes);
  }

  meterUnitStatusCodelist(meterUnitTypeId: number): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitStatusCodelistRequest(meterUnitTypeId));
  }
  meterUnitStatusCodelistRequest(id: number): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitStatuses}/${id}`);
  }

  meterUnitTagCodelist(meterUnitTypeId: number): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitTagCodelistRequest(meterUnitTypeId));
  }
  meterUnitTagCodelistRequest(id: number): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitTags}/${id}`);
  }

  meterUnitFirmwareCodelist(meterUnitTypeId: number): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitFirmwareCodelistRequest(meterUnitTypeId));
  }
  meterUnitFirmwareCodelistRequest(id: number): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitFirmwares}/${id}`);
  }

  meterUnitBreakerStateCodelist(meterUnitTypeId: number): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitBreakerStateCodelistRequest(meterUnitTypeId));
  }
  meterUnitBreakerStateCodelistRequest(id: number): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitBreakerStates}/${id}`);
  }

  meterUnitVendorCodelist(meterUnitTypeId: number): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterUnitVendorCodelistRequest(meterUnitTypeId));
  }
  meterUnitVendorCodelistRequest(id: number): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `${meterUnitVendors}/${id}`);
  }
}
