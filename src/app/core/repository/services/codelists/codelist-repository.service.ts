import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { CodelistPowerline } from 'src/app/shared/repository/interfaces/codelists/codelist-powerline.interface';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';

@Injectable({
  providedIn: 'root'
})
export class CodelistRepositoryService {
  constructor(private repository: RepositoryService) {}

  powerlineCodelist(): Observable<CodelistPowerline[]> {
    return this.repository.makeRequest(this.powerlineCodelistRequest());
  }

  powerlineCodelistRequest(): HttpRequest<CodelistPowerline[]> {
    return new HttpRequest('GET', `/api/codelists/powerlines`);
  }

  dashboardCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.dashboardCodelistRequest());
  }
  dashboardCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `/api/dashboards`);
  }

  accesssTypeCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.accesssTypeCodelistRequest());
  }
  accesssTypeCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', `/api/codelists/access-types`);
  }
}
