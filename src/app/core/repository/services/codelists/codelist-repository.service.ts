import { jobsDiscoveryJobs, jobsReadingJobs } from './../../consts/jobs.const';
import { CodelistExt } from 'src/app/shared/repository/interfaces/codelists/codelist-ext.interface';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { Codelist } from 'src/app/shared/repository/interfaces/codelists/codelist.interface';
import { dcuStatuses, dcuTags, dcuTypes, dcuVendors } from '../../consts/data-concentrator-units.const';
import { companies } from '../../consts/authentication-endpoint-url.const';
import { timeUnitCodes } from '../../consts/jobs.const';

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

  companyCodelist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.companyCodelistRequest());
  }
  companyCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', companies);
  }

  timeUnitCodeslist(): Observable<Codelist<number>[]> {
    return this.repository.makeRequest(this.timeUnitCodelistRequest());
  }

  timeUnitCodelistRequest(): HttpRequest<Codelist<number>[]> {
    return new HttpRequest('GET', timeUnitCodes);
  }

  jobsDiscoveryJobsCodelist(): Observable<CodelistExt<string>[]> {
    return this.repository.makeRequest(this.jobsDiscoveryJobsCodelistRequest());
  }
  jobsDiscoveryJobsCodelistRequest(): HttpRequest<CodelistExt<string>[]> {
    return new HttpRequest('GET', jobsDiscoveryJobs);
  }

  jobsReadingJobsCodelistCodes(): Observable<CodelistExt<string>[]> {
    return this.repository.makeRequest(this.jobsReadingJobsCodelistCodesRequest());
  }

  jobsReadingJobsCodelistCodesRequest(): HttpRequest<CodelistExt<string>[]> {
    return new HttpRequest('GET', `${jobsReadingJobs}`);
  }
}
