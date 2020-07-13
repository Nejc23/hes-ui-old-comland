import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { TemplatesList } from '../../interfaces/auto-templates/templates-list.interface';
import {
  templates,
  autoTemplateRules,
  autoTemplateRulesAdd,
  autoTemplateRulesUpdate,
  autoTemplateRulesDelete
} from '../../consts/auto-templates.const';
import { AutoTemplateRuleList, AutoTemplateRule } from '../../interfaces/auto-templates/auto-template-rule.interface';
import { Rule } from '../../interfaces/auto-templates/rule.interface';

@Injectable({
  providedIn: 'root'
})
export class AutoTemplatesService {
  constructor(private repository: RepositoryService) {}

  getTemplates(): Observable<TemplatesList[]> {
    return this.repository.makeRequest(this.getTemplatesRequest());
  }

  getTemplatesRequest(): HttpRequest<any> {
    return new HttpRequest('GET', templates);
  }

  getAutoTemplateRules(): Observable<AutoTemplateRuleList[]> {
    return this.repository.makeRequest(this.getAutoTemplateRulesRequest());
  }

  getAutoTemplateRulesRequest(): HttpRequest<any> {
    return new HttpRequest('GET', autoTemplateRules);
  }

  createAutoTemplateRule(rule: Rule): Observable<any> {
    return this.repository.makeRequest(this.createAutoTemplateRuleRequest(rule));
  }

  createAutoTemplateRuleRequest(param: Rule): HttpRequest<any> {
    return new HttpRequest('POST', autoTemplateRulesAdd, param);
  }

  updateAutoTemplateRule(rule: AutoTemplateRule): Observable<any> {
    return this.repository.makeRequest(this.updateAutoTemplateRuleRequest(rule));
  }

  updateAutoTemplateRuleRequest(param: AutoTemplateRule): HttpRequest<any> {
    return new HttpRequest('PUT', autoTemplateRulesUpdate, param);
  }

  deleteAutoTemplateRule(id: string): Observable<any> {
    return this.repository.makeRequest(this.deleteAutoTemplateRuleRequest(id));
  }

  deleteAutoTemplateRuleRequest(id: string): HttpRequest<any> {
    return new HttpRequest('DELETE', `${autoTemplateRulesDelete}/${id}`);
  }
}
