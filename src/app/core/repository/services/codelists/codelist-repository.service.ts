import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { CodelistPowerline } from 'src/app/shared/repository/interfaces/codelists/codelist-powerline.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import {
  dcuStatuses,
  dcuTags,
  dcuTypes,
  dcuVendors,
  meterTypes,
  firmwares,
  brakerStates
} from '../../consts/data-concentrator-units.const';

@Injectable({
  providedIn: 'root'
})
export class CodelistRepositoryService {
  constructor(private repository: RepositoryService) {}

  dcuStatusCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.dcuStatusCodelistRequest());
  }
  dcuStatusCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', dcuStatuses);
  }

  dcuTagCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.dcuTagCodelistRequest());
  }
  dcuTagCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', dcuTags);
  }

  dcuTypeCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.dcuTypeCodelistRequest());
  }
  dcuTypeCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', dcuTypes);
  }

  dcuVendorCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.dcuVendorCodelistRequest());
  }
  dcuVendorCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', dcuVendors);
  }

  meterTypeCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.meterTypeCodelistRequest());
  }
  meterTypeCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', meterTypes);
  }

  firmwareCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.firmwareCodelistRequest());
  }
  firmwareCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', firmwares);
  }

  breakerStateCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.breakerStateCodelistRequest());
  }
  breakerStateCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', brakerStates);
  }
}
