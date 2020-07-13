import { AutoTemplateRule } from './auto-template-rule.interface';

export interface AutoTemplateList {
  templateId: string;
  name: string;
  rules: AutoTemplateRule[];
}
