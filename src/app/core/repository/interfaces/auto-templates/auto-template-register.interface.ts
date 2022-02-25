export interface AutoTemplateRegister {
  name?: string;
  groupName?: string;
  registerDefinitionId?: string;
  registerGroupId?: string;
  type?: string;
  categorization?: string;
  normalizationMode?: string; // (DoNotNormalize = 0 or Normalize = 1)
}
