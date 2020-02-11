export interface CodelistPowerline {
  id: number;
  value: string;
  devices: CodelistDevice[];
}

export interface CodelistDevice {
  id: number;
  value: string;
}
