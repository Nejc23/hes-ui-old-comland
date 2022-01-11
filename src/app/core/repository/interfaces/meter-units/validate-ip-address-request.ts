export interface ValidateMeterHostnameRequest {
  deviceId: string;
  hostname: string;
  port: number;
  interfaceType: number;
}

export enum ValidateHostnameStatus {
  VALID,
  INVALID,
  VALID_DUPLICATED,
  INVALID_DUPLICATED
}
