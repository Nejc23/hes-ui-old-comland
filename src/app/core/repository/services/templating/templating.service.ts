import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getCommonRegisterGroups, getTemplatingDefaultValues } from '../../consts/templating.const';
import { IActionRequestGetCommonRegisterGroups } from '../../interfaces/myGridLink/action-prams.interface';
import { ResponseCommonRegisterGroup } from '../../interfaces/myGridLink/myGridLink.interceptor';
import { GetDefaultInformationResponse } from '../../interfaces/templating/get-default-information.request.interface';

@Injectable({
  providedIn: 'root'
})
export class TemplatingService {
  constructor(private repository: RepositoryService) {}

  getCommonRegisterGroups(request: IActionRequestGetCommonRegisterGroups): Observable<ResponseCommonRegisterGroup[]> {
    return this.repository.makeRequest(this.getCommonRegisterGroupsRequest(request));
  }

  getCommonRegisterGroupsRequest(request: IActionRequestGetCommonRegisterGroups): HttpRequest<any> {
    return new HttpRequest('POST', `${getCommonRegisterGroups}`, request);
  }

  getDefaultValues(templateId: string): Observable<GetDefaultInformationResponse> {
    return this.repository.makeRequest(this.getDefaultValuesRequest(templateId));
  }

  getDefaultValuesRequest(templateId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${getTemplatingDefaultValues}/${templateId}`);
  }
}
