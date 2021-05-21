export interface ThresholdValues {
  deviceId: string;
  registers: Register[];
}

export interface Register {
  registerName: string;
  registerId: string;
  registerData: RegisterData;
}

export interface RegisterData {
  value: string;
  unit: string;
  timestamp: string;
}
