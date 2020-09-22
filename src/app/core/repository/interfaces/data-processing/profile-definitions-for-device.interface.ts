export interface RegisterDefinitionsForDevice {
  deviceId: string;
  registerDefinitions: RegisterDefinition[];
}

export interface ProfileDefinitionsForDevice {
  deviceId: string;
  profileDefinitions: ProfileDefinition[];
}

export interface EventProfileDefinitionsForDevice {
  deviceId: string;
  eventProfileDefinitions: EventProfileDefinition[];
}

export interface EventProfileDefinition {
  eventProfileId: string;
  eventRegisterDefinition: EventRegisterDefinition[];
}

export interface EventRegisterDefinition {
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
  registerValues: EventRegisterValue[];
}

export interface EventRegisterValue {
  value: number;
  timestamp: string;
}

export interface EventRegisterValue {
  value: number;
  status?: number;
  timestamp: string;
}
