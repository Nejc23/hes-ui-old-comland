export interface SchedulableRegisters {
  allHaveTemplate: boolean;
  schedulableRegistersTypes: Array<SchedulableRegistersTypes>;
}

export interface SchedulableRegistersTypes {
  name: string;
  isSelectable: boolean;
}
