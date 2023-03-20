import { AutoTemplateRegister } from './../../interfaces/auto-templates/auto-template-register.interface';
import { Injectable } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepositoryService } from 'src/app/core/repository/services/repository.service';
import { TemplatesList } from '../../interfaces/auto-templates/templates-list.interface';
import {
  getTemplates,
  autoTemplateRules,
  autoTemplateRulesAdd,
  autoTemplateRulesUpdate,
  autoTemplateRulesDelete,
  autoTemplateDevice,
  basePath,
  templates,
  autoJobRule
} from '../../consts/auto-templates.const';
import { AutoTemplateRuleList } from '../../interfaces/auto-templates/auto-template-rule.interface';
import { Rule } from '../../interfaces/auto-templates/rule.interface';
import { autoJobLinks } from '../../consts/jobs.const';

@Injectable({
  providedIn: 'root'
})
export class AutoTemplatesService {
  constructor(private repository: RepositoryService) {}

  getTemplates(): Observable<TemplatesList[]> {
    return this.repository.makeRequest(this.getTemplatesRequest());
  }

  getTemplatesRequest(): HttpRequest<any> {
    return new HttpRequest('GET', getTemplates);
  }

  getAutoTemplateRulesForTemplateId(templateId: string): Observable<AutoTemplateRuleList> {
    return this.repository.makeRequest(this.getAutoTemplateRulesForTemplateIdRequest(templateId));
  }

  getAutoTemplateRulesForTemplateIdRequest(templateId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${basePath}/${templates}/${templateId}/${autoTemplateRules}`);
  }

  createAutoTemplateRule(rule: Rule): Observable<any> {
    return this.repository.makeRequest(this.createAutoTemplateRuleRequest(rule));
  }

  createAutoTemplateRuleRequest(param: Rule): HttpRequest<any> {
    return new HttpRequest('POST', autoTemplateRulesAdd, param);
  }

  updateAutoTemplateRule(autoTemplateRuleId: string, propertyName: string, regex: string): Observable<any> {
    return this.repository.makeRequest(this.updateAutoTemplateRuleRequest(autoTemplateRuleId, propertyName, regex));
  }

  updateAutoTemplateRuleRequest(autoTemplateRuleId: string, propertyName: string, regex: string): HttpRequest<any> {
    return new HttpRequest('PUT', `${autoTemplateRulesUpdate}/${autoTemplateRuleId}`, {
      autoTemplateRuleId: autoTemplateRuleId,
      propertyName: propertyName,
      propertyValue: regex
    });
  }

  deleteAutoTemplateRule(id: string): Observable<any> {
    return this.repository.makeRequest(this.deleteAutoTemplateRuleRequest(id));
  }

  deleteAutoTemplateRuleRequest(id: string): HttpRequest<any> {
    return new HttpRequest('DELETE', `${autoTemplateRulesDelete}/${id}`);
  }

  getRegisters(deviceId: string): Observable<AutoTemplateRegister[]> {
    return this.repository.makeRequest(this.getRegistersRequest(deviceId));
  }

  getRegistersRequest(deviceId: string): HttpRequest<any> {
    return new HttpRequest('GET', `${autoTemplateDevice}/${deviceId}/registers?type=data`);
  }

  assignNewJobToTemplateRule(jobId: string, templateId: string) {
    return this.repository.makeRequest(this.postAssignNewJobToTemplateRequest(jobId, templateId));
  }

  postAssignNewJobToTemplateRequest(jobId: string, templateId: string): HttpRequest<any> {
    return new HttpRequest('POST', `${basePath}/${autoJobLinks}`, { templateId: templateId, jobId: jobId });
  }

  deleteJobFromTemplateRule(id: string): Observable<any> {
    return this.repository.makeRequest(this.deleteJobFromTemplateRuleRequest(id));
  }

  deleteJobFromTemplateRuleRequest(id: string): HttpRequest<any> {
    return new HttpRequest('DELETE', `${autoJobRule}/${id}`);
  }
}
