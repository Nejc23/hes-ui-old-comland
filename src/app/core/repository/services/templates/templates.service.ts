import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getCommonRegisterGroups, getTemplatingDefaultValues } from '../../consts/templating.const';
import { GetCommonRegisterGroupsRequest } from '../../interfaces/templating/get-common-register-groups.request.interface';
import { IActionRequestGetCommonRegisterGroups } from '../../interfaces/myGridLink/action-prams.interface';
import { ResponseCommonRegisterGroup } from '../../interfaces/myGridLink/myGridLink.interceptor';
import { GetDefaultInformationResponse } from '../../interfaces/templating/get-default-information.request.interface';
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
