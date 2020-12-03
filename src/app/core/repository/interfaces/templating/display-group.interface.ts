export interface DisplayGroup {
  displayGroupId: string;
  name: string;
  obisCode: string;
  classId: number;
  attributeId: number;
  type: string;
  maxEntries: 25;
  displayRegisterDefinitions: DisplayRegisterDefinition[];
}

export interface DisplayRegisterDefinition {
  displayRegisterDefinitionId: string;
  name: string;
  obisCode: string;
  classId: number;
  attributeId: number;
}
