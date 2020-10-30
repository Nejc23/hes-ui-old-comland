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
  eventRegisterValues: RegisterValue[];
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
  value: number;
  status?: number;
  timestamp: string;
  description?: string;
}
