import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { Sample } from '../../interfaces/samples/samples-interface';

@Injectable({
  providedIn: 'root'
})
export class SampleService {
  constructor(private repository: RepositoryService) {}

  sample(): Observable<Sample[]> {
    return this.repository.makeRequest(this.sampleRequest());
  }

  sampleRequest(): HttpRequest<Sample[]> {
    return new HttpRequest('GET', `/api/sample`);
  }
}
