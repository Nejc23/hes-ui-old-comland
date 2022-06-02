import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { capitalize } from 'lodash';
import { Observable } from 'rxjs';
import { EventMappingGroupCodeTablesDto } from 'src/app/api/templating/event-mapping-group-code-tables-dto';
import { TemplateDto } from 'src/app/api/templating/template-dto';
import { TemplateList } from 'src/app/api/templating/template-list';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { filterSortOrderEnum } from 'src/app/features/global/enums/filter-operation-global.enum';
import {
  getCommonRegisterGroups,
  getEventMappingGroupCodeTables,
  getTemplate,
  getTemplatesList,
  getTemplatingDefaultValues
} from '../../consts/templating.const';
import { GridRequestParams } from '../../interfaces/helpers/grid-request-params.interface';
import { GridResponse } from '../../interfaces/helpers/grid-response.interface';
import { IActionRequestGetCommonRegisterGroups, IActionRequestParams } from '../../interfaces/myGridLink/action-prams.interface';
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

  getGetEventMappingGroupCodeTables(): Observable<EventMappingGroupCodeTablesDto> {
    return this.repository.makeRequest(this.getGetEventMappingGroupCodeTablesRequest());
  }

  getGetEventMappingGroupCodeTablesRequest(): HttpRequest<any> {
    return new HttpRequest('GET', `${getEventMappingGroupCodeTables}`);
  }

  getTemplates(param: GridRequestParams, pageIndex: number, pageSize?): Observable<GridResponse<TemplateList>> {
    const actionRequestParams = this.getActionRequestParams(param, pageIndex, pageSize);
    return this.getTemplateList(actionRequestParams);
  }

  getTemplateList(param: IActionRequestParams): Observable<GridResponse<TemplateList>> {
    return this.repository.makeRequest(this.getTemplateListRequest(param));
  }

  getTemplateListRequest(param: IActionRequestParams): HttpRequest<any> {
    return new HttpRequest('POST', getTemplatesList, param);
  }

  getTemplateDetail(templateId: string): Observable<TemplateDto> {
    return this.repository.makeRequest(this.getTemplateDetailRequest(templateId));
  }

  getTemplateDetailRequest(templateId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${getTemplate}/${templateId}`);
  }

  getActionRequestParams(param: GridRequestParams, pageIndex: number, pageSize?: number): IActionRequestParams {
    const requestParam: IActionRequestParams = {
      pageSize,
      pageNumber: pageIndex + 1,
      textSearch: {
        value: '',
        propNames: ['all'],
        useWildcards: false
      },
      sort: [],
      filter: []
    };

    if (param.searchModel && param.searchModel.length > 0 && param.searchModel[0].value.length > 0) {
      requestParam.textSearch.value = param.searchModel[0].value;
      requestParam.textSearch.propNames = ['name', 'description'];
      requestParam.textSearch.useWildcards = param.searchModel[0].useWildcards;
    }

    if (param.sortModel && param.sortModel.length > 0) {
      param.sortModel.map((row) =>
        requestParam.sort.push({
          propName: capitalize(row.colId),
          index: 0,
          sortOrder: row.sort === 'asc' ? filterSortOrderEnum.asc : filterSortOrderEnum.desc
        })
      );
    }

    return requestParam;
  }
}
