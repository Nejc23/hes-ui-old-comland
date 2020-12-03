import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { getCommonRegisterGroups } from '../../consts/templating.const';
import { DisplayGroup } from '../../interfaces/templating/display-group.interface';
import { GetCommonRegisterGroupsRequest } from '../../interfaces/templating/get-common-register-groups.request.interface';
import { IActionRequestGetCommonRegisterGroups } from '../../interfaces/myGridLink/action-prams.interface';

@Injectable({
  providedIn: 'root'
})
export class TemplatingService {
  constructor(private repository: RepositoryService) {}

  getCommonRegisterGroups(request: IActionRequestGetCommonRegisterGroups): Observable<DisplayGroup[]> {
    return this.repository.makeRequest(this.getCommonRegisterGroupsRequest(request));
  }

  getCommonRegisterGroupsRequest(request: IActionRequestGetCommonRegisterGroups): HttpRequest<any> {
    return new HttpRequest('POST', `${getCommonRegisterGroups}`, request);
  }
}
