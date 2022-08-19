export interface RegisterDefinitionsForDevice {
  deviceId: string;
  registerDefinitions: RegisterDefinition[];
}

export interface ProfileDefinitionsForDevice {
  deviceId: string;
  profileDefinitions: ProfileDefinition[];
}

export interface EventProfileDefinitionsForDevice {
  requestId?: string;
  deviceId: string;
  eventProfileDefinitions: EventProfileDefinition[];
}

export interface EventProfileDefinition {
  requestId?: string;
  eventProfileId: string;
  eventRegisterDefinition: EventRegisterDefinition[];
}

export interface EventRegisterDefinition {
  requestId?: string;
  registerId: string;
  registerStatus: string;
  eventRegisterValues: EventRegisterValue[];
}

export interface ProfileDefinition {
  profileId: string;
  registerDefinitions: RegisterDefinition[];
}

export interface EventProfileDefinition {
  eventProfileId: string;
  eventRegisterDefinition: EventRegisterDefinition[];
}

export interface RegisterDefinition {
  registerId: string;
  registerStatus: string;
  registerValues: RegisterValue[];
}

export interface RegisterValue {
  requestId?: string;
  valueWithUnit?: ValueWithUnit; // row Values
  normValueWithUnit?: ValueWithUnit;
  status?: number;
  timestamp: string;
  description?: string;
  extendedTimestamp?: string;
}

export interface GridRegisterValue {
  requestId?: string;
  value?: string;
  unit?: string;
  status?: number;
  timestamp?: string;
  description?: string;
}

export interface ValueWithUnit {
  value: string;
  unit: string;
}

export type EventRegisterValue = RegisterValue & {
  value?: string;
};
