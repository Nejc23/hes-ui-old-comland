export interface ValidateIpAddressRequest {
  deviceId: string;
  ipAddress: string;
}

export enum ValidateIpAddressStatus {
  VALID,
  INVALID,
  DUPLICATED
}
