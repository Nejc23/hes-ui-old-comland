import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { UsersSample } from '../../interfaces/samples/users-sample.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersSampleService {
  constructor(private repository: RepositoryService) {}

  usersSample(params): Observable<UsersSample[]> {
    return this.repository.makeRequest(this.usersSampleRequest(params));
  }

  usersSampleRequest(params): HttpRequest<UsersSample[]> {
    return new HttpRequest('POST', `/api/usersSample`, params);
  }
}
