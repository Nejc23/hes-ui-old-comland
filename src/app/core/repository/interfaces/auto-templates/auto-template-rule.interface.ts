export interface AutoTemplateRuleList {
  templateId: string;
  autoTemplateRules: AutoTemplateRule[];
}

export interface AutoTemplateRule {
  autoTemplateRuleId: string;
  propertyName: string;
  propertyValue: string;
  jobIds: string[];
}
