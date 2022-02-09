/* tslint:disable */
/* eslint-disable */
import { ConcentratorType } from './concentrator-type';
import { ConcentratorVendorType } from './concentrator-vendor-type';
export interface AddConcentratorRequest {
  concentratorId: string;
  concentratorIp?: null | string;
  deviceId?: string;
  externalId?: null | string;
  hostname?: null | string;
  name: string;
  requestId: string;
  timeZoneInfo?: null | string;
  type: ConcentratorType;
  username?: null | string;
  vendor: ConcentratorVendorType;
}
