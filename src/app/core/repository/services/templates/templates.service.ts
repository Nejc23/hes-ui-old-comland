import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetKeyTypesResponse } from '../../interfaces/templates/get-key-types-reponse.interface';
import { getTemplateKeyTypes } from '../../consts/templates.const';

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {
  constructor(private repository: RepositoryService) {}

  getKeyTypes(): Observable<GetKeyTypesResponse> {
    return this.repository.makeRequest(this.getKeyTypesRequest());
  }

  getKeyTypesRequest(): HttpRequest<any> {
    return new HttpRequest('GET', `${getTemplateKeyTypes}`);
  }
}
