export interface AutoTemplateRuleList {
  templateId: string;
  autoTemplateRules: AutoTemplateRule[];
}

export interface AutoTemplateRule {
  autoTemplateRuleId: string;
  obis: string;
  regex: string;
}
