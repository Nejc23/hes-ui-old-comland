export interface SchedulableRegisters {
  allHaveTemplate: boolean;
  schedulableRegistersTypes: Array<SchedulableRegistersType>;
}

export interface SchedulableRegistersType {
  name: string;
  isSelectable: boolean;
}
