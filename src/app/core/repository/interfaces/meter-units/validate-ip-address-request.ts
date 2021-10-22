export interface ValidateIpAddressRequest {
  deviceId: string;
  ipAddress: string;
  interfaceType: number;
}

export enum ValidateIpAddressStatus {
  VALID,
  INVALID,
  VALID_DUPLICATED,
  INVALID_DUPLICATED
}
