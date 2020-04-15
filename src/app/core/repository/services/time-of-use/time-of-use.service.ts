import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { touConfigurations } from '../../consts/data-concentrator-units.const';
import { TimeOfUseConfigList } from '../../interfaces/time-of-use/time-of-use-config-list.interface';

@Injectable({
  providedIn: 'root'
})
export class TimeOfUseService {
  constructor(private repository: RepositoryService) {}

  getTouConfigList(): Observable<TimeOfUseConfigList[]> {
    return this.repository.makeRequest(this.getTouConfigListRequest());
  }

  getTouConfigListRequest(): HttpRequest<any> {
    return new HttpRequest('GET', touConfigurations);
  }
}
