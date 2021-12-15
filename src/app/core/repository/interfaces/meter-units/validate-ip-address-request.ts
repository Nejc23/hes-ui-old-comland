export interface ValidateIpAddressRequest {
  deviceId: string;
  ipAddress: string;
  port: number;
  interfaceType: number;
}

export enum ValidateIpAddressStatus {
  VALID,
  INVALID,
  VALID_DUPLICATED,
  INVALID_DUPLICATED
}
